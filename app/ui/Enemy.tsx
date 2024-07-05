import { useState } from 'react';
import { Pokemon } from '../pokemon-data/queries';
import { capitalize } from '../utils/utils';
import TypeCard from './TypeCard';
import { getStat } from '../utils/formulas';

export default function Enemy({ pokemon }: { pokemon: Pokemon }) {
  const [level, setLevel] = useState<string>('100');

  function validateLevel(level: string) {
    if (level === '') {
      return true;
    }

    const levelInt = parseInt(level);
    return levelInt <= 100 && levelInt >= 1;
  }

  function handleLevelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (validateLevel(value)) {
      setLevel(value);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>{capitalize(pokemon.name)}</h1>
      <div className="flex flex-col">
        <h1>Types:</h1>
        <div className="flex gap-4">
          {pokemon.types.map((type) => (
            <TypeCard key={type.name} type={type} />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <h1>Level:</h1>
        <input
          type="number"
          className="input input-bordered w-full max-w-xs"
          value={level}
          onChange={handleLevelChange}
        />
      </div>

      <h1>Stats:</h1>
      <div className="flex flex-col gap-4">
        {Object.values(pokemon.stats).map(({ name, value }) => (
          <h1 className="pl-4">
            {name}: {getStat(name, parseInt(level) || 1, 31, 0, value, 1)}
          </h1>
        ))}
      </div>
    </div>
  );
}
