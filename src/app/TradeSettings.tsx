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

  function toggleSelectedPlayerIds(playerId: Player["id"]) {
    console.log("here");
    const nextUrlSearchParams = new URLSearchParams(searchParams);
    const nextSelectedPlayerIds = selectedPlayerIds.includes(playerId)
      ? selectedPlayerIds.filter((pid) => pid !== playerId)
      : [...selectedPlayerIds, playerId];
    nextUrlSearchParams.set("playerIds", nextSelectedPlayerIds.join(","));

    router.replace(`/?${nextUrlSearchParams}`);
  }

  return (
    <div>
      <p>I would like to trade away</p>
      {selectedPlayers.map((player) => (
        <div key={player.id}>{player.name}</div>
      ))}
      <PlayerCombobox players={players} onSelect={toggleSelectedPlayerIds} />
      <p>and in return receive a</p>
    </div>
  );
}