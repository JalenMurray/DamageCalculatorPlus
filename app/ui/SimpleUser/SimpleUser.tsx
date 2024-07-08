import { useState } from 'react';
import StatsInput from './StatsInput';
import PokemonInfo, { SimplePokemonInfo } from './PokemonInfo';
import { Abilities, Ability, HeldItem, Move, Nature } from '@/app/pokemon-data/definitions';
import AbilitySelector from '../AbilitySelector';
import AbilityInput from './AbilityInput';
import NatureInput from './NatureInput';
import HeldItemInput from './HeldItemInput';
import MoveInput from './MoveInput';
import SideDrawer from '../SideDrawer';
import SelectMoveDrawer from './SelectMoveDrawer';
import TypeInput from './TypeInput';

export default function SimpleUser({
  abilities,
  items,
  moves,
  natures,
}: {
  abilities: Abilities;
  items: HeldItem[];
  moves: Move[];
  natures: Nature[];
}) {
  const [stats, setStats] = useState<number[]>([100, 100, 100, 100, 100, 100]);
  const [ability, setAbility] = useState<Ability>(abilities[0]);
  const [nature, setNature] = useState<Nature>(natures[0]);
  const [heldItem, setHeldItem] = useState<HeldItem | undefined>();

  function handleStatChange(newStat: number, i: number) {
    setStats((prev) => prev.map((prevStat, j) => (i === j ? newStat : prevStat)));
  }

  return (
    <>
      <div className="card bg-neutral text-neutral-content h-[1080px] p-8 gap-8">
        <div className="flex flex-col">
          <h1 className="text-5xl">Simple Pokemon Editor</h1>
          <p className="mt-2 text-sm">
            Only input the necessary information to use the calculator quickly. Useful if you want a
            more accurate calculation without finding EVS and IVS
          </p>
          <hr />
        </div>
        <TypeInput />
        <StatsInput stats={stats} onChange={handleStatChange} />
        <div className="grid grid-cols-2 gap-4">
          <AbilityInput
            abilities={abilities}
            selected={ability}
            onSelect={(newAbility) => setAbility(newAbility)}
          />
          {/* <NatureInput
          natures={natures}
          selected={nature}
          onSelect={(newNature) => setNature(newNature)}
        /> */}
          <HeldItemInput
            items={items}
            selected={heldItem}
            onSelect={(newHeldItem) => setHeldItem(newHeldItem)}
          />
        </div>
        <MoveInput moves={moves} />
      </div>
    </>
  );
}
