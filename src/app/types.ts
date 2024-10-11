export type Format = "redraft" | "dynasty";
export type PPR = "0" | "0.5" | "1";
export type NumQBs = "1" | "2";

export const POSITIONS = ["QB", "WR", "RB", "TE"] as const;
export type Position = (typeof POSITIONS)[number];

export interface Player {
  id: number;
  name: string;
  position: string;
  overallRank: number;
  positionRank: number;
  value: number;
  headshot: { src: string; alt: string };
}

export interface LeagueSettings {
  format: Format;
  ppr: PPR;
  numQbs: NumQBs;
}

export interface TradeSettings {
  position: Position;
  selectedPlayerIds: Player["id"][];
}
