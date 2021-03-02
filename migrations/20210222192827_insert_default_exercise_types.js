const INSERT_DEFAULT_EXERCISE_TYPES = `
INSERT INTO exercise_types(description)
VALUES 
('running'), 
('walking'), 
('jogging'), 
('yoga'), 
('weight training'), 
('hiking'), 
('cycling');
`;
const DELETE_DEFAULT_EXERCISE_TYPES = `
DELETE FROM exercise_types
WHERE description IN ('running', 'walking', 'jogging', 'yoga', 'weight training', 'hiking', 'cycling');`
exports.up = function(knex) {
  return knex.raw(INSERT_DEFAULT_EXERCISE_TYPES);
};

exports.down = function(knex) {
  return knex.raw(DELETE_DEFAULT_EXERCISE_TYPES);
};
