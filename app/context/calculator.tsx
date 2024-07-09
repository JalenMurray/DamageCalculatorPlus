'use client';

import { createContext, useEffect, useState, useContext } from 'react';
import { CalculatorContextType, MinPokemonInfo, MoveOutput } from './types';
import {
  Abilities,
  BattlePokemon,
  HeldItem,
  Move,
  Nature,
  Pokemon,
  Type,
} from '../pokemon-data/definitions';
import {
  AttackerInput,
  DamageInfoInput,
  DamageInfoOutput,
  DefenderInput,
  Stats,
} from '../utils/definitions';
import { getBattlePokemonStats } from '../utils/utils';
import { DEFAULT_NATURE } from '../utils/constants';
import { getDamageRange, getStat } from '../utils/formulas';

const DEFAULT_POKEMON: MinPokemonInfo = {
  ability: 'blaze',
  stats: {
    hp: 293,
    attack: 244,
    defense: 178,
    specialAttack: 244,
    specialDefense: 179,
    speed: 252,
  },
  level: 100,
  moves: [],
  types: [
    {
      id: 2,
      name: 'Fire',
      color: '#FF4422',
    },
    { id: 7, name: 'Fighting', color: '#AE4F3F' },
  ],
};

export const CalculatorContext = createContext<CalculatorContextType>({
  allPokemon: null,
  allAbilities: null,
  allHeldItems: null,
  allMoves: null,
  allNatures: null,
  allTypes: null,
  userPokemon: DEFAULT_POKEMON,
  userMoveOutputs: [],
  enemyPokemon: DEFAULT_POKEMON,
  enemyMoveOutputs: [],
  conditions: null,
  setUserPokemon: (newPokemon: MinPokemonInfo) => null,
  setEnemyPokemon: (newPokemon: MinPokemonInfo) => null,
  setAllPokemon: (pokemonList: Pokemon[]) => null,
  setAllAbilities: (abilityList: Abilities) => null,
  setAllHeldItems: (itemList: HeldItem[]) => null,
  setAllMoves: (moveList: Move[]) => null,
  setAllNatures: (natureList: Nature[]) => null,
  setAllTypes: (typeList: Type[]) => null,
});

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [userPokemon, setUserPokemon] = useState<MinPokemonInfo>(DEFAULT_POKEMON);
  const [enemyPokemon, setEnemyPokemon] = useState<MinPokemonInfo>(DEFAULT_POKEMON);
  const [userMoveOutputs, setUserMoveOutputs] = useState<MoveOutput[]>([]);
  const [enemyMoveOutputs, setEnemyMoveOutputs] = useState<MoveOutput[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [allAbilities, setAllAbilities] = useState<Abilities>([]);
  const [allHeldItems, setAllHeldItems] = useState<HeldItem[]>([]);
  const [allMoves, setAllMoves] = useState<Move[]>([]);
  const [allNatures, setAllNatures] = useState<Nature[]>([]);
  const [allTypes, setAllTypes] = useState<Type[]>([]);

  useEffect(() => {
    if (!userPokemon || !enemyPokemon) {
      return;
    }

    const { moves: userMoves } = userPokemon;
    const { moves: enemyMoves } = enemyPokemon;

    // User is Attacker
    // If Simple
    const uMoveOutputs = userMoves.map((move) => {
      const attacker = getAttacker(move, userPokemon);
      const defender = getDefender(move, enemyPokemon);
      return { id: move.id, ...getDamageRange({ attacker, defender }) };
    });
    setUserMoveOutputs(uMoveOutputs);

    // User is Defender
    const eMoveOutputs = enemyMoves.map((move) => {
      const attacker = getAttacker(move, enemyPokemon);
      const defender = getDefender(move, userPokemon);
      return { id: move.id, ...getDamageRange({ attacker, defender }) };
    });
    setEnemyMoveOutputs(eMoveOutputs);
  }, [userPokemon, enemyPokemon]);

  function getAttacker(move: Move, pokemon: MinPokemonInfo): AttackerInput {
    let attack: number;
    if (pokemon.pokemon && pokemon.nature) {
      switch (move.damageClass) {
        case 'physical':
          attack = getStat(
            false,
            pokemon.level,
            (pokemon.ivs as number[])[1],
            (pokemon.evs as number[])[1],
            pokemon.pokemon.stats.attack.value,
            pokemon.nature.id
          );
          break;
        case 'special':
          attack = getStat(
            false,
            pokemon.level,
            (pokemon.ivs as number[])[3],
            (pokemon.evs as number[])[3],
            pokemon.pokemon.stats.specialAttack.value,
            pokemon.nature.id
          );
          break;
        default:
          attack = 0;
      }
    } else {
      const { attack: physical, specialAttack: special } = pokemon.stats as Stats;
      attack =
        move.damageClass === 'physical' ? physical : move.damageClass === 'special' ? special : 0;
    }
    return {
      level: pokemon.level,
      move: move,
      attack,
      ability: pokemon.ability,
      types: pokemon.types,
    };
  }

  function getDefender(move: Move, pokemon: MinPokemonInfo): DefenderInput {
    let defense: number;
    let hp: number;
    if (pokemon.pokemon && pokemon.nature) {
      hp = getStat(
        true,
        pokemon.level,
        (pokemon.ivs as number[])[0],
        (pokemon.evs as number[])[0],
        pokemon.pokemon.stats.hp.value,
        pokemon.nature.id
      );
      switch (move.damageClass) {
        case 'physical':
          defense = getStat(
            false,
            pokemon.level,
            (pokemon.ivs as number[])[2],
            (pokemon.evs as number[])[2],
            pokemon.pokemon.stats.defense.value,
            pokemon.nature.id
          );
          break;
        case 'special':
          defense = getStat(
            false,
            pokemon.level,
            (pokemon.ivs as number[])[4],
            (pokemon.evs as number[])[4],
            pokemon.pokemon.stats.specialDefense.value,
            pokemon.nature.id
          );
          break;
        default:
          defense = 0;
      }
    } else {
      const { defense: physical, specialDefense: special, hp: pokemonHP } = pokemon.stats as Stats;
      hp = pokemonHP;
      defense =
        move.damageClass === 'physical' ? physical : move.damageClass === 'special' ? special : 0;
    }
    return {
      hp,
      defense,
      ability: pokemon.ability,
      types: pokemon.types,
    };
  }

  const value = {
    userPokemon,
    setUserPokemon,
    userMoveOutputs,
    enemyPokemon,
    setEnemyPokemon,
    enemyMoveOutputs,
    allPokemon,
    allAbilities,
    allHeldItems,
    allMoves,
    allNatures,
    allTypes,
    setAllPokemon,
    setAllAbilities,
    setAllHeldItems,
    setAllMoves,
    setAllNatures,
    setAllTypes,
  };
  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}
