// import Form from "next/form";
// import Link from "next/link";
// import Image from "next/image";
import { unstable_cache } from "next/cache";

import Select from "./Select";

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
  headshot: { src: string; alt: string };
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
  const { format = "dynasty", ppr = "0", pids } = await searchParams;

  const getCachedPlayers = unstable_cache(getPlayers, [format, ppr], {
    revalidate: 60 * 60, // 60 mins
  });
  const players = await getCachedPlayers({ format, ppr });

  const selectedPlayerIds: Player["id"][] = pids
    ? pids.split(",").map(Number)
    : [];
  const selectedPlayers = selectedPlayerIds
    .map((pId) => players.find((p) => p.id === pId))
    .filter((p) => p !== undefined);
  const selectedPlayersValue = selectedPlayers
    .map((p) => p.value)
    .reduce((a, b) => a + b, 0);

  return (
    <div className="grid place-items-center min-h-screen">
      <main>
        <h1>Fantasy Football Trader</h1>
        <h2>League settings</h2>
        <div className="flex gap-2 items-center">
          <Select className="w-20">
            <option value="1">1QB</option>
            <option value="2">2QB</option>
          </Select>
          <Select className="w-28">
            <option value="dynasty">Dynasty</option>
            <option value="redraft">Redraft</option>
          </Select>
          <p>league with</p>
          <Select className="w-16">
            <option value="0">0</option>
            <option value="0.5">0.5</option>
            <option value="1">1</option>
          </Select>
          <p>PPR.</p>
        </div>
      </main>
      {/* <h2>League settings:</h2> */}
      {/* <Form action="">
        <fieldset>
          <legend>Format:</legend>

          <div>
            <input type="radio" id="dynasty" name="format" value="dynasty" />
            <label htmlFor="dynasty">Dynasty</label>
          </div>

          <div>
            <input type="radio" id="redraft" name="format" value="redraft" />
            <label htmlFor="redraft">Redraft</label>
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
      </Form> */}

      {/* {selectedPlayers && (
        <>
          <h2>Selected players</h2>

          <ul>
            <li>Total value: {selectedPlayersValue}</li>
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
      )} */}

      {/* <h2>Player rankings</h2> */}
      {/* <ul>
        {players.map((p) => (
          <li key={p.id}>
            <Image
              alt={p.headshot.alt}
              src={p.headshot.src}
              width={60}
              height={60}
            />
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
      </ul> */}
      {/* DEBUG */}
      {/* <ul>
        {players.map((p) => (
          <li key={p.id}>{JSON.stringify(p)}</li>
        ))}
      </ul> */}
    </div>
  );
}
