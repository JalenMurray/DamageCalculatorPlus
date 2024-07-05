'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pokemon } from '../pokemon-data/queries';
import Enemy from './Enemy';

export default function Calculator({ allPokemon }: { allPokemon: Pokemon[] }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>(allPokemon);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pokemonPerPage = 10;

  useEffect(() => {
    fetchPokemon(page);
  }, [page]);

  function fetchPokemon(page: number) {
    setLoading(true);
    const newPokemon = allPokemon.slice((page - 1) * pokemonPerPage, page * pokemonPerPage);
    setPokemon((prevPokemon) => [...prevPokemon, ...newPokemon]);
    setLoading(false);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* You */}
      <div className="min-w-[320px]">You</div>
      <div>Vs.</div>
      {/* Them */}
      <div className="min-w-[320px]">
        <Enemy pokemon={pokemon[2]} />
      </div>
    </div>
  );
}
