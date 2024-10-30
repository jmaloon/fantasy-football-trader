"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/20/solid";

import PlayerCombobox from "./PlayerCombobox";
// import Select from "./Select";

import {
  Player,
  // POSITIONS,
  TradeSettings as TradeSettingsType,
} from "./types";
import clsx from "clsx";

interface IProps extends TradeSettingsType {
  players: Player[];
}

export default function TradeSettings({
  players,
  selectedPlayerIds,
}: // position,
IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedPlayers = selectedPlayerIds
    .map((playerId) => players.find((p) => p.id === playerId))
    .filter((p) => !!p); // type narrowing

  function updateSearchParams(key: string, value: string) {
    const nextUrlSearchParams = new URLSearchParams(searchParams);
    nextUrlSearchParams.set(key, value);

    router.replace(`/?${nextUrlSearchParams}`);
  }

  function updateSelectedPlayerIds(playerIds: Player["id"][]) {
    updateSearchParams("playerIds", playerIds.join(","));
  }

  function removeSelectedPlayerId(playerId: Player["id"]) {
    const nextSelectedPlayerIds = selectedPlayerIds.filter(
      (pid) => pid !== playerId
    );
    updateSelectedPlayerIds(nextSelectedPlayerIds);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="text-slate-900 dark:text-slate-100">
        I would like to trade away
      </p>
      {selectedPlayers.map((player) => (
        <div
          key={player.id}
          className={clsx(
            "flex gap-1.5 rounded-lg border-none py-1.5 px-3 text-sm/6",
            "bg-slate-50 text-slate-900",
            "dark:bg-slate-800 dark:text-slate-100"
          )}
        >
          {player.name}
          <button
            className={clsx(
              "rounded p-1 text-center transition-all",
              "focus:bg-slate-300 active:bg-slate-300 hover:bg-slate-300",
              "dark:focus:bg-slate-700 dark:active:bg-slate-700 dark:hover:bg-slate-700"
            )}
            type="button"
            onClick={() => removeSelectedPlayerId(player.id)}
          >
            <XMarkIcon className="size-4 dark:text-white" />
          </button>
        </div>
      ))}
      <div className="w-full sm:w-56">
        <PlayerCombobox
          players={players}
          onSelect={updateSelectedPlayerIds}
          selectedPlayerIds={selectedPlayerIds}
        />
      </div>
      {/* <p>and in return receive a</p>
      <div className="w-20">
        <Select
          onChange={(value) => updateSearchParams("position", value)}
          value={position}
        >
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </div> */}
    </div>
  );
}
