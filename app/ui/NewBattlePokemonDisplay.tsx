import Image from 'next/image';
import { BattlePokemonMoveFormData, PokemonFormData } from '../pokemon-data/definitions';
import {
  formatDashName,
  getSpriteURL,
  getStatByIndex,
  getTypeGradient,
  getTypeURL,
} from '../utils/utils';

function CardHeader({ pokemon }: { pokemon: PokemonFormData }) {
  return (
    <div className="w-full h-[150px] grid grid-cols-2 overflow-hidden rounded-t-box">
      <div className="flex flex-col gap-4 justify-center pl-8">
        <h1 className="text-4xl">
          {formatDashName(pokemon.pokemon.name)}
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
          className="w-[150px] h-[150px] p-4"
        />
      </div>
    </div>
  );
}

function PokemonInfo({ pokemon }: { pokemon: PokemonFormData }) {
  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="flex gap-4">
        <h1>Ability: {formatDashName(pokemon.ability.name)}</h1>
        <h1>Nature: {formatDashName(pokemon.nature.name)}</h1>
        {pokemon.heldItem && <h1>Held Item: {formatDashName(pokemon.heldItem.name)}</h1>}
      </div>

      <h1>Evs/Ivs</h1>
      <div className="grid grid-cols-3 gap-2 text-base-content">
        {pokemon.evs.map((ev, i) => {
          const iv = pokemon.ivs[i];
          const statName = getStatByIndex(i);
          return (
            <label className="input flex justify-center items-center" key={i}>
              <p className="flex-1">{statName}</p>
              <p className="flex-none">
                {ev}/{iv}
              </p>
            </label>
          );
        })}
      </div>
    </div>
  );
}

function Moves({ moves }: { moves: BattlePokemonMoveFormData }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 text-base-content">
      {moves.moves.map((move) => (
        <div
          className="card h-[100px] bg-base-100 text-center justify-center items-center"
          key={move.id}
        >
          <h1>{formatDashName(move.name)}</h1>
        </div>
      ))}
    </div>
  );
}

export default function NewBattlePokemonDisplay({
  pokemon,
  moves,
}: {
  pokemon: PokemonFormData;
  moves: BattlePokemonMoveFormData;
}) {
  return (
    <div
      className="card gap-2 h-[600px] text-white"
      style={getTypeGradient(pokemon.pokemon.types, 'card')}
    >
      <CardHeader pokemon={pokemon} />
      <PokemonInfo pokemon={pokemon} />
      <Moves moves={moves} />
    </div>
  );
}
