import { BattlePokemon } from '../pokemon-data/definitions';
import { DamageInfoOutput } from '../utils/definitions';

export type MoveOutput = DamageInfoOutput & {
  id: number;
};

export type CalculatorContextType = {
  userPokemon: BattlePokemon | null;
  userMoveOutputs: MoveOutput[];
  enemyPokemon: BattlePokemon | null;
  enemyMoveOutputs: MoveOutput[];
  conditions?: null;
  setUserPokemon: (newPokemon: BattlePokemon) => void;
  setEnemyPokemon: (newPokemon: BattlePokemon) => void;
};
