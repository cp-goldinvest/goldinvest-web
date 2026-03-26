export function WorldGoldMap() {
  return (
    <div className="my-7 bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl p-4 sm:p-6">
      <svg
        viewBox="0 0 1000 520"
        className="w-full h-auto"
        role="img"
        aria-label="Mapa sveta sa označenim državama koje povećavaju kupovinu zlata"
      >
        {/* Base world map in gold */}
        <g fill="#BF8E41" opacity="0.95">
          {/* North America */}
          <path d="M90 165c42-34 125-55 194-41 41 8 67 34 89 58-27 7-46 14-55 30-11 20-33 29-57 34-32 6-45 23-72 36-31 16-72 11-103-9-27-18-42-58-39-108 1-2 2-3 3 0 9-2 21-4 40 0z" />
          {/* South America */}
          <path d="M290 290c22 6 38 20 47 41 9 22 9 45-2 66-8 16-11 35-19 50-12 24-33 47-56 60-19 10-42 5-53-14-10-18-5-34 4-52 8-15 15-33 18-49 6-28 23-57 61-102z" />
          {/* Europe + Asia */}
          <path d="M430 170c45-24 108-41 167-43 47-2 89 9 130 17 20 4 38 17 58 25 30 11 64 12 89 29 22 14 38 38 58 56-35 8-75 7-108 21-36 15-73 22-112 27-41 5-82 16-123 14-32-2-66-15-95-30-26-14-58-24-84-38-18-10-27-28-38-45-11-17-25-28-42-33 26 0 66 3 100 0z" />
          {/* Africa */}
          <path d="M505 240c37-1 73 8 94 33 20 23 31 52 35 82 3 22-5 46-18 65-16 23-32 49-57 63-21 12-50 11-68-5-17-14-20-39-28-59-10-27-27-50-24-81 2-23 13-40 20-60 8-24 18-39 46-38z" />
          {/* Australia */}
          <path d="M802 383c34-9 71-7 99 12 20 13 35 32 36 58-36 9-75 15-112 8-23-5-40-18-53-37-9-13-12-30-4-41 8-12 23-18 34-23z" />
        </g>

        {/* Highlighted countries/regions in black (approximate positions) */}
        <g fill="#1B1B1C">
          {/* China */}
          <ellipse cx="760" cy="238" rx="20" ry="13" />
          {/* Turkey */}
          <ellipse cx="620" cy="236" rx="11" ry="7" />
          {/* India */}
          <ellipse cx="704" cy="273" rx="12" ry="9" />
          {/* Singapore */}
          <circle cx="732" cy="305" r="4.8" />
          {/* Czech Republic */}
          <circle cx="585" cy="206" r="5.2" />
          {/* Poland */}
          <circle cx="596" cy="193" r="5.4" />
          {/* Gulf / Middle East region */}
          <ellipse cx="655" cy="262" rx="16" ry="10" />
        </g>
      </svg>

      <p
        className="mt-4 mb-0 text-[#6B6B6B]"
        style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 13, lineHeight: "1.6em" }}
      >
        <span className="inline-flex items-center gap-2 mr-5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#1B1B1C]" aria-hidden /> Istaknute države i regioni sa povećanom kupovinom zlata
        </span>
      </p>
    </div>
  );
}

