'use server';
import { getAllPokemon } from './pokemon-data/queries';
import Calculator from './ui/Calculator';
import { capitalize } from './utils/utils';

export default async function Home() {
  const pokemon = await getAllPokemon();

  return (
    <main className="flex bg-base-100 min-h-screen w-full flex-col gap-12 p-4 xl:p-24 justify-center items-center">
      <Calculator allPokemon={pokemon} />
    </main>
  );
}
