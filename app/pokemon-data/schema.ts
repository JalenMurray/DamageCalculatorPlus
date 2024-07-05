import { integer, serial, text, pgTable } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const pokemon = pgTable('Pokemon', {
  id: integer('id').primaryKey(),
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
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
});

export const abilities = pgTable('Abilities', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
});

export const pokemonRelations = relations(pokemon, ({ many }) => ({
  pokemonAbilities: many(pokemonAbilities),
  pokemonTypes: many(pokemonTypes),
}));

export const abilitiesRelations = relations(abilities, ({ many }) => ({
  pokemonAbilities: many(pokemonAbilities),
}));

export const typeRelations = relations(types, ({ many }) => ({
  pokemonTypes: many(pokemonTypes),
}));

export const pokemonAbilities = pgTable('Pokemon Abilities', {
  pokemonId: integer('pokemon_id').notNull(),
  abilityId: integer('ability_id').notNull(),
});

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

export const pokemonTypes = pgTable('Pokemon Types', {
  pokemonId: integer('pokemon_id').notNull(),
  typeId: integer('type_id').notNull(),
});

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
