import { Type } from '../pokemon-data/queries';

export default function TypeCard({ type }: { type: Type }) {
  return (
    <div
      className="card text-white px-4 py-2 border-2 border-black "
      style={{ backgroundColor: type.color }}
    >
      {type.name}
    </div>
  );
}
