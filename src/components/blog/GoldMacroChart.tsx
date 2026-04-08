export function GoldMacroChart() {
  // Purely illustrative, normalized (no real API data).
  const points = [2010, 2015, 2020, 2025];

  // Normalized illustrative series (gold grows, USD fluctuates, rates inverse).
  const gold = [100, 155, 205, 220];
  const usd = [100, 90, 110, 95];
  const rates = [5, 0, 5, 3]; // percentages

  const width = 700;
  const height = 300;
  const padLeft = 70;
  const padRight = 40;
  const padTop = 35;
  const padBottom = 55;
  const innerCenterY = padTop + (height - padTop - padBottom) / 2;
  const indexX = padLeft + 6;

  const yMin = 0;
  const yMax = 1;

  const normalize = (arr: number[], min: number, max: number) =>
    arr.map((v) => (max - min === 0 ? 0 : (v - min) / (max - min)));

  const goldNorm = normalize(gold, 100, 220);
  const usdNorm = normalize(usd, 90, 110);
  const ratesNorm = normalize(rates, 0, 5);

  // Map normalized values to SVG Y (higher value -> higher on chart).
  const xTo = (i: number) =>
    padLeft + ((width - padLeft - padRight) * i) / (points.length - 1);
  const yTo = (t: number) => padTop + (height - padTop - padBottom) * (1 - t);

  const goldPts = goldNorm.map((t, i) => `${xTo(i)},${yTo(t)}`).join(" ");
  const usdPts = usdNorm.map((t, i) => `${xTo(i)},${yTo(t)}`).join(" ");
  const ratesPts = ratesNorm.map((t, i) => `${xTo(i)},${yTo(t)}`).join(" ");

  return (
    <div className="my-8 bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-7 sm:px-8 sm:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <p
        className="m-0 mb-4 text-[#1B1B1C]"
        style={{
          fontFamily: "var(--font-pp-editorial), Georgia, serif",
          fontWeight: 400,
          fontSize: "clamp(20px, 2.2vw, 28px)",
          lineHeight: "1.2",
        }}
      >
        Zlato, dolar i kamatne stope - međusobni odnos
      </p>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div className="flex items-center gap-5 flex-wrap">
          <span className="inline-flex items-center gap-2 text-[#4C4C4C]" style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}>
            <span className="h-[3px] w-7 rounded-full bg-[#BF8E41]" aria-hidden />
            Zlato
          </span>
          <span className="inline-flex items-center gap-2 text-[#4C4C4C]" style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}>
            <span className="h-[3px] w-7 rounded-full bg-[#1B1B1C]" aria-hidden />
            USD
          </span>
          <span className="inline-flex items-center gap-2 text-[#4C4C4C]" style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}>
            <span className="h-[3px] w-7 rounded-full bg-[#8A8A8A]" aria-hidden />
            Kamatne stope
          </span>
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-left pointer-events-none"
          style={{
            color: "#9D9072",
            fontFamily: "var(--font-rethink), sans-serif",
            fontSize: 12,
            lineHeight: "1",
            whiteSpace: "nowrap",
          }}
          aria-hidden
        >
          indeks / %
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto rounded-xl bg-[#FDFCF9]" role="img" aria-label="Grafički prikaz odnosa zlata, USD i kamatnih stopa">
          {/* Subtle grid */}
          <line x1={padLeft} y1={padTop} x2={width - padRight} y2={padTop} stroke="#F0EDE6" />
          <line x1={padLeft} y1={(padTop + height - padBottom) / 2} x2={width - padRight} y2={(padTop + height - padBottom) / 2} stroke="#F0EDE6" />
          <line x1={padLeft} y1={height - padBottom} x2={width - padRight} y2={height - padBottom} stroke="#E7E1D4" />

          {/* Axis labels */}
          <text x={padLeft + 6} y={height - padBottom + 42} fill="#9D9072" fontSize="12" fontFamily="var(--font-rethink), sans-serif" textAnchor="start">
            vreme
          </text>

          {points.map((yr, i) => (
            <text
              key={yr}
              x={xTo(i)}
              y={height - padBottom + 20}
              fill="#9D9072"
              fontSize="12"
              fontFamily="var(--font-rethink), sans-serif"
              textAnchor="middle"
            >
              {yr}
            </text>
          ))}

          {/* Lines */}
          <polyline fill="none" stroke="#BF8E41" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={goldPts} />
          <polyline fill="none" stroke="#1B1B1C" strokeOpacity="0.65" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={usdPts} />
          <polyline fill="none" stroke="#8A8A8A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 6" points={ratesPts} />

          {/* End points */}
          {goldNorm.map((t, i) => (
            <circle key={`g-${i}`} cx={xTo(i)} cy={yTo(t)} r="5" fill="#BF8E41" />
          ))}
          {usdNorm.map((t, i) => (
            <circle key={`u-${i}`} cx={xTo(i)} cy={yTo(t)} r="5" fill="#1B1B1C" opacity="0.75" />
          ))}
          {ratesNorm.map((t, i) => (
            <circle key={`r-${i}`} cx={xTo(i)} cy={yTo(t)} r="4.5" fill="#8A8A8A" />
          ))}
        </svg>
      </div>

      <p
        className="m-0 mt-4 text-[#4C4C4C]"
        style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 13, lineHeight: "1.6em" }}
      >
        <span className="font-semibold text-[#BF8E41]">Zlato</span> raste kada su stope niske, a USD ima inverznu relaciju.
      </p>
    </div>
  );
}

