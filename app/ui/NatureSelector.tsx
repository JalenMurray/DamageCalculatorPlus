import Image from 'next/image';
import { Nature, Pokemon } from '../pokemon-data/definitions';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';
import { capitalize } from '../utils/utils';
import clsx from 'clsx';

export default function NatureSelector({
  natures,
  selected,
  onSelect,
}: {
  natures: Nature[];
  selected?: Nature;
  onSelect: (nature: Nature) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredNatures, setFilteredNatures] = useState<Nature[]>(natures);
  const [pageNatures, setPageNatures] = useState<Nature[]>([]);
  const [pagesToDisplay, setPagesToDisplay] = useState<string[]>([]);
  const listRef = useRef<HTMLHeadingElement>(null);

  const naturesPerPage = 5;

  useEffect(() => {
    // Set Initial Pokemon
    const totalPages = Math.ceil(filteredNatures.length / naturesPerPage);
    setTotalPages(totalPages);
    console.log(totalPages);
    setPageNatures(
      filteredNatures.slice((currentPage - 1) * naturesPerPage, currentPage * naturesPerPage)
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
      setPageNatures(
        filteredNatures.slice((currentPage - 1) * naturesPerPage, currentPage * naturesPerPage)
      );
    }
    setPageButtons();
    updatePagePokemon();
  }, [currentPage, totalPages, filteredNatures]);

  const filter = useDebouncedCallback((text: string) => {
    const filtered =
      text !== ''
        ? natures.filter((pokemon) => {
            let result = false;
            if (pokemon.name.includes(text)) {
              result = true;
            }
            return result;
          })
        : natures;
    const totalPages = Math.ceil(filtered.length / naturesPerPage);
    setTotalPages(totalPages);
    setFilteredNatures(filtered);
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

  function getIncJSX(inc: string) {
    const stat = getNatureStat(inc);
    return <p className="text-green-400">⬆ {stat}</p>;
  }

  function getDecJSX(dec: string) {
    const stat = getNatureStat(dec);
    return <p className="text-red-500">⬇ {stat}</p>;
  }

  function getNatureEffect(nature: Nature) {
    const inc = nature.increases ? getIncJSX(nature.increases) : <p>---</p>;
    const dec = nature.decreases ? getDecJSX(nature.decreases) : <p>---</p>;
    return (
      <div className="flex gap-2 justify-center items-center text-center">
        {inc} {dec}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1>Select a Nature</h1>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search Natures"
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
      {selected && <h1>Selected Nature: {capitalize(selected.name)}</h1>}
      <div className="card bg-neutral text-neutral-content p-4">
        <div className="grid grid-cols-5 h-[100px] gap-4">
          {pageNatures.map((nature) => (
            <div
              className={clsx(
                'card text-center items-center justify-center cursor-pointer',
                { 'bg-base-content text-base-200': selected && selected.name === nature.name },
                {
                  'hover:bg-base-300 hover:text-base-content bg-base-100 text-base-content':
                    !selected || selected.name !== nature.name,
                }
              )}
              onClick={() => onSelect(nature)}
            >
              <h1>{capitalize(nature.name)}</h1>
              {getNatureEffect(nature)}
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
