import { CalculatorContext } from '@/app/context/calculator';
import { Move } from '@/app/pokemon-data/definitions';
import { formatDashName } from '@/app/utils/utils';
import { useContext, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SelectMoveDrawer() {
  const { allMoves } = useContext(CalculatorContext);

  if (!allMoves) {
    return <div className="skeleton h-full w-full" />;
  }

  const [filteredMoves, setFilteredMoves] = useState<Move[]>([]);
  const [search, setSearch] = useState<string>('');
  const [toAddMoves, setToAddMoves] = useState<Move[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  function addMove(toAdd: Move) {
    setToAddMoves(toAddMoves ? [...toAddMoves, toAdd] : [toAdd]);
  }

  function removeMove(toRemove: Move) {
    setToAddMoves(toAddMoves ? toAddMoves.filter((move) => move.id !== toRemove.id) : []);
  }

  const filter = useDebouncedCallback((text: string) => {
    const filtered =
      text !== ''
        ? allMoves.filter((move) => {
            let result = false;
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
      setSearch('');
      filter('');
      addMove(filteredMoves[0]);
    }
  }

  return (
    <div className="drawer-side">
      <label htmlFor="new-move-select" aria-label="close sidebar" className="drawer-overlay" />
      <div className="bg-base-200 text-base-content min-h-full max-w-[95vw] w-[800px] p-8 flex flex-col gap-4">
        <h1 className="text-3xl">Add Moves</h1>
        <div className="relative">
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
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto border-2 border-black bg-base-200">
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
        <div className="flex flex-col gap-4 mt-4">
          <h1 className="text-xl">Selected Moves:</h1>
          {toAddMoves.map((move) => {
            return <div>{move.name}</div>;
          })}
        </div>
        <button className="btn btn-success mt-12">Add Moves</button>
      </div>
    </div>
  );
}
