"use client";

import { useRouter, useSearchParams } from "next/navigation";

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

  function toggleSelectedPlayerIds(playerIds: Player["id"][]) {
    const nextUrlSearchParams = new URLSearchParams(searchParams);
    // const nextSelectedPlayerIds = selectedPlayerIds.includes(playerId)
    //   ? selectedPlayerIds.filter((pid) => pid !== playerId)
    //   : [...selectedPlayerIds, playerId];
    // nextUrlSearchParams.set("playerIds", nextSelectedPlayerIds.join(","));
    nextUrlSearchParams.set("playerIds", playerIds.join(","));

    router.replace(`/?${nextUrlSearchParams}`);
  }

  return (
    <div className="flex items-center gap-2">
      <p>I would like to trade away</p>
      {selectedPlayers.map((player) => (
        <div
          key={player.id}
          className="rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white"
        >
          {player.name}
        </div>
      ))}
      <PlayerCombobox
        players={players}
        onSelect={toggleSelectedPlayerIds}
        selectedPlayerIds={selectedPlayerIds}
      />
      <p>and in return receive a</p>
    </div>
  );
}
