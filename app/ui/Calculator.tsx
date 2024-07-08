'use client';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Abilities, HeldItem, Move, Nature, Pokemon, Trainer } from '../pokemon-data/definitions';
import Enemy from './Enemy';
import { getDamageRange, getStat } from '../utils/formulas';
import { AttackerInput, DefenderInput } from '../utils/definitions';
import EnemyTrainer from './EnemyTrainer';
import UserTrainer from './UserTrainer';
import { trainers } from '../pokemon-data/schema';
import SimpleUser from './SimpleUser/SimpleUser';
import SideDrawer from './SideDrawer';
import SelectMoveDrawer from './SimpleUser/SelectMoveDrawer';
import { CalculatorContext } from '../context/calculator';

export default function Calculator({
  input,
}: {
  input: {
    pokemon: Pokemon[];
    moves: Move[];
    trainers: Trainer[];
    abilities: Abilities;
    items: HeldItem[];
    natures: Nature[];
  };
}) {
  const { setAllPokemon, setAllAbilities, setAllMoves, setAllNatures, setAllHeldItems } =
    useContext(CalculatorContext);

  useEffect(() => {
    const { pokemon, moves, abilities, items, natures } = input;
    setAllPokemon(pokemon);
    setAllAbilities(abilities);
    setAllMoves(moves);
    setAllHeldItems(items);
    setAllNatures(natures);
  }, [input]);

  return (
    <>
      <div className="grid grid-cols-11 gap-4 text-base-content w-full h-full">
        {/* You */}
        <div className="min-w-[320px] col-span-5">
          <SimpleUser
            abilities={input.abilities}
            items={input.items}
            moves={input.moves}
            natures={input.natures}
          />
        </div>
        <div className="h-full w-full flex items-center justify-center text-center">
          <h1 className="text-primary text-6xl">vs.</h1>
        </div>
        {/* Them */}
        <div className="min-w-[320px] w-full h-full col-span-5">
          <EnemyTrainer trainer={input.trainers[4]} />
          {/* <Enemy pokemon={pokemon[2]} /> */}
        </div>
      </div>
      <SideDrawer id="new-move-select">
        <SelectMoveDrawer />
      </SideDrawer>
    </>
  );
}
