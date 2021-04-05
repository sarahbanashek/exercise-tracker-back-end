const sqlite3 = require('sqlite3').verbose();

function configureRoutes(app) {
    app.get('/', (_, res) => {
        let today = new Date();
        const offset = today.getTimezoneOffset();
        let sevenDaysAgo = new Date(today.getTime() - (offset * 60000) - 604800000).toISOString().split('T')[0];

        let data = new Object();

        let db = new sqlite3.Database('./app.db', err => {
            if (err) console.error(err.message);
        });
        db.parallelize(() => {
            db.get('SELECT round(avg(duration), 1) FROM exercise_events', [], (err, value) => {
                if (err) throw err;
                data.durationAvg = value['round(avg(duration), 1)'];
            });
            db.get(`SELECT round(avg(duration), 1) 
                    FROM exercise_events
                    WHERE date < ?`, [sevenDaysAgo], (err, value) => {
                if (err) throw err;
                data.untilLastWeekDurationAvg = value['round(avg(duration), 1)'];
            });
            db.get('SELECT round(avg(heart_rate), 1) FROM exercise_events', [], (err, value) => {
                if (err) throw err;
                data.heartRateAvg = value['round(avg(heart_rate), 1)'];
            });
            db.get(`SELECT round(avg(heart_rate), 1) 
                    FROM exercise_events
                    WHERE date < ?`, [sevenDaysAgo], (err, value) => {
                if (err) throw err;
                data.untilLastWeekHeartRateAvg = value['round(avg(heart_rate), 1)'];
            });
            db.all(`SELECT date, duration, heart_rate, description 
                    FROM exercise_events
                    INNER JOIN exercise_types
                        ON exercise_types.id = exercise_events.exercise_type_id
                    ORDER BY date DESC
                    LIMIT ?`, [20], (err, rows) => {
                if (err) throw err;
                data.last20 = rows;
            });
            db.all(`SELECT description, COUNT(exercise_events.id) 
                    FROM exercise_events
                    INNER JOIN exercise_types
                        ON exercise_types.id = exercise_events.exercise_type_id
                    GROUP BY description`, [], (err, rows) => {
                if (err) throw err;
                data.workoutTypeFrequencies = rows.map(obj => {
                    return { description: obj.description, totalCount: obj['COUNT(exercise_events.id)'] }
                });
            });
            db.get('SELECT COUNT(exercise_events.id) FROM exercise_events', [], (err, value) => {
                if (err) throw err;
                data.totalNumOfWorkouts = value['COUNT(exercise_events.id)'];
            });
            db.all(`SELECT description, SUM(duration) 
                    FROM exercise_events
                    INNER JOIN exercise_types
                        ON exercise_types.id = exercise_events.exercise_type_id
                    GROUP BY description`, [], (err, rows) => {
                if (err) throw err;
                data.workoutTypeTimeSpent = rows.map(obj => {
                    return { description: obj.description, totalTime: obj['SUM(duration)'] }
                });
            });
            db.get('SELECT SUM(duration) FROM exercise_events', [], (err, value) => {
                if (err) throw err;
                data.totalTimeAllWorkouts = value['SUM(duration)'];
            });
        });
        db.close(err => {
            if (err) console.error(err.message);
            res.json(data);
        });
    });

    app.route('/add-exercise-event')
        .get((_, res) => {
            let db = new sqlite3.Database('./app.db', err => {
                if (err) console.error(err.message);
                console.log('connected to database');
            });
            db.all(`SELECT exercise_types.id, description
                    FROM exercise_types 
                    LEFT JOIN exercise_events 
                        ON exercise_types.id = exercise_events.exercise_type_id 
                    GROUP BY description 
                    ORDER BY count(exercise_events.exercise_type_id) desc;`, [], (err, rows) => {
                if (err) throw err;
                res.json(rows);
            });
            db.close(err => {
                if (err) console.error(err.message);
                console.log('database closing');
            });
        })
        .post((req, res) => {
        const sql = `INSERT INTO exercise_events (date, duration, heart_rate, exercise_type_id)
                    VALUES ('${req.body.date}', 
                        ${parseInt(req.body.duration, 10)}, 
                        ${req.body.heartRate ? parseInt(req.body.heartRate, 10) : null},
                        ${parseInt(req.body.exerciseType, 10)})`
        let db = new sqlite3.Database('./app.db', err => {
            if (err) console.error(err.message);
        });
        db.run(sql, [], err => {
            if (err) throw err;
        });
        db.close(err => {
            if (err) console.error(err.message);
        });
        res.json({success: true});
    });

    app.route('/edit-exercise-types')
        .get((_, res) => {
            let db = new sqlite3.Database('./app.db', err => {
                if (err) console.error(err.message);
                console.log('connected to database');
            });
            db.all(`SELECT id, description
                        FROM exercise_types
                        WHERE id NOT IN (SELECT DISTINCT exercise_type_id
                                        FROM exercise_events)`, [], (err, rows) => {
                if (err) throw err;
                res.json(rows);
                });
            db.close(err => {
                if (err) console.error(err.message);
                console.log('database closing');
            });
        })
        .post((req, res) => {
            let db = new sqlite3.Database('./app.db', err => {
                if (err) console.error(err.message);
            });
            if (req.body.toAdd) {
                const toAdd = req.body.toAdd.split(/,\s*/g);
                const placeholders = toAdd.map(type => '(?)').join(', ');
                db.run(`INSERT INTO exercise_types (description)
                        VALUES ${placeholders}`, toAdd, err => {
                    if (err) throw err;
                        });
            }
            if (req.body.toRemove) {
                const idsToRemove = `(${req.body.toRemove.join(', ')})`;
                db.run(`DELETE FROM exercise_types
                        WHERE id IN ${idsToRemove}`, [], err => {
                    if (err) throw err;
                });
            }
            db.close(err => {
                if (err) console.error(err.message);
            });
            res.json({success: true});
        });

        app.route('/edit-exercise-events')
            .get((_, res) => {
                let db = new sqlite3.Database('./app.db', err => {
                    if (err) console.error(err.message);
                });
                db.all(`SELECT exercise_events.id, date, duration, heart_rate, description
                        FROM exercise_events
                        INNER JOIN exercise_types
                            ON exercise_types.id = exercise_events.exercise_type_id
                        ORDER BY date DESC`, [], (err, rows) => {
                    if (err) throw err;
                    res.json(rows);
                });
                db.close(err => {
                    if (err) console.error(err.message);
                });
            })
            .post((req, res) => {
                const idsToDelete = `(${req.body.join(', ')})`;
                let db = new sqlite3.Database('./app.db', err => {
                    if (err) console.error(err.message);
                });
                db.run(`DELETE FROM exercise_events
                        WHERE id IN ${idsToDelete}`, [], err => {
                    if (err) throw err;
                });
                db.close(err => {
                    if (err) console.error(err.message);
                });
                res.json({success: true});
            })
}

module.exports = { configureRoutes };