import { Player, TradeTarget } from "./types";

export default function getTradeTargets(
  players: Player[],
  selectedPlayerIds: Player["id"][]
): Array<TradeTarget> {
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
    .map(
      (player): TradeTarget => ({
        player,
        valueDifference: {
          percent: percentValueDifferenceByPlayerId[player.id],
          absolutePercent: Math.abs(
            percentValueDifferenceByPlayerId[player.id]
          ),
          isPositive: percentValueDifferenceByPlayerId[player.id] >= 0,
        },
      })
    )
    .filter((tt) => tt.valueDifference.absolutePercent < 21)
    .sort(
      (tt1, tt2) =>
        Math.abs(tt1.valueDifference.percent) -
        Math.abs(tt2.valueDifference.percent)
    );
}
