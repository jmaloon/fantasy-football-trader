import { Player } from "./types";

export default function getTradeTargets(
  players: Player[],
  selectedPlayerIds: Player["id"][]
): Array<{ player: Player; percentValueDifference: number }> {
  if (selectedPlayerIds.length === 0) return [];

  const selectedPlayers = selectedPlayerIds
    .map((playerId) => players.find((p) => p.id === playerId))
    .filter((p) => !!p);

  const selectedPlayersValue = selectedPlayers
    .map((p) => p.value)
    .reduce((a, b) => a + b, 0);

  const percentValueDifferenceByPlayerId: Record<Player["id"], number> = {};

  const unselectedPlayers = players.filter(
    (p) => !selectedPlayerIds.includes(p.id)
  );
  unselectedPlayers.forEach((p) => {
    const percentValueDifference =
      ((p.value - selectedPlayersValue) / selectedPlayersValue) * 100;
    percentValueDifferenceByPlayerId[p.id] = percentValueDifference;
  });

  return unselectedPlayers
    .map((player) => ({
      player,
      percentValueDifference: percentValueDifferenceByPlayerId[player.id],
    }))
    .filter(
      ({ percentValueDifference }) => Math.abs(percentValueDifference) < 21
    )
    .sort(
      (a, b) =>
        Math.abs(a.percentValueDifference) - Math.abs(b.percentValueDifference)
    );
}
