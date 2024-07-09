import { CalculatorContext } from '@/app/context/calculator';
import { HeldItem } from '@/app/pokemon-data/definitions';
import { formatDashName } from '@/app/utils/utils';
import clsx from 'clsx';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function HeldItemInput() {
  const { userPokemon, setUserPokemon, allHeldItems } = useContext(CalculatorContext);
  const [filteredHeldItems, setFilteredHeldItems] = useState<HeldItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (allHeldItems) {
      setFilteredHeldItems(allHeldItems);
    }
  }, [allHeldItems]);

  function setHeldItem(item: HeldItem) {
    setUserPokemon({ ...userPokemon, heldItem: item });
  }

  function removeHeldItem() {
    setUserPokemon({ ...userPokemon, heldItem: undefined });
  }

  function handleSelect(item: HeldItem) {
    if (userPokemon.heldItem && item.id === userPokemon.heldItem.id) {
      removeHeldItem();
    } else {
      setHeldItem(item);
    }
  }

  const filter = useDebouncedCallback((text: string) => {
    if (!allHeldItems) {
      return;
    }
    const filtered =
      text !== ''
        ? allHeldItems.filter((heldItem) => {
            let result = false;
            if (heldItem.name.includes(text)) {
              result = true;
            }
            return result;
          })
        : allHeldItems;
    const toDisplay = filtered.length > 20 ? filtered.slice(0, 20) : filtered;
    setFilteredHeldItems(toDisplay);
  }, 200);

  function handleKeyDown(e: any) {
    const { key } = e;
    if (key === 'Enter' && filteredHeldItems[0]) {
      handleSelect(filteredHeldItems[0]);
    }
  }

  return (
    <div className="flex flex-col gap-4 my-4">
      {userPokemon.heldItem ? (
        <h1>Selected Item: {formatDashName(userPokemon.heldItem.name)}</h1>
      ) : (
        <h1>Select Item</h1>
      )}
      <div className="card bg-base-300 p-2 text-base-content">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            value={search}
            placeholder="Search Items (All Items Not Supported Yet)"
            onChange={(e) => {
              setSearch(e.target.value);
              filter(e.target.value.toLowerCase().replace(' ', '-'));
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
          {allHeldItems ? (
            filteredHeldItems.length > 0 &&
            filteredHeldItems.map((heldItem) => (
              <li
                key={heldItem.id}
                className={clsx('p-2 cursor-pointer border-black border-2', {
                  'bg-base-100 hover:bg-red-400 hover:text-black':
                    userPokemon.heldItem && userPokemon.heldItem.id === heldItem.id,
                  'hover:bg-base-100':
                    !userPokemon.heldItem || userPokemon.heldItem.id !== heldItem.id,
                })}
                onClick={() => handleSelect(heldItem)}
              >
                {formatDashName(heldItem.name)}
              </li>
            ))
          ) : (
            <div className="skeleton h-48 w-full" />
          )}
        </ul>
      </div>
    </div>
  );
}
