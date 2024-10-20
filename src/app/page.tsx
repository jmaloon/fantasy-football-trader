import { unstable_cache } from "next/cache";

import LeagueSettings from "./LeagueSettings";
import TradeSettings from "./TradeSettings";

import { getPlayers } from "./data";
import {
  Player,
  LeagueSettings as LeagueSettingsType,
  // Position,
} from "./types";
import getTradeTargets from "./getTradeTargets";

interface IProps {
  searchParams: Promise<
    LeagueSettingsType & {
      playerIds: string;
      // position: Position
    }
  >;
}

export default async function Page({ searchParams }: IProps) {
  const {
    format = "dynasty",
    ppr = "0",
    numQbs = "1",
    playerIds = "",
    // position = "QB",
  } = await searchParams;
  const selectedPlayerIds: Player["id"][] = playerIds
    ? playerIds.split(",").map(Number)
    : [];

  const getCachedPlayers = unstable_cache(getPlayers, [format, ppr], {
    revalidate: 60 * 60, // 60 mins
  });
  const players = await getCachedPlayers({ format, ppr, numQbs });

  const tradeTargets = getTradeTargets(players, selectedPlayerIds);

  return (
    <div className="grid place-items-center min-h-screen p-4">
      <main className="max-w-lg w-full">
        <h1 className="text-3xl">Fantasy Football Trade Advisor</h1>
        <h2 className="mt-6 mb-2 text-lg text-white/80">League settings</h2>
        <LeagueSettings format={format} ppr={ppr} numQbs={numQbs} />

        <h2 className="mt-8 mb-2 text-lg text-white/80">Trade settings</h2>
        <TradeSettings
          players={players}
          selectedPlayerIds={selectedPlayerIds}
          // position={position}
        />

        <h2 className="mt-8 mb-2 text-lg text-white/80">Trade Targets</h2>
        <ul>
          {tradeTargets.map(({ player, percentValueDifference }) => (
            <li key={player.id}>
              {player.name} {percentValueDifference.toFixed(2)} %
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
