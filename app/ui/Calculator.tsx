'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pokemon } from '../pokemon-data/queries';
import Enemy from './Enemy';

export default function Calculator({ allPokemon }: { allPokemon: Pokemon[] }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>(allPokemon);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pokemonPerPage = 10;

  return (
    <div className="flex flex-wrap gap-2 text-base-content">
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
