import { unstable_cache } from "next/cache";

import LeagueSettings from "./LeagueSettings";
import { Player, LeagueSettings as LeagueSettingsType } from "./types";
import TradeSettings from "./TradeSettings";

interface IProps {
  searchParams: Promise<LeagueSettingsType & { playerIds: string }>;
}

function deserializePlayer(message: any): Player {
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

const REQUEST_URL = "https://api.fantasycalc.com/values/current";

async function getPlayers({
  format,
  ppr,
  numQbs,
}: LeagueSettingsType): Promise<Player[]> {
  const urlSearchParams = new URLSearchParams({
    isDynasty: Boolean(format === "dynasty").toString(),
    numQbs,
    ppr,
  }).toString();

  try {
    const response = await fetch(`${REQUEST_URL}?${urlSearchParams}`);
    const data = await response.json();
    return data.map((r: any) => deserializePlayer(r));
  } catch (error: unknown) {
    console.error(error);
    return [];
  }
}

export default async function Page({ searchParams }: IProps) {
  const {
    format = "dynasty",
    ppr = "0",
    numQbs = "1",
    playerIds = "",
  } = await searchParams;
  const selectedPlayerIds: Player["id"][] = playerIds
    ? playerIds.split(",").map(Number)
    : [];

  const getCachedPlayers = unstable_cache(getPlayers, [format, ppr], {
    revalidate: 60 * 60, // 60 mins
  });
  const players = await getCachedPlayers({ format, ppr, numQbs });

  return (
    <div className="grid place-items-center min-h-screen">
      <main>
        <h1>Fantasy Football Trader</h1>
        <h2>League settings</h2>
        <LeagueSettings format={format} ppr={ppr} numQbs={numQbs} />

        <h2>Trade settings</h2>
        <TradeSettings
          players={players}
          selectedPlayerIds={selectedPlayerIds}
        />
      </main>

      {/* DEBUG */}
      {/* <ul>
        {players.map((p) => (
          <li key={p.id}>{JSON.stringify(p)}</li>
        ))}
      </ul> */}
    </div>
  );
}
