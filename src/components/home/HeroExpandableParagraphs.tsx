"use client";

import { Fragment, type CSSProperties, type ReactNode, useId, useState } from "react";

type Props = {
  paragraphs: ReactNode[];
  className?: string;
  style?: CSSProperties;
};

export function HeroExpandableParagraphs({ paragraphs, className, style }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();

  if (!paragraphs.length) return null;

  if (paragraphs.length === 1) {
    return (
      <div className={className} style={style}>
        {paragraphs[0]}
      </div>
    );
  }

  const [first, ...rest] = paragraphs;

  return (
    <div className={className} style={style}>
      {first}
      {!open ? (
        <p className="mt-3 mb-0">
          <button
            type="button"
            className="inline border-0 bg-transparent p-0 font-inherit cursor-pointer text-[#6B5E3F] underline decoration-[#BF8E41]/40 underline-offset-4 hover:text-[#1B1B1C] hover:decoration-[#BF8E41]"
            onClick={() => setOpen(true)}
            aria-expanded="false"
            aria-controls={`${id}-rest`}
          >
            …
            <span className="sr-only"> Prikaži ostatak teksta</span>
          </button>
        </p>
      ) : (
        <div id={`${id}-rest`} className="space-y-3 mt-3">
          {rest.map((node, i) => (
            <Fragment key={i}>{node}</Fragment>
          ))}
          <p className="mb-0">
            <button
              type="button"
              className="inline border-0 bg-transparent p-0 text-sm font-medium cursor-pointer text-[#6B5E3F] underline decoration-[#BF8E41]/40 underline-offset-4 hover:text-[#1B1B1C]"
              onClick={() => setOpen(false)}
              aria-expanded="true"
              aria-controls={`${id}-rest`}
            >
              Smanji
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
