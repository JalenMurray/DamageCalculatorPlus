import { useEffect, useRef, useState } from 'react';
import {
  Abilities,
  BattlePokemon,
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

export default function BattlePokemonBuilder({
  onAdd,
  pokemon,
  heldItems,
  natures,
  moves,
}: {
  onAdd: (pokemon: BattlePokemon) => void;
  pokemon: Pokemon[];
  heldItems: HeldItem[];
  natures: Nature[];
  moves: Move[];
  abilities: Abilities;
}) {
  type NewPokemonInput = {
    pokemon?: Pokemon;
    ability?: string;
    nature?: Nature;
    heldItem?: HeldItem;
    moves?: Move[];
    level?: number;
    evs: number[];
    ivs: number[];
  };
  const [newPokemon, setNewPokemon] = useState<NewPokemonInput>({
    evs: [0, 0, 0, 0, 0, 0],
    ivs: [31, 31, 31, 31, 31, 31],
  });

  return (
    <div className="drawer-side">
      <label
        htmlFor="new-pokemon-select"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="bg-base-200 text-base-content min-h-full max-w-[95vw] w-[800px] p-8 flex flex-col gap-4">
        <h1 className="text-4xl">Build Trainer Pokemon</h1>
        <PokemonSelector
          allPokemon={pokemon}
          selected={newPokemon.pokemon}
          onSelect={(pokemon) => setNewPokemon((prev) => ({ ...prev, pokemon }))}
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
        <button className="btn btn-success mb-8">Add Pokemon</button>
      </div>
    </div>
  );
}
