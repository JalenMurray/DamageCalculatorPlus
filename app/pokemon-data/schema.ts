import { integer, serial, text, pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const damageClasses = pgEnum('Damage Classes', ['physical', 'special', 'status']);
export type NewBattlePokemon = typeof battlePokemon.$inferInsert;
export type NewBattlePokemonMove = typeof battlePokemonMoves.$inferInsert;
export type NewTrainer = typeof trainers.$inferInsert;

///////////////////////////////////////////////////////
///////////////       Tables          ////////////////
/////////////////////////////////////////////////////

export const pokemon = pgTable('Pokemon', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  hp: integer('hp').notNull(),
  attack: integer('attack').notNull(),
  defense: integer('defense').notNull(),
  specialAttack: integer('special_attack').notNull(),
  specialDefense: integer('special_defense').notNull(),
  speed: integer('speed').notNull(),
  weight: integer('weight'),
});

export const types = pgTable('Types', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
});

export const abilities = pgTable('Abilities', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const pokemonAbilities = pgTable('Pokemon Abilities', {
  pokemonId: integer('pokemon_id').notNull(),
  abilityId: integer('ability_id').notNull(),
});

export const pokemonTypes = pgTable('Pokemon Types', {
  pokemonId: integer('pokemon_id').notNull(),
  typeId: integer('type_id').notNull(),
});

export const moves = pgTable('Moves', {
  id: serial('id').notNull(),
  name: text('name').notNull(),
  power: integer('power'),
  accuracy: integer('accuracy'),
  pp: integer('pp').notNull(),
  priority: integer('priority').notNull(),
  type: text('type').notNull(),
  damageClass: damageClasses('damage_class').notNull(),
});

export const versionGroups = pgTable('Version Groups', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  generation: integer('generation').notNull(),
});

export const pokemonGames = pgTable('Pokemon Games', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  versionGroup: integer('version-group').notNull(),
});

export const heldItems = pgTable('Held Items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sprite: text('sprite').notNull(),
});

export const trainers = pgTable('Trainers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  sprite: integer('sprite').notNull(),
  pokemonGame: integer('pokemon_game').notNull(),
  cardColor: text('card_color').notNull(),
});

export const battlePokemon = pgTable('Battle Pokemon', {
  id: serial('id').notNull(),
  level: integer('level').notNull(),
  pokemon: integer('pokemon').notNull(),
  ability: integer('ability').notNull(),
  trainer: integer('trainer').notNull(),
  heldItem: integer('held_item'),
  ivs: integer('ivs').array().notNull(),
  evs: integer('evs').array().notNull(),
  nature: integer('nature').notNull(),
});

export const pokedexes = pgTable('Pokedexes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const pokedexVersionGroups = pgTable('Pokedex Version Groups', {
  id: serial('id').primaryKey(),
  pokedex: integer('pokedex').notNull(),
  versionGroup: integer('version_group').notNull(),
});

export const pokedexPokemon = pgTable('Pokedex Pokemon', {
  id: serial('id').primaryKey(),
  pokedex: integer('pokedex').notNull(),
  pokemon: integer('pokemon').notNull(),
  entryNum: integer('entry_num').notNull(),
});

export const battlePokemonMoves = pgTable('Battle Pokemon Moves', {
  id: serial('id').primaryKey(),
  pokemon: integer('pokemon').notNull(),
  move: integer('move').notNull(),
});

export const trainerSprites = pgTable('Trainer Sprites', {
  id: serial('id').notNull(),
  name: text('name').notNull(),
  url: text('url').notNull(),
});

export const natures = pgTable('Natures', {
  id: serial('id').notNull(),
  name: text('name').notNull(),
  increases: text('increases'),
  decreases: text('decreases'),
});

///////////////////////////////////////////////////////
//////////////       Relations          //////////////
/////////////////////////////////////////////////////

export const pokemonRelations = relations(pokemon, ({ many }) => ({
  pokemonAbilities: many(pokemonAbilities),
  pokemonTypes: many(pokemonTypes),
}));

export const abilitiesRelations = relations(abilities, ({ many }) => ({
  pokemonAbilities: many(pokemonAbilities),
  battlePokemon: many(battlePokemon),
}));

