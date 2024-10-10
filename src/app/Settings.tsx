"use client";

import { useRouter } from "next/navigation";

import Select from "./Select";
import { Format, NumQBs, PPR } from "./types";

interface IProps {
  format: Format;
  numQbs: NumQBs;
  ppr: PPR;
}

export default function Settings({ format, numQbs, ppr }: IProps) {
  const router = useRouter();

  function updateSearchParams(key: string, value: string) {
    const nextUrlSearchParams = new URLSearchParams({
      numQbs,
      format,
      ppr,
      [key]: value,
    });

    router.replace(`/?${nextUrlSearchParams}`);
  }

  return (
    <div className="flex gap-2 items-center">
      <div className="w-20">
        <Select
          onChange={(value) => updateSearchParams("numQbs", value)}
          value={numQbs}
        >
          <option value="1">1QB</option>
          <option value="2">2QB</option>
        </Select>
      </div>
      <div className="w-28">
        <Select
          onChange={(value) => updateSearchParams("format", value)}
          value={format}
        >
          <option value="dynasty">Dynasty</option>
          <option value="redraft">Redraft</option>
        </Select>
      </div>
      <p>league with</p>
      <div className="w-16">
        <Select
          onChange={(value) => updateSearchParams("ppr", value)}
          value={ppr}
        >
          <option value="0">0</option>
          <option value="0.5">0.5</option>
          <option value="1">1</option>
        </Select>
      </div>
      <p>PPR.</p>
    </div>
  );
}
