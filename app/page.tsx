'use server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import {
  getAllAbilities,
  getAllHeldItems,
  getAllMoves,
  getAllNatures,
  getAllPokemon,
  getTrainers,
} from './pokemon-data/queries';
import Calculator from './ui/Calculator';
import { capitalize, sortByName } from './utils/utils';
import { Abilities, HeldItem, Move, Nature } from './pokemon-data/definitions';

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['allPokemon'],
    queryFn: async () => await getAllPokemon(),
  });

  await queryClient.prefetchQuery({
    queryKey: ['allMoves'],
    queryFn: async () => await getAllMoves(),
  });

  await queryClient.prefetchQuery({
    queryKey: ['trainers'],
    queryFn: async () => await getTrainers(),
  });

  const pokemon = await getAllPokemon();
  const moves = await getAllMoves();
  const trainers = await getTrainers();
  const abilities = await getAllAbilities();
  const items = await getAllHeldItems();
  const natures = await getAllNatures();

  const input = {
    pokemon,
    moves: moves,
    trainers,
    abilities: sortByName(abilities) as Abilities,
    items: sortByName(items) as HeldItem[],
    natures: sortByName(natures) as Nature[],
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="bg-base-100 min-h-screen w-full p-4 xl:p-24">
        <Calculator input={input} />
      </main>
    </HydrationBoundary>
  );
}