export const typeRelations = relations(types, ({ many }) => ({
  pokemonTypes: many(pokemonTypes),
}));

export const battlePokemonRelations = relations(battlePokemon, ({ one, many }) => ({
  pokemon: one(pokemon, {
    fields: [battlePokemon.pokemon],
    references: [pokemon.id],
  }),
  ability: one(abilities, {
    fields: [battlePokemon.ability],
    references: [abilities.id],
  }),
  trainer: one(trainers, {
    fields: [battlePokemon.trainer],
    references: [trainers.id],
  }),
  heldItem: one(heldItems, {
    fields: [battlePokemon.heldItem],
    references: [heldItems.id],
  }),
  moves: many(battlePokemonMoves),
  nature: one(natures, {
    fields: [battlePokemon.nature],
    references: [natures.id],
  }),
}));

export const natureRelations = relations(natures, ({ many }) => ({
  pokemon: many(battlePokemon),
}));

export const moveRelations = relations(moves, ({ many }) => ({
  battlePokemonMoves: many(battlePokemonMoves),
}));

export const trainerRelations = relations(trainers, ({ one, many }) => ({
  pokemonGame: one(pokemonGames, {
    fields: [trainers.pokemonGame],
    references: [pokemonGames.id],
  }),
  battlePokemon: many(battlePokemon),
  sprite: one(trainerSprites, {
    fields: [trainers.sprite],
    references: [trainerSprites.id],
  }),
}));

export const trainerSpriteRelations = relations(trainerSprites, ({ many }) => ({
  trainers: many(trainers),
}));

export const heldItemRelations = relations(heldItems, ({ many }) => ({
  battlePokemon: many(battlePokemon),
}));

export const pokemonGameRelations = relations(pokemonGames, ({ one, many }) => ({
  versionGroup: one(versionGroups, {
    fields: [pokemonGames.versionGroup],
    references: [versionGroups.id],
  }),
  trainers: many(trainers),
}));

export const pokedexRelations = relations(pokedexes, ({ many }) => ({
  pokemon: many(pokedexPokemon),
  versionGroups: many(versionGroups),
}));

export const versionGroupRelations = relations(versionGroups, ({ many }) => ({
  pokemonGame: many(pokemonGames),
  pokedexVersionGroups: many(pokedexVersionGroups),
}));

export const pokemonAbilitiesRelations = relations(pokemonAbilities, ({ one }) => ({
  pokemon: one(pokemon, {
    fields: [pokemonAbilities.pokemonId],
    references: [pokemon.id],
  }),
  ability: one(abilities, {
    fields: [pokemonAbilities.abilityId],
    references: [abilities.id],
  }),
}));

export const pokemonTypesRelations = relations(pokemonTypes, ({ one }) => ({
  pokemon: one(pokemon, {
    fields: [pokemonTypes.pokemonId],
    references: [pokemon.id],
  }),
  type: one(types, {
    fields: [pokemonTypes.typeId],
    references: [types.id],
  }),
}));

export const battlePokemonMovesRelations = relations(battlePokemonMoves, ({ one }) => ({
  battlePokemon: one(battlePokemon, {
    fields: [battlePokemonMoves.pokemon],
    references: [battlePokemon.id],
  }),
  move: one(moves, {
    fields: [battlePokemonMoves.move],
    references: [moves.id],
  }),
}));

export const pokedexPokemonRelations = relations(pokedexPokemon, ({ one }) => ({
  pokemon: one(pokemon, {
    fields: [pokedexPokemon.pokemon],
    references: [pokemon.id],
  }),
  pokedex: one(pokedexes, {
    fields: [pokedexPokemon.pokedex],
    references: [pokedexes.id],
  }),
}));

export const pokedexVersionGroupsRelations = relations(pokedexVersionGroups, ({ one }) => ({
  versionGroup: one(versionGroups, {
    fields: [pokedexVersionGroups.versionGroup],
    references: [versionGroups.id],
  }),
  pokedex: one(pokedexes, {
    fields: [pokedexVersionGroups.pokedex],
    references: [pokedexes.id],
  }),
}));
