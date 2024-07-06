'use client';

import { createContext, useEffect, useState, useContext } from 'react';
import { CalculatorContextType, MoveOutput } from './types';
import { BattlePokemon, Move } from '../pokemon-data/definitions';
import {
  AttackerInput,
  DamageInfoInput,
  DamageInfoOutput,
  DefenderInput,
  Stats,
} from '../utils/definitions';
import { getBattlePokemonStats } from '../utils/utils';
import { DEFAULT_EVS, DEFAULT_IVS } from '../utils/constants';
import { getDamageRange } from '../utils/formulas';

export const CalculatorContext = createContext<CalculatorContextType>({
  userPokemon: null,
  userMoveOutputs: [],
  enemyPokemon: null,
  enemyMoveOutputs: [],
  conditions: null,
  setUserPokemon: (newPokemon: BattlePokemon) => null,
  setEnemyPokemon: (newPokemon: BattlePokemon) => null,
});

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [userPokemon, setUserPokemon] = useState<BattlePokemon | null>(null);
  const [enemyPokemon, setEnemyPokemon] = useState<BattlePokemon | null>(null);
  const [userMoveOutputs, setUserMoveOutputs] = useState<MoveOutput[]>([]);
  const [enemyMoveOutputs, setEnemyMoveOutputs] = useState<MoveOutput[]>([]);

  useEffect(() => {
    if (!userPokemon || !enemyPokemon) {
      return;
    }

    const { moves: userMoves } = userPokemon;
    const { moves: enemyMoves } = enemyPokemon;

    // User is Attacker
    const uMoveOutputs = userMoves.map((move) => {
      return { id: move.id, ...getDamageInfo(move, userPokemon, enemyPokemon) };
    });

    // User is Defender
    const eMoveOutputs = enemyMoves.map((move) => {
      return { id: move.id, ...getDamageInfo(move, enemyPokemon, userPokemon) };
    });

    setUserMoveOutputs(uMoveOutputs);
    setEnemyMoveOutputs(eMoveOutputs);
  }, [userPokemon, enemyPokemon]);

  function getDamageInfo(
    move: Move,
    offensePokemon: BattlePokemon,
    defensePokemon: BattlePokemon
  ): DamageInfoOutput {
    const { pokemon: aPokemon, level: aLevel, ability: aAbility } = offensePokemon;
    const attackerStats = getBattlePokemonStats(
      offensePokemon,
      DEFAULT_IVS,
      [252, 252, 252, 252, 252, 252]
    );
    const { pokemon: dPokemon, level: dLevel, ability: dAbility } = defensePokemon;
    const defenderStats = getBattlePokemonStats(defensePokemon, DEFAULT_IVS, DEFAULT_EVS);

    const aStats = attackerStats.reduce((acc: any, stat) => {
      acc[stat.name] = stat.avg;
      return acc;
    }, {}) as Stats;
    const dStats = defenderStats.reduce((acc: any, stat) => {
      acc[stat.name] = stat.avg;
      return acc;
    }, {}) as Stats;

    const attacker: AttackerInput = {
      pokemon: aPokemon,
      level: aLevel,
      ability: aAbility,
      move,
      stats: aStats,
    };

    const defender: DefenderInput = {
      pokemon: dPokemon,
      level: dLevel,
      ability: dAbility,
      stats: dStats,
    };

    const output = getDamageRange({ attacker, defender });
    return output;
  }

  const value = {
    userPokemon,
    setUserPokemon,
    userMoveOutputs,
    enemyPokemon,
    setEnemyPokemon,
    enemyMoveOutputs,
  };
  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}
