import { useEffect, useRef, useState } from 'react';
import {
  Abilities,
  Ability,
  PokemonFormData,
  HeldItem,
  Move,
  Nature,
  Pokemon,
} from '../pokemon-data/definitions';
import PokemonSelector from './PokemonSelector';
import NatureSelector from './NatureSelector';
import EvIvSelector from './EvIvSelector';
import BattlePokemonMovesSelector from './BattlePokemonMovesSelector';
import HeldItemSelector from './HeldItemSelector';
import AbilitySelector from './AbilitySelector';
import { NewBattlePokemon, NewBattlePokemonMove } from '../pokemon-data/schema';

export default function BattlePokemonBuilder({
  onAdd,
  pokemon,
  heldItems,
  natures,
  moves,
  abilities,
}: {
  onAdd: (pokemon: PokemonFormData, moves: Move[]) => void;
  pokemon: Pokemon[];
  heldItems: HeldItem[];
  natures: Nature[];
  moves: Move[];
  abilities: Abilities;
}) {
  type NewPokemonInput = {
    pokemon?: Pokemon;
    ability?: Ability;
    nature?: Nature;
    heldItem?: HeldItem;
    moves?: Move[];
    level: number;
    evs: number[];
    ivs: number[];
  };
  const [newPokemon, setNewPokemon] = useState<NewPokemonInput>({
    level: 100,
    evs: [0, 0, 0, 0, 0, 0],
    ivs: [31, 31, 31, 31, 31, 31],
  });
  const topRef = useRef<HTMLHeadingElement>(null);

  function setLevel(level: number) {
    setNewPokemon((prev) => ({ ...prev, level }));
  }

  function handleLevelChange(e: any) {
    const { value } = e.target;
    const newLevel = parseInt(value);
    if (newLevel > 100 || newLevel < 0) {
      return;
    }
    setLevel(newLevel);
  }

  function handleAdd() {
    // Validate Input
    const { pokemon, ability, nature, heldItem, moves, level, evs, ivs } = newPokemon;
    if (!pokemon || !ability || !nature || !moves || moves.length < 1 || moves.length > 4) {
      return;
    }
    const newBattlePokemonInput: PokemonFormData = {
      level,
      evs,
      ivs,
      pokemon: pokemon,
      ability: ability,
      nature: nature,
      heldItem: heldItem,
    };
    setNewPokemon({
      level: 100,
      evs: [0, 0, 0, 0, 0, 0],
      ivs: [31, 31, 31, 31, 31, 31],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onAdd(newBattlePokemonInput, moves);
  }

  return (
    <div className="drawer-side">
      <label
        htmlFor="new-pokemon-select"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="bg-base-200 text-base-content min-h-full max-w-[95vw] w-[800px] p-8 flex flex-col gap-4">
        <h1 className="text-4xl" ref={topRef}>
          Build Trainer Pokemon
        </h1>
        <PokemonSelector
          allPokemon={pokemon}
          selected={newPokemon.pokemon}
          onSelect={(pokemon) => setNewPokemon((prev) => ({ ...prev, pokemon }))}
        />
        <div className="flex flex-col gap-4">
          <h1>Enter Level</h1>
          <div className="grid grid-cols-2 gap-4">
            <label className="input border-primary flex items-center gap-2">
              Level:
              <input
                type="number"
                className="pl-4 grow"
                value={newPokemon.level}
                onChange={handleLevelChange}
              />
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button className="btn btn-secondary" onClick={() => setLevel(100)}>
                100
              </button>
              <button className="btn btn-secondary" onClick={() => setLevel(50)}>
                50
              </button>
              <button className="btn btn-secondary" onClick={() => setLevel(5)}>
                5
              </button>
            </div>
          </div>
        </div>
        <AbilitySelector
          abilities={abilities}
          selected={newPokemon.ability}
          onSelect={(ability) => setNewPokemon((prev) => ({ ...prev, ability }))}
        />
        <NatureSelector
          natures={natures}
          selected={newPokemon.nature}
          onSelect={(nature) => setNewPokemon((prev) => ({ ...prev, nature }))}
        />
        <EvIvSelector
          selected={{ evs: newPokemon.evs, ivs: newPokemon.ivs }}
          onSelect={(evs, ivs) => setNewPokemon((prev) => ({ ...prev, evs, ivs }))}
        />
        <HeldItemSelector
          items={heldItems}
          selected={newPokemon.heldItem}
          onSelect={(heldItem) => setNewPokemon((prev) => ({ ...prev, heldItem }))}
        />
        <BattlePokemonMovesSelector
          selected={newPokemon.moves}
          allMoves={moves}
          onSelect={(moves) => setNewPokemon((prev) => ({ ...prev, moves }))}
        />
        <button className="btn btn-success mb-8" onClick={handleAdd}>
          Add Pokemon
        </button>
      </div>
    </div>
  );
}
