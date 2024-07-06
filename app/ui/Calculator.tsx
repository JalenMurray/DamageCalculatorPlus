'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Move, Pokemon, Trainer } from '../pokemon-data/definitions';
import Enemy from './Enemy';
import { getDamageRange, getStat } from '../utils/formulas';
import { AttackerInput, DefenderInput } from '../utils/definitions';
import { createStatInput } from '../utils/utils';
import EnemyTrainer from './EnemyTrainer';
import UserTrainer from './UserTrainer';
import { trainers } from '../pokemon-data/schema';

export default function Calculator({
  input,
}: {
  input: { pokemon: Pokemon[]; moves: Move[]; trainers: Trainer[] };
}) {
  const [pokemon, setPokemon] = useState<Pokemon[]>(input.pokemon);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pokemonPerPage = 10;
  const baseEvs = [0, 0, 0, 0, 0, 0];
  const baseIvs = [31, 31, 31, 31, 31, 31];

  // function test() {
  //   if (!moves) {
  //     return;
  //   }
  //   const attackerPokemon = pokemon[5];
  //   const attackMove = moves[52];
  //   const attacker: AttackerInput = {
  //     pokemon: attackerPokemon,
  //     move: attackMove,
  //     level: 100,
  //     stats: createStatInput(attackerPokemon, baseEvs, baseIvs, 1),
  //     ability: attackerPokemon.abilities[0],
  //     burn: false,
  //   };

  //   const defenderPokemon = pokemon[2];
  //   const defender: DefenderInput = {
  //     pokemon: defenderPokemon,
  //     level: 100,
  //     stats: createStatInput(defenderPokemon, baseEvs, baseIvs, 1),
  //     ability: defenderPokemon.abilities[0],
  //   };

  //   const processTurn = getDamageRange({ attacker, defender });
  //   console.log(`${processTurn?.floor.toFixed(2)}% - ${processTurn?.ceiling.toFixed(2)}%`);
  // }

  // test();

  return (
    <div className="grid grid-cols-11 gap-4 text-base-content w-full h-full">
      {/* You */}
      <div className="min-w-[320px] col-span-5">
        <UserTrainer trainer={input.trainers[0]} />
      </div>
      <div className="h-full w-full flex items-center justify-center text-center">
        <h1 className="text-primary text-6xl">vs.</h1>
      </div>
      {/* Them */}
      <div className="min-w-[320px] w-full h-full col-span-5">
        <EnemyTrainer trainer={input.trainers[0]} />
        {/* <Enemy pokemon={pokemon[2]} /> */}
      </div>
    </div>
  );
}
