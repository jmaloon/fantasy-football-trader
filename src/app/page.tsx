import clsx from "clsx";
import { unstable_cache } from "next/cache";
import Image from "next/image";

import LeagueSettings from "./LeagueSettings";
import TradeSettings from "./TradeSettings";
import ThemeSwitch from "./ThemeSwitch";

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
    <div
      className={clsx(
        "flex justify-center min-h-screen py-12 px-4",
        "bg-slate-200",
        "dark:bg-slate-900"
      )}
    >
      <main className="max-w-lg w-full">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-2xl text-slate-900 dark:text-slate-100">
            Fantasy Football Trade Advisor
          </h1>
          <ThemeSwitch />
        </div>
        <h2 className="mt-6 mb-2 text-lg text-slate-700 dark:text-slate-200">
          League settings
        </h2>
        <LeagueSettings format={format} ppr={ppr} numQbs={numQbs} />

        <h2 className="mt-8 mb-2 text-lg text-slate-700 dark:text-slate-200">
          Trade settings
        </h2>
        <TradeSettings
          players={players}
          selectedPlayerIds={selectedPlayerIds}
          // position={position}
        />

        <h2 className="mt-8 mb-2 text-lg dark:text-slate-200">Trade targets</h2>
        {hasNoSelectedPlayers ? (
          <p className="text-sm dark:text-slate-400">
            Add a player using the <q>Trade settings</q> input to see potential
            trade targets.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {tradeTargets.map(({ player, valueDifference }) => (
              <li
                key={player.id}
                className={clsx(
                  "flex items-center p-2 pr-4 gap-2 border rounded-lg",
                  "bg-slate-50 border-slate-300",
                  "dark:bg-slate-800 dark:border-slate-600"
                )}
              >
                <Image
                  width={43} // original 128
                  height={31} // original 93
                  src={player.headshot.src}
                  alt={player.headshot.alt}
                />
                <div className="grow">
                  <h3 className="dark:text-slate-100">{player.name}</h3>
                </div>
                <span
                  className={
                    valueDifference.isPositive
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }
                >{`${
                  valueDifference.isPositive ? "" : "- "
                }${valueDifference.absolutePercent.toFixed(2)} %`}</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
