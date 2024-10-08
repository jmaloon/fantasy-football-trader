import Form from "./Form";

type Format = "redraft" | "dynasty";
type PPR = "0" | "0.5" | "1";

interface IProps {
  searchParams: Promise<{ format: Format; ppr: PPR }>;
}
interface Player {
  id: number;
  name: string;
  position: string;
  overallRank: number;
  positionRank: number;
}

function deserializePlayer(message: any): Player {
  return {
    id: message.player.id,
    name: message.player.name,
    position: message.player.position,
    overallRank: message.overallRank,
    positionRank: message.positionRank,
  };
}

const REQUEST_URL = "https://api.fantasycalc.com/values/current";

async function getPlayers({
  format,
  ppr,
}: {
  format: Format | undefined;
  ppr: PPR | undefined;
}): Promise<Player[]> {
  const isMissingData = ppr === undefined || format === undefined;
  if (isMissingData) return [];

  // TODO: validate data

  const urlSearchParams = new URLSearchParams({
    isDynasty: Boolean(format === "dynasty").toString(),
    numQbs: "1",
    ppr,
  }).toString();

  const response = await fetch(`${REQUEST_URL}?${urlSearchParams}`);
  const data = await response.json();
  return data.map((r: any) => deserializePlayer(r));
}

export default async function Page({ searchParams }: IProps) {
  const { format, ppr } = await searchParams;
  const players = await getPlayers({ format, ppr });

  return (
    <div>
      <Form />
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            {p.overallRank} {p.position}
            {p.positionRank} {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
