import { LeagueSettings, Player, ResponseMessage } from "./types";

const REQUEST_URL = "https://api.fantasycalc.com/values/current" as const;

function deserializePlayer(message: ResponseMessage): Player {
  return {
    id: message.player.id,
    name: message.player.name,
    position: message.player.position,
    overallRank: message.overallRank,
    positionRank: message.positionRank,
    value: message.value,
    headshot: {
      src: `https://a.espncdn.com/i/headshots/nfl/players/full/${message.player.espnId}.png`,
      alt: message.player.name,
    },
  };
}

export async function getPlayers({
  format,
  ppr,
  numQbs,
}: LeagueSettings): Promise<Player[]> {
  const urlSearchParams = new URLSearchParams({
    isDynasty: Boolean(format === "dynasty").toString(),
    numQbs,
    ppr,
  }).toString();

  try {
    const response = await fetch(`${REQUEST_URL}?${urlSearchParams}`);
    const data: ResponseMessage[] = await response.json();
    return data.map((r) => deserializePlayer(r));
  } catch (error: unknown) {
    console.error(error);
    return [];
  }
}
