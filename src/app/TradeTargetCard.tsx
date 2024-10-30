import Image from "next/image";
import clsx from "clsx";
import { TradeTarget } from "./types";

interface IProps {
  tradeTarget: TradeTarget;
}

export default function TradeTargetCard({ tradeTarget }: IProps) {
  const { player, valueDifference } = tradeTarget;
  return (
    <li
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
  );
}
