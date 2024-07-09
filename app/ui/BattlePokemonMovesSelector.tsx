import { AddCircleOutline } from '@mui/icons-material';
import { Move, typeColors } from '../pokemon-data/definitions';
import { capitalize, formatDashName, getTypeURL } from '../utils/utils';
import Image from 'next/image';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';

export default function BattlePokemonMovesSelector({
  selected,
  allMoves,
  onSelect,
}: {
  selected?: Move[];
  allMoves: Move[];
  onSelect: (moves: Move[]) => void;
}) {
  function addMove(toAdd: Move) {
    onSelect(selected ? [...selected, toAdd] : [toAdd]);
  }

  function removeMove(toRemove: Move) {
    onSelect(selected ? selected.filter((move) => move.id !== toRemove.id) : []);
  }

  const [filteredMoves, setFilteredMoves] = useState<Move[]>([]);
  const [search, setSearch] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  const filter = useDebouncedCallback((text: string) => {
    const filtered =
      text !== ''
        ? allMoves.filter((move) => {
            let result = false;
            if (selected && selected.includes(move)) {
              return false;
            }
            if (move.name.includes(text)) {
              result = true;
            }
            if (move.id === parseFloat(text)) {
              result = true;
            }
            return result;
          })
        : [];
    const toDisplay = filtered.length > 20 ? filtered.slice(0, 20) : filtered;
    setFilteredMoves(toDisplay);
  }, 200);

  function handleKeyDown(e: any) {
    const { key } = e;
    if (key === 'Enter' && filteredMoves[0]) {
      addMove(filteredMoves[0]);
      setSearch('');
      filter('');
    }
  }

  return (
    <div className="flex flex-col gap-4 my-4">
      <h1>Select Moves</h1>
      <div className="flex flex-col">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            value={search}
            placeholder="Search Moves"
            onChange={(e) => {
              setSearch(e.target.value);
              filter(e.target.value.toLowerCase().replace(' ', '-'));
            }}
            onBlur={() => {
              setSearch('');
              filter('');
            }}
            disabled={selected && selected.length >= 4}
            onKeyDown={handleKeyDown}
            ref={searchRef}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        {filteredMoves.length > 0 && (
          <ul className="mt-1 max-h-48 overflow-auto border-2 border-black">
            {filteredMoves.map((move, index) => (
              <li
                key={index}
                className="p-2 hover:bg-neutral-600 hover:text-neutral-content cursor-pointer"
                onClick={() => addMove(move)}
              >
                {formatDashName(move.name)}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selected && (
        <>
          <h1>Selected Moves: </h1>
          <div className="grid grid-cols-2 gap-4 h-56">
            {selected.map((move) => (
              <div
                className="card bg-neutral text-neutral-content h-24 text-center justify-center cursor-pointer"
                onClick={() => removeMove(move)}
                key={move.id}
              >
                {formatDashName(move.name)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
