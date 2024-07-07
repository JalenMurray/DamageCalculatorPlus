import Image from 'next/image';
import { Pokemon } from '../pokemon-data/definitions';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { capitalize } from '../utils/utils';

export default function PokemonSelector({
  allPokemon,
  selected,
  onSelect,
}: {
  allPokemon: Pokemon[];
  selected?: Pokemon;
  onSelect: (pokemon: Pokemon) => void;
}) {
  const baseSpriteURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredPokemon, setFilteredPokemon] = useState<Array<Pokemon>>(Object.values(allPokemon));
  const [pagePokemon, setPagePokemon] = useState<Array<Pokemon>>([]);
  const [pagesToDisplay, setPagesToDisplay] = useState<string[]>([]);
  const listRef = useRef<HTMLHeadingElement>(null);

  const pokemonPerPage = 24;

  useEffect(() => {
    // Set Initial Pokemon
    const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);
    setTotalPages(totalPages);
    console.log(totalPages);
    setPagePokemon(
      filteredPokemon.slice((currentPage - 1) * pokemonPerPage, currentPage * pokemonPerPage)
    );
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    function setPageButtons() {
      const pageNumbers = [];
      const buttonDeviation = 2;

      const showFirst = currentPage > buttonDeviation + 1;
      const showLast = currentPage < totalPages - buttonDeviation;

      if (showFirst) {
        pageNumbers.push('<<');
      }

      pageNumbers.push('<');

      // Generate page buttons within the range
      for (
        let i = Math.max(1, currentPage - buttonDeviation);
        i <= Math.min(totalPages, currentPage + buttonDeviation);
        i++
      ) {
        pageNumbers.push(`${i}`);
      }

      pageNumbers.push('>');

      if (showLast) {
        pageNumbers.push('>>');
      }

      setPagesToDisplay(pageNumbers);
    }
    function updatePagePokemon() {
      setPagePokemon(
        filteredPokemon.slice((currentPage - 1) * pokemonPerPage, currentPage * pokemonPerPage)
      );
    }
    setPageButtons();
    updatePagePokemon();
  }, [currentPage, totalPages, filteredPokemon]);

  const filter = useDebouncedCallback((text: string) => {
    const filtered =
      text !== ''
        ? allPokemon.filter((pokemon) => {
            let result = false;
            if (pokemon.name.includes(text)) {
              result = true;
            }
            if (pokemon.id === parseFloat(text)) {
              result = true;
            }
            return result;
          })
        : allPokemon;
    const totalPages = Math.ceil(filtered.length / pokemonPerPage);
    setTotalPages(totalPages);
    setFilteredPokemon(filtered);
    setCurrentPage(1);
  }, 200);

  function handlePageChange(e: React.MouseEvent<HTMLButtonElement>) {
    const buttonClicked = e.currentTarget.textContent as string;
    switch (buttonClicked) {
      case '>':
        setCurrentPage(currentPage + 1);
        break;
      case '<':
        setCurrentPage(currentPage - 1);
        break;
      case '>>':
        setCurrentPage(totalPages);
        break;
      case '<<':
        setCurrentPage(1);
        break;
      default:
        setCurrentPage(parseInt(buttonClicked, 10));
        break;
    }

    if (listRef.current) {
      setTimeout(() => {
        (listRef.current as HTMLHeadingElement).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 50);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Select a Pokemon</h1>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search Pokemon"
          onChange={(e) => filter(e.target.value.toLowerCase())}
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
      {selected && <h1>Selected Pokemon: {capitalize(selected.name)}</h1>}
      <div className="card bg-neutral text-neutral-content p-4">
        <div className="grid grid-cols-6 h-[300px]">
          {pagePokemon.map((pokemon) => (
            <div
              className={clsx(
                'flex flex-col h-[75px] text-center items-center justify-center cursor-pointer rounded-full',
                { 'bg-base-content text-base-200': selected && selected.id === pokemon.id },
                {
                  'hover:bg-base-100 hover:text-base-content':
                    !selected || selected.id !== pokemon.id,
                }
              )}
              onClick={() => onSelect(pokemon)}
            >
              <Image
                src={`${baseSpriteURL}${pokemon.id}.png`}
                alt={pokemon.name}
                width={50}
                height={50}
              />
              <h1>{pokemon.name}</h1>
            </div>
          ))}
        </div>
        <div className="flex gap-2 w-full justify-center items-center mt-4 mb-8">
          {pagesToDisplay.map((page) => (
            <button
              className="btn btn-primary"
              key={page}
              onClick={handlePageChange}
              disabled={
                `${currentPage}` === page ||
                (page === '<' && currentPage === 1) ||
                (page === '>' && currentPage === totalPages) ||
                totalPages === 0
              }
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
