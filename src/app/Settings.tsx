"use client";

import { useRouter, useSearchParams } from "next/navigation";

import Select from "./Select";

export default function Settings() {
  const searchParams = useSearchParams();
  const router = useRouter();

  function updateSearchParams(key: string, value: string) {
    const nextUrlSearchParams = new URLSearchParams(searchParams);
    nextUrlSearchParams.set(key, value);
    // router.replace('/)
    router.replace(`/?${nextUrlSearchParams}`);
  }

  return (
    <div className="flex gap-2 items-center">
      <Select
        className="w-20"
        onChange={(value) => updateSearchParams("numQbs", value)}
      >
        <option value="1">1QB</option>
        <option value="2">2QB</option>
      </Select>
      <Select
        className="w-28"
        onChange={(value) => updateSearchParams("format", value)}
      >
        <option value="dynasty">Dynasty</option>
        <option value="redraft">Redraft</option>
      </Select>
      <p>league with</p>
      <Select
        className="w-16"
        onChange={(value) => updateSearchParams("ppr", value)}
      >
        <option value="0">0</option>
        <option value="0.5">0.5</option>
        <option value="1">1</option>
      </Select>
      <p>PPR.</p>
    </div>
  );
}
