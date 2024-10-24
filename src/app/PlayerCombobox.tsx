"use client";

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";
import { Player } from "./types";
interface IProps {
  players: Player[];
  selectedPlayerIds: Player["id"][];
  onSelect: (playerId: Player["id"][]) => void;
}
export default function PlayerCombobox({
  players,
  selectedPlayerIds,
  onSelect,
}: IProps) {
  const [query, setQuery] = useState("");

  const filteredPlayers = (
    query === ""
      ? players
      : players.filter((player) =>
          player.name.toLowerCase().includes(query.toLowerCase())
        )
  ).slice(0, 8);

  return (
    <Combobox
      multiple
      value={selectedPlayerIds}
      onChange={onSelect}
      onClose={() => setQuery("")}
    >
      <div className="relative">
        <ComboboxInput
          className={clsx(
            "w-full rounded-lg border-none py-1.5 pr-8 pl-3 text-sm/6",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
            "bg-slate-50 text-slate-900 placeholder:text-slate-700",
            "dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400"
          )}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for player to trade..."
        />
        <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
          <ChevronDownIcon className="size-4 fill-slate-900 group-data-[hover]:fill-slate-900 dark:fill-slate-400 dark:group-data-[hover]:fill-white" />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        anchor="bottom"
        transition
        className={clsx(
          "w-[var(--input-width)] rounded-xl p-1 [--anchor-gap:8px] empty:invisible",
          "bg-white border",
          "dark:bg-slate-700 dark:border-slate-500",
          "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0"
        )}
      >
        {filteredPlayers.map((player) => (
          <ComboboxOption
            key={player.id}
            value={player.id}
            className={clsx(
              "group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-slate-100",
              "dark:data-[focus]:bg-slate-600"
            )}
          >
            <CheckIcon className="invisible size-4 dark:fill-white group-data-[selected]:visible" />
            <div className="dark:text-sm/6 dark:text-white">{player.name}</div>
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}
