import { useState } from 'react';
import { HeldItem } from '../pokemon-data/definitions';
import { useDebouncedCallback } from 'use-debounce';
import { formatDashName } from '../utils/utils';
import Image from 'next/image';

export default function HeldItemSelector({
  items,
  selected,
  onSelect,
}: {
  items: HeldItem[];
  selected?: HeldItem;
  onSelect: (heldItem: HeldItem | undefined) => void;
}) {
  const [filteredItems, setFilteredItems] = useState<HeldItem[]>([]);
  const [search, setSearch] = useState<string>('');

  const filter = useDebouncedCallback((text: string) => {
    const filtered =
      text !== ''
        ? items.filter((item) => {
            let result = false;
            if (selected && item.id === selected.id) {
              return false;
            }
            if (item.name.includes(text)) {
              result = true;
            }
            if (item.id === parseFloat(text)) {
              result = true;
            }
            return result;
          })
        : [];
    const toDisplay = filtered.length > 20 ? filtered.slice(0, 20) : filtered;
    setFilteredItems(toDisplay);
  }, 200);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1>Select an Item</h1>
      <div className="flex flex-col">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            value={search}
            placeholder="Search Items"
            onChange={(e) => {
              setSearch(e.target.value);
              filter(e.target.value.toLowerCase().replace(' ', '-'));
            }}
            onBlur={() => {
              setSearch('');
              filter('');
            }}
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
        {filteredItems.length > 0 && (
          <ul className="mt-1 max-h-48 overflow-auto border-2 border-black">
            {filteredItems.map((item, index) => (
              <li
                key={index}
                className="p-2 hover:bg-neutral-600 hover:text-neutral-content cursor-pointer"
                onClick={() => onSelect(item)}
              >
                {formatDashName(item.name)}
              </li>
            ))}
          </ul>
        )}
      </div>
      {selected && (
        <div className="flex justify-center items-center">
          <div
            className="card bg-base-300 text-base-content w-[400px] h-[115px] cursor-pointer"
            onClick={() => onSelect(undefined)}
          >
            <div className="flex gap-4 justify-center items-center">
              <Image src={selected.sprite} alt={selected.name} width={100} height={100} />
              <h1 className="text-2xl">{formatDashName(selected.name)}</h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
