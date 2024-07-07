import {
  getAllGames,
  getAllHeldItems,
  getAllMoves,
  getAllNatures,
  getAllPokemon,
  getAllTrainerSprites,
} from '../pokemon-data/queries';
import NewTrainerForm from '../ui/NewTrainerForm';

export default async function Page() {
  const pokemon = await getAllPokemon();
  const moves = await getAllMoves();
  const games = await getAllGames();
  const heldItems = await getAllHeldItems();
  const trainerSprites = await getAllTrainerSprites();
  const natures = await getAllNatures();

  return (
    <main className="bg-base-100 min-h-screen w-full p-4 xl:p-24">
      <NewTrainerForm
        pokemon={pokemon}
        moves={moves}
        games={games}
        heldItems={heldItems}
        trainerSprites={trainerSprites}
        natures={natures}
      />
    </main>
  );
}
