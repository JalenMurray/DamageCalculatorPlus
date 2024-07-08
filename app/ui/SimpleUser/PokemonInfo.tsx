import { Ability, HeldItem, Nature } from '@/app/pokemon-data/definitions';

export type SimplePokemonInfo = { ability: Ability; nature: Nature; heldItem?: HeldItem };

export default function PokemonInfo({
  info,
  onChange,
}: {
  info: SimplePokemonInfo;
  onChange: (newInfo: SimplePokemonInfo) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <h1>Select Ability</h1>
      <h1>Select Nature</h1>
      <h1>Select Held Item</h1>
    </div>
  );
}
