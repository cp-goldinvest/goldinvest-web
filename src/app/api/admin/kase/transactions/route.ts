import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const REGISTER_CODES = ["bela_kasa", "crna_kasa", "beli_lager", "crni_lager"] as const;
type RegisterCode = (typeof REGISTER_CODES)[number];

// GET - istorija akcija (ledger), filteri: ?register_code=&entry_type=&agent_id=&from=&to=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const registerCode = searchParams.get("register_code");
  const entryType = searchParams.get("entry_type");
  const agentId = searchParams.get("agent_id");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const isNetProfit = searchParams.get("is_net_profit");

  const supabase = createServiceClient();
  let query = supabase
    .from("register_transactions")
    .select("*, cash_registers:register_id(code, display_name), agents:agent_id(full_name)")
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (entryType) query = query.eq("entry_type", entryType);
  if (agentId) query = query.eq("agent_id", agentId);
  if (from) query = query.gte("occurred_at", from);
  if (to) query = query.lte("occurred_at", to);
  if (isNetProfit === "true") query = query.eq("is_net_profit", true);

  if (registerCode) {
    const { data: register, error: regErr } = await supabase
      .from("cash_registers")
      .select("id")
      .eq("code", registerCode)
      .single();
    if (regErr || !register) return NextResponse.json({ error: "Nepoznata kasa" }, { status: 404 });
    query = query.eq("register_id", register.id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - rucna akcija: pocetno stanje / korekcija stanja / transfer izmedju kasa.
// Body (initial/korekcija):
//   { register_code, entry_type: "initial"|"manual_adjustment", new_balance_rsd, reason, agent_id?, occurred_at? }
// Body (transfer):
//   { from_register_code, to_register_code, amount_rsd, reason, agent_id?, occurred_at? }
export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createServiceClient();

  // Transfer izmedju dve kase
  if (body.from_register_code || body.to_register_code) {
    const { from_register_code, to_register_code, amount_rsd, reason, agent_id, occurred_at } = body;

    if (!isRegisterCode(from_register_code) || !isRegisterCode(to_register_code)) {
      return NextResponse.json({ error: "from_register_code i to_register_code moraju biti validne kase" }, { status: 400 });
    }
    if (!amount_rsd || Number(amount_rsd) <= 0) {
      return NextResponse.json({ error: "amount_rsd mora biti pozitivan broj" }, { status: 400 });
    }
    if (!reason || !String(reason).trim()) {
      return NextResponse.json({ error: "Razlog je obavezan" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("transfer_between_registers", {
      p_from_code: from_register_code,
      p_to_code: to_register_code,
      p_amount_rsd: Number(amount_rsd),
      p_reason: String(reason),
      p_agent_id: agent_id ?? null,
      p_occurred_at: occurred_at ?? new Date().toISOString().slice(0, 10),
      p_created_by: null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ transfer_group_id: data }, { status: 201 });
  }

  // Pocetno stanje / rucna korekcija
  const { register_code, entry_type, new_balance_rsd, reason, agent_id, occurred_at, is_net_profit } = body;

  if (!isRegisterCode(register_code)) {
    return NextResponse.json({ error: "register_code mora biti validna kasa" }, { status: 400 });
  }
  if (!["initial", "manual_adjustment"].includes(entry_type)) {
    return NextResponse.json({ error: "entry_type mora biti 'initial' ili 'manual_adjustment'" }, { status: 400 });
  }
  if (new_balance_rsd === undefined || new_balance_rsd === null || Number.isNaN(Number(new_balance_rsd))) {
    return NextResponse.json({ error: "new_balance_rsd je obavezan" }, { status: 400 });
  }
  if (!reason || !String(reason).trim()) {
    return NextResponse.json({ error: "Razlog je obavezan" }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("set_register_balance", {
    p_register_code: register_code,
    p_new_balance_rsd: Number(new_balance_rsd),
    p_entry_type: entry_type,
    p_reason: String(reason),
    p_agent_id: agent_id ?? null,
    p_occurred_at: occurred_at ?? new Date().toISOString().slice(0, 10),
    p_created_by: null,
    p_is_net_profit: Boolean(is_net_profit),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

function isRegisterCode(value: unknown): value is RegisterCode {
  return typeof value === "string" && (REGISTER_CODES as readonly string[]).includes(value);
}
