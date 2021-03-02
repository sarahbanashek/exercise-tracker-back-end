const CREATE_EXERCISE_TYPES_TABLE = `
CREATE TABLE exercise_types (
    id INTEGER NOT NULL PRIMARY KEY,
    description TEXT NOT NULL
);`;
const DROP_EXERCISE_TYPES_TABLE = 'DROP TABLE exercise_types;';

exports.up = function(knex) {
    return knex.raw(CREATE_EXERCISE_TYPES_TABLE);
};

exports.down = function(knex) {
    return knex.raw(DROP_EXERCISE_TYPES_TABLE);
};