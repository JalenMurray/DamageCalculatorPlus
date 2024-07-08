import {
  BattlePokemon,
  Ability,
  Nature,
  HeldItem,
  Pokemon,
  Move,
  Abilities,
} from '../pokemon-data/definitions';
import { DamageInfoOutput, Stats } from '../utils/definitions';

export type MoveOutput = DamageInfoOutput & {
  id: number;
};

export interface MinPokemonInfo {
  ability: Ability;
  nature: Nature;
  heldItem?: HeldItem;
  pokemon?: Pokemon;
  stats?: Stats;
  level: number;
  evs?: number[];
  ivs?: number[];
  moves: Move[];
  status?: 'burn' | 'paralyze';
}

export type CalculatorContextType = {
  allPokemon: Pokemon[] | null;
  allMoves: Move[] | null;
  allAbilities: Abilities | null;
  allHeldItems: HeldItem[] | null;
  allNatures: Nature[] | null;
  userPokemon: MinPokemonInfo | null;
  userMoveOutputs: MoveOutput[];
  enemyPokemon: MinPokemonInfo | null;
  enemyMoveOutputs: MoveOutput[];
  conditions?: null;
  setUserPokemon: (newPokemon: MinPokemonInfo) => void;
  setEnemyPokemon: (newPokemon: MinPokemonInfo) => void;
  setAllPokemon: (pokemonList: Pokemon[]) => void;
  setAllMoves: (moveList: Move[]) => void;
  setAllAbilities: (abilityList: Abilities) => void;
  setAllHeldItems: (itemList: HeldItem[]) => void;
  setAllNatures: (natureList: Nature[]) => void;
};
