import { AddCircleOutline } from '@mui/icons-material';
import { Abilities, Ability, Move, typeColors } from '../pokemon-data/definitions';
import { capitalize, formatDashName, getTypeURL } from '../utils/utils';
import Image from 'next/image';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';

export default function AbilitySelector({
  selected,
  abilities,
  onSelect,
}: {
  selected?: Ability;
  abilities: Abilities;
  onSelect: (ability: Ability) => void;
}) {
  const [filteredAbilities, setFilteredAbilities] = useState<Abilities>([]);
  const [search, setSearch] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  const filter = useDebouncedCallback((text: string) => {
    const filtered =
      text !== ''
        ? abilities.filter((ability) => {
            let result = false;
            if (selected && selected.id === ability.id) {
              return false;
            }
            if (ability.name.includes(text)) {
              result = true;
            }
            return result;
          })
        : [];
    const toDisplay = filtered.length > 20 ? filtered.slice(0, 20) : filtered;
    setFilteredAbilities(toDisplay);
  }, 200);

  function handleKeyDown(e: any) {
    const { key } = e;
    if (key === 'Enter' && filteredAbilities[0]) {
      onSelect(filteredAbilities[0]);
      if (searchRef.current) {
        searchRef.current.blur();
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 my-4">
      <h1>Select Ability</h1>
      {selected && <h1>Selected Ability: {formatDashName(selected.name)}</h1>}
      <div className="flex flex-col">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            value={search}
            placeholder="Search Abilities"
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
        {filteredAbilities.length > 0 && (
          <ul className="mt-1 max-h-48 overflow-auto border-2 border-black">
            {filteredAbilities.map((ability) => (
              <li
                key={ability.id}
                className="p-2 hover:bg-neutral-600 hover:text-neutral-content cursor-pointer"
                onClick={() => onSelect(ability)}
              >
                {formatDashName(ability.name)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
