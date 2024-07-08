import { Abilities, Nature } from '@/app/pokemon-data/definitions';
import { formatDashName } from '@/app/utils/utils';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function NatureInput({
  selected,
  natures,
  onSelect,
}: {
  selected?: Nature;
  natures: Nature[];
  onSelect: (newNature: Nature) => void;
}) {
  const [filteredAbilities, setFilteredAbilities] = useState<Nature[]>(natures);
  const [search, setSearch] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  const filter = useDebouncedCallback((text: string) => {
    const filtered =
      text !== ''
        ? natures.filter((ability) => {
            let result = false;
            if (ability.name.includes(text)) {
              result = true;
            }
            return result;
          })
        : natures;
    setFilteredAbilities(filtered);
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

  function getNatureStat(input: string): string {
    switch (input) {
      case 'defense':
        return 'Def';
      case 'special-attack':
        return 'Sp. Att';
      case 'special-defense':
        return 'Sp. Def';
      case 'speed':
        return 'Speed';
      default:
        return 'Att';
    }
  }

  function getIncJSX(inc: string | undefined | null) {
    if (!inc) {
      return <p>---</p>;
    }
    const stat = getNatureStat(inc);
    return <p className="text-green-400">⬆ {stat}</p>;
  }

  function getDecJSX(dec: string | undefined | null) {
    if (!dec) {
      return <p>---</p>;
    }
    const stat = getNatureStat(dec);
    return <p className="text-red-500">⬇ {stat}</p>;
  }

  return (
    <div className="flex flex-col gap-4 my-4">
      {selected ? (
        <h1>Selected Nature: {formatDashName(selected.name)}</h1>
      ) : (
        <h1>Select Nature</h1>
      )}
      <div className="card bg-base-300 p-2 text-base-content">
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
        <ul className="h-48 overflow-auto mt-1">
          {filteredAbilities.length > 0 &&
            filteredAbilities.map((nature) => (
              <li
                key={nature.id}
                className={clsx('p-2 cursor-pointer border-black border-2 flex', {
                  'bg-base-100': selected && selected.id === nature.id,
                  'hover:bg-base-100': !selected || selected.id !== nature.id,
                })}
                onClick={() => onSelect(nature)}
              >
                <p className="flex-1">{formatDashName(nature.name)}</p>
                <div className="flex gap-2 text-center">
                  {getIncJSX(nature.increases)}
                  {getDecJSX(nature.decreases)}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
