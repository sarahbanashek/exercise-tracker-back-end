const CREATE_EXERCISE_EVENTS_TABLE = `
CREATE TABLE exercise_events (
    id INTEGER NOT NULL PRIMARY KEY,
    date TEXT NOT NULL,
    duration INTEGER NOT NULL,
    heart_rate INTEGER,
    exercise_type_id INTEGER,
    FOREIGN KEY (exercise_type_id)
        REFERENCES exercise_types (id)
            ON UPDATE CASCADE
);`;
const DROP_EXERCISE_EVENTS_TABLE = 'DROP TABLE exercise_events;';

exports.up = function(knex) {
  return knex.raw(CREATE_EXERCISE_EVENTS_TABLE);
};

exports.down = function(knex) {
    return knex.raw(DROP_EXERCISE_EVENTS_TABLE);
};