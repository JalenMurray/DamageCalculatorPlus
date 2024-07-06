import Image from 'next/image';
import { BattlePokemon as BPType, Move as moveType, typeColors } from '../pokemon-data/definitions';
import {
  capitalize,
  formatDashName,
  getBattlePokemonStats,
  getSpriteURL,
  getTypeGradient,
  getTypeURL,
} from '../utils/utils';
import { BattlePokemonSkeleton } from './Skeletons';
import { useContext, useEffect, useState } from 'react';
import { CalculatorContext } from '../context/calculator';

function CardHeader({ pokemon }: { pokemon: BPType }) {
  return (
    <div className="w-full h-[175px] grid grid-cols-2 overflow-hidden rounded-t-box">
      <div className="flex flex-col gap-4 justify-center pl-8">
        <h1 className="text-4xl">
          {capitalize(pokemon.pokemon.name)}
          <span className="pl-4 text-xl">Lvl. {pokemon.level}</span>
        </h1>
        <div className="flex gap-4">
          {pokemon.pokemon.types.map((type) => (
            <Image
              src={getTypeURL(type.name)}
              alt={`${type.name} type`}
              width={60}
              height={40}
              key={type.name}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <Image
          src={getSpriteURL(pokemon.pokemon.name)}
          alt={pokemon.pokemon.name}
          width={50}
          height={50}
          unoptimized
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          className="w-[175px] h-[175px] p-4"
        />
      </div>
    </div>
  );
}

function Stats({ pokemon }: { pokemon: BPType }) {
  const stats = getBattlePokemonStats(pokemon, [31, 31, 31, 31, 31, 31], [0, 0, 0, 0, 0, 0]);
  const total = stats.reduce((acc, stat) => acc + (stat.ceiling + stat.floor) / 2, 0);
  const avg = Math.floor(0.01 * (2 * 100 + 31 + Math.floor(0.25 * 0)) * pokemon.level) + 5;

  const getBarWidth = (value: number) => {
    const calculatedWidth = (value / avg) * 100;
    return `${Math.min(calculatedWidth, 80)}%`;
  };

  function getBarColor(value: number) {
    if (value >= avg) {
      return `rgb(${255 - ((value - avg) * 255) / (180 - avg)}, 255, 0)`;
    } else {
      return `rgb(255, ${(value * 255) / avg}, 0)`;
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl">Stats:</h1>
      <hr />
      <div className="grid grid-cols-3 h-full w-full gap-3">
        {stats.map((stat) => (
          <label className="input input-bordered bg-neutral-content flex items-center gap-1 text-neutral">
            <p className="text-sm">{stat.name}:</p>
            <p className="text-sm">
              {stat.floor} - {stat.ceiling}
            </p>
          </label>
        ))}
      </div>
    </div>
  );
}

function Move({ user, move }: { user: boolean | undefined; move: moveType }) {
  const { userMoveOutputs, enemyMoveOutputs } = useContext(CalculatorContext);
  const [floor, setFloor] = useState<number>(0);
  const [ceiling, setCeiling] = useState<number>(0);

  useEffect(() => {
    if (!userMoveOutputs && !enemyMoveOutputs) {
      return;
    }
    if (user) {
      const output = userMoveOutputs.filter((outputs) => outputs.id === move.id)[0];
      if (!output) {
        return;
      }
      setFloor(output.floor);
      setCeiling(output.ceiling);
    } else {
      const output = enemyMoveOutputs.filter((outputs) => outputs.id === move.id)[0];
      if (!output) {
        return;
      }
      setFloor(output.floor);
      setCeiling(output.ceiling);
    }
  }, [userMoveOutputs, enemyMoveOutputs]);

  return (
    <div
      className=" card w-full h-[175px]"
      style={{
        backgroundColor: `${typeColors[move.type]}`,
      }}
    >
      <div className="card w-auto h-full m-2 bg-neutral text-neutral-content p-4">
        <div className="flex">
          <h1 className="text-xl flex-1">{formatDashName(move.name)}</h1>
          <div className="flex-none">
            <Image
              src={getTypeURL(move.type)}
              alt={`${move.type} type`}
              width={50}
              height={20}
              key={move.type}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <p>Power: {move.power}</p>
          <p>Accuracy: {move.accuracy}</p>
          <p>Priority: {move.priority}</p>
        </div>
        <div className="text-center my-auto">
          <h1
            className="text-2xl"
            style={floor > 100 || ceiling > 100 ? { color: 'green' } : undefined}
          >
            {floor.toFixed(2)}% - {ceiling.toFixed(2)}%
          </h1>
        </div>
      </div>
    </div>
  );
}

export default function BattlePokemon({
  pokemon,
  user,
}: {
  pokemon: BPType | null;
  user?: boolean;
}) {
  if (pokemon === null) {
    return <BattlePokemonSkeleton />;
  }

  return (
    <div
      className="card w-[800px] h-[900px] flex flex-col"
      style={getTypeGradient(pokemon.pokemon.types, 'card')}
    >
      <CardHeader pokemon={pokemon} />
      <div className="card bg-neutral mx-8 h-[200px]">
        <Stats pokemon={pokemon} />
      </div>
      <div className="grid grid-cols-2 gap-12 p-4 mt-8">
        {pokemon.moves.map((move) => (
          <Move user={user} move={move} key={move.id} />
        ))}
      </div>
    </div>
  );
}
