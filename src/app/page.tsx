import { unstable_cache } from "next/cache";

import LeagueSettings from "./LeagueSettings";
import TradeSettings from "./TradeSettings";

import { getPlayers } from "./data";
import { Player, LeagueSettings as LeagueSettingsType } from "./types";

interface IProps {
  searchParams: Promise<LeagueSettingsType & { playerIds: string }>;
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
        <h1 className="text-3xl">Fantasy Football Trader</h1>
        <h2 className="mt-6 text-xl">League settings</h2>
        <LeagueSettings format={format} ppr={ppr} numQbs={numQbs} />

        <h2 className="mt-6 text-xl">Trade settings</h2>
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
