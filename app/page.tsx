'use server';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAllMoves, getAllPokemon, getTrainers } from './pokemon-data/queries';
import Calculator from './ui/Calculator';
import { capitalize } from './utils/utils';

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

  const input = { pokemon, moves, trainers };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="bg-base-100 min-h-screen w-full p-4 xl:p-24">
        <Calculator input={input} />
      </main>
    </HydrationBoundary>
  );
}
