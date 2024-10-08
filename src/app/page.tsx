import Form from "next/form";
import Link from "next/link";
import { unstable_cache } from "next/cache";

type Format = "redraft" | "dynasty";
type PPR = "0" | "0.5" | "1";

interface IProps {
  searchParams: Promise<{
    format: Format;
    ppr: PPR;
    pids: string; // player IDs as comma-separated string
  }>;
}
interface Player {
  id: number;
  name: string;
  position: string;
  overallRank: number;
  positionRank: number;
  value: number;
}

function deserializePlayer(message: any): Player {
  return {
    id: message.player.id,
    name: message.player.name,
    position: message.player.position,
    overallRank: message.overallRank,
    positionRank: message.positionRank,
    value: message.value,
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
  console.log(data[0]);
  return data.map((r: any) => deserializePlayer(r));
}

export default async function Page({ searchParams }: IProps) {
  const { format, ppr, pids } = await searchParams;

  const getCachedPlayers = unstable_cache(getPlayers, [format, ppr]);
  const players = await getCachedPlayers({ format, ppr });

  const selectedPlayerIds: Player["id"][] = pids
    ? pids.split(",").map(Number)
    : [];
  const selectedPlayers = selectedPlayerIds
    .map((pId) => players.find((p) => p.id === pId))
    .filter((p) => p !== undefined);

  return (
    <div>
      <h1>Fantasy Football Trader</h1>
      <h2>Enter league details:</h2>
      <Form action="">
        <fieldset>
          <legend>Format:</legend>

          <div>
            <input type="radio" id="redraft" name="format" value="redraft" />
            <label htmlFor="redraft">Redraft</label>
          </div>

          <div>
            <input type="radio" id="dynasty" name="format" value="dynasty" />
            <label htmlFor="dynasty">Dynasty</label>
          </div>
        </fieldset>

        <fieldset>
          <legend>PPR:</legend>

          <div>
            <input type="radio" id="zero" name="ppr" value="0" />
            <label htmlFor="zero">0</label>
          </div>
          <div>
            <input type="radio" id="half" name="ppr" value="0.5" />
            <label htmlFor="half">0.5</label>
          </div>
          <div>
            <input type="radio" id="full" name="ppr" value="1" />
            <label htmlFor="full">1</label>
          </div>
        </fieldset>

        <div className="hidden">
          <input type="text" name="pids" value={pids || ""} readOnly />
        </div>
        <button>Submit</button>
      </Form>

      {selectedPlayers && (
        <>
          <h2>Selected players</h2>
          <ul>
            {selectedPlayers.map((p) => (
              <li key={p.id}>
                <div>
                  {p.name} {p.value}
                </div>
                <Link
                  href={{
                    pathname: "/",
                    query: {
                      format,
                      ppr,
                      pids: selectedPlayerIds
                        .filter((pid) => pid !== p.id)
                        .join(","),
                    },
                  }}
                >
                  <button>-</button>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Player rankings</h2>
      <ul>
        {players.map((p) => (
          <li key={p.id}>
            <div>
              {p.overallRank} {p.position}
              {p.positionRank} {p.name}
            </div>
            {!selectedPlayerIds.includes(p.id) && (
              <Link
                href={{
                  pathname: "/",
                  query: { format, ppr, pids: pids ? `${pids},${p.id}` : p.id },
                }}
              >
                <button>+</button>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// {
//   player: {
//     id: 7257,
//     name: 'Saquon Barkley',
//     mflId: '13604',
//     sleeperId: '4866',
//     position: 'RB',
//     maybeBirthday: '1997-02-09',
//     maybeHeight: '72',
//     maybeWeight: 233,
//     maybeCollege: 'Penn State',
//     maybeTeam: 'PHI',
//     maybeAge: 27.7,
//     maybeYoe: 6,
//     espnId: '3929630',
//     fleaflickerId: '13778'
//   },
//   value: 10660,
//   overallRank: 1,
//   positionRank: 1,
//   trend30Day: 3667,
//   redraftDynastyValueDifference: 29,
//   redraftDynastyValuePercDifference: 0,
//   redraftValue: 10689,
//   combinedValue: 21349,
//   maybeMovingStandardDeviation: -3,
//   maybeMovingStandardDeviationPerc: 0,
//   maybeMovingStandardDeviationAdjusted: 2,
//   displayTrend: false,
//   maybeOwner: null,
//   starter: false,
//   maybeTier: 1,
//   maybeAdp: null,
//   maybeTradeFrequency: 0.013
// }
