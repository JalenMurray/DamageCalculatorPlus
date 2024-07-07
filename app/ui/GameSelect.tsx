'use client';

import Image from 'next/image';
import { PokemonGame } from '../pokemon-data/definitions';
import { useDebouncedCallback } from 'use-debounce';

export default function GameSelect({
  games,
  onSelect,
}: {
  games: PokemonGame[];
  onSelect: (game: PokemonGame) => void;
}) {
  return (
    <div className="drawer-side">
      <label htmlFor="game-select" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="bg-base-200 text-base-content min-h-full max-w-[95vw] w-[800px] p-8 flex flex-col gap-4">
        <h1 className="text-4xl">Select Pokemon Game</h1>
        <div className="grid grid-cols-5 h-[900px] gap-4">
          {games.map((game) => (
            <div
              className="card cursor-pointer justify-center items-center text-center bg-primary text-primary-content hover:bg-secondary hover:text-secondary-content"
              key={game.name}
              onClick={() => onSelect(game)}
            >
              <h1>{game.name}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
