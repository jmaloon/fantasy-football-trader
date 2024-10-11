"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/20/solid";

import PlayerCombobox from "./PlayerCombobox";

import { Player, TradeSettings as TradeSettingsType } from "./types";

interface IProps extends TradeSettingsType {
  players: Player[];
}

export default function TradeSettings({ players, selectedPlayerIds }: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedPlayers = selectedPlayerIds
    .map((playerId) => players.find((p) => p.id === playerId))
    .filter((p) => !!p); // type narrowing

  function updateSelectedPlayerIds(playerIds: Player["id"][]) {
    const nextUrlSearchParams = new URLSearchParams(searchParams);
    nextUrlSearchParams.set("playerIds", playerIds.join(","));

    router.replace(`/?${nextUrlSearchParams}`);
  }

  function removeSelectedPlayerId(playerId: Player["id"]) {
    const nextUrlSearchParams = new URLSearchParams(searchParams);
    const nextSelectedPlayerIds = selectedPlayerIds.filter(
      (pid) => pid !== playerId
    );
    nextUrlSearchParams.set("playerIds", nextSelectedPlayerIds.join(","));

    router.replace(`/?${nextUrlSearchParams}`);
  }

  return (
    <div className="flex items-center gap-2">
      <p>I would like to trade away</p>
      {selectedPlayers.map((player) => (
        <div
          key={player.id}
          className="flex gap-1 rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"
        >
          {player.name}
          <button
            className="rounded p-1 text-center transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            onClick={() => removeSelectedPlayerId(player.id)}
          >
            <XMarkIcon className="size-4 text-white" />
          </button>
        </div>
      ))}
      <div className="w-56">
        <PlayerCombobox
          players={players}
          onSelect={updateSelectedPlayerIds}
          selectedPlayerIds={selectedPlayerIds}
        />
      </div>
      <p>and in return receive a</p>
    </div>
  );
}
