const sqlite3 = require('sqlite3').verbose();
// let db = new sqlite3.Database('./app.db', err => {
//     if (err) console.error(err.message);
//     console.log('connected to database');
// });
// db.close(err => {
//     if (err) console.error(err.message);
//     console.log('database closing');
// });
const sql = {
    queryExerciseTypes: `SELECT *
                        FROM exercise_types`
}

function configureRoutes(app) {
    app.route('/')
        .get((_, res) => {
            let db = new sqlite3.Database('./app.db', err => {
                if (err) console.error(err.message);
            });
            db.all(sql.queryExerciseTypes, [], (err, rows) => {
                if (err) throw err;
                console.dir(rows);
                res.json(rows);
            });
            db.close(err => {
                if (err) console.error(err.message);
            });
        });
}

module.exports = { configureRoutes };