'use server';

import { Abilities, TrainerFormData } from '../pokemon-data/definitions';
import { createTrainer, getAllAbilities } from '../pokemon-data/queries';

export async function getAbilitiesHelper(): Promise<Abilities> {
  const abilities = await getAllAbilities();
  return abilities;
}

export async function createTrainerHelper(trainer: TrainerFormData) {
  await createTrainer(trainer);
}
