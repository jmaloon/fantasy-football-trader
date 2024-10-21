import { unstable_cache } from "next/cache";
import Image from "next/image";

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

  const hasNoSelectedPlayers = selectedPlayerIds.length === 0;

  return (
    <div className="flex justify-center min-h-screen pt-12 p-4">
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
        {hasNoSelectedPlayers ? (
          <p className="text-sm text-slate-50/50">
            Add a player using the <q>Trade settings</q> input to see potential
            trade targets.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tradeTargets.map(({ player, percentValueDifference }) => (
              <li
                key={player.id}
                className="flex items-start p-2 border rounded-lg"
              >
                <Image
                  width={64} // original 128
                  height={47} // original 93
                  src={player.headshot.src}
                  alt={player.headshot.alt}
                />
                <div>
                  <h3>{player.name}</h3>
                  <p className="text-xs">
                    Trade value difference of{" "}
                    <span
                      className={
                        percentValueDifference < 0
                          ? "text-red-400"
                          : "text-green-400"
                      }
                    >
                      {percentValueDifference.toFixed(2)} %
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
