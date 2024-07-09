import { CalculatorContext } from '@/app/context/calculator';
import { Abilities, Ability } from '@/app/pokemon-data/definitions';
import { formatDashName, sortByName } from '@/app/utils/utils';
import clsx from 'clsx';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function AbilityInput() {
  const { userPokemon, setUserPokemon, allAbilities } = useContext(CalculatorContext);
  const [filteredAbilities, setFilteredAbilities] = useState<Abilities>([]);
  const [search, setSearch] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (allAbilities) {
      setFilteredAbilities(sortByName(allAbilities) as Abilities);
    }
  }, [allAbilities]);

  const filter = useDebouncedCallback((text: string) => {
    if (!allAbilities) {
      return;
    }
    const filtered =
      text !== ''
        ? allAbilities.filter((ability) => {
            let result = false;
            if (ability.name.includes(text)) {
              result = true;
            }
            return result;
          })
        : allAbilities;
    const toDisplay = filtered.length > 20 ? filtered.slice(0, 20) : filtered;
    setFilteredAbilities(sortByName(toDisplay) as Abilities);
  }, 200);

  function setAbility(ability: Ability) {
    setUserPokemon({ ...userPokemon, ability: ability.name });
  }

  function handleKeyDown(e: any) {
    const { key } = e;
    if (key === 'Enter' && filteredAbilities[0]) {
      setAbility(filteredAbilities[0]);
      if (searchRef.current) {
        searchRef.current.blur();
      }
    }
  }

  return (
    <div className="flex flex-col gap-4 my-4">
      {userPokemon.ability ? (
        <h1>Selected Ability: {formatDashName(userPokemon.ability)}</h1>
      ) : (
        <h1>Select Ability</h1>
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
            filteredAbilities.map((ability) => (
              <li
                key={ability.id}
                className={clsx('p-2 cursor-pointer border-black border-2', {
                  'bg-base-100': userPokemon.ability === ability.name,
                  'hover:bg-base-100': !userPokemon.ability || userPokemon.ability !== ability.name,
                })}
                onClick={() => setAbility(ability)}
              >
                {formatDashName(ability.name)}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
