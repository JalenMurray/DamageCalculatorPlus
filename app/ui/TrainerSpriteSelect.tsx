'use client';

import Image from 'next/image';
import { TrainerSprite } from '../pokemon-data/definitions';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function TrainerSpriteSelect({
  sprites,
  onSelect,
}: {
  sprites: TrainerSprite[];
  onSelect: (sprite: TrainerSprite) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredSprites, setFilteredSprites] = useState<TrainerSprite[]>(sprites);
  const [pageSprites, setPageSprites] = useState<TrainerSprite[]>([]);
  const [pagesToDisplay, setPagesToDisplay] = useState<string[]>([]);
  const listRef = useRef<HTMLHeadingElement>(null);

  const spritesPerPage = 30;

  useEffect(() => {
    // Set Initial States
    const totalPages = Math.ceil(filteredSprites.length / spritesPerPage);
    setTotalPages(totalPages);
    setPageSprites(
      filteredSprites.slice((currentPage - 1) * spritesPerPage, currentPage * spritesPerPage)
    );
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    function setPageButtons() {
      const pageNumbers = [];
      const buttonDeviation = 1;
      const showFirst = currentPage > buttonDeviation + 1;
      const showLast = currentPage < totalPages - buttonDeviation;
      if (showFirst) {
        pageNumbers.push('<<');
      }
      pageNumbers.push('<');
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
    function updatePageSprites() {
      setPageSprites(
        filteredSprites.slice((currentPage - 1) * spritesPerPage, currentPage * spritesPerPage)
      );
    }
    setPageButtons();
    updatePageSprites();
  }, [currentPage, totalPages, filteredSprites]);

  // const filter = useDebouncedCallback((text: string) => {
  //   const tokens = text.split(' ')
  // })

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
    <div className="drawer-side">
      <label
        htmlFor="trainer-sprite-select"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="bg-base-200 text-base-content min-h-full max-w-[95vw] w-[800px] p-8 flex flex-col gap-4">
        <h1 className="text-4xl" ref={listRef}>
          Select Trainer Sprite
        </h1>
        <div className="grid grid-cols-5 h-[900px]">
          {pageSprites.map((sprite) => (
            <div
              className="flex flex-col cursor-pointer justify-center items-center text-center"
              key={sprite.id}
            >
              <Image
                src={`https://play.pokemonshowdown.com/sprites/trainers/${sprite.url}`}
                alt={sprite.name}
                width={100}
                height={100}
                onClick={() => onSelect(sprite)}
              />
              <h1>{sprite.name}</h1>
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
                (page === '>' && currentPage === totalPages)
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
