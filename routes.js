const sqlite3 = require('sqlite3').verbose();

// let db = new sqlite3.Database('./app.db', err => {
//     if (err) console.error(err.message);
//     console.log('connected to database');
// });
// db.close(err => {
//     if (err) console.error(err.message);
//     console.log('database closing');
// });

function configureRoutes(app) {
    app.get('/', (_, res) => {
        let data = new Object();
        let db = new sqlite3.Database('./app.db', err => {
            if (err) console.error(err.message);
        });
        db.parallelize(() => {
            db.all('SELECT * FROM exercise_types', [], (err, rows) => {
                if (err) throw err;
                data.exerciseTypes = rows;
            });
            db.get('SELECT round(avg(duration), 1) FROM exercise_events', [], (err, value) => {
                if (err) throw err;
                data.durationAvg = value['round(avg(duration), 1)'];
            });
            db.get('SELECT round(avg(heart_rate), 1) FROM exercise_events', [], (err, value) => {
                if (err) throw err;
                data.heartRateAvg = value['round(avg(heart_rate), 1)'];
            });
            db.all(`SELECT date, duration, heart_rate, description 
                    FROM exercise_events
                    INNER JOIN exercise_types
                        ON exercise_types.id = exercise_events.exercise_type_id
                    ORDER BY date DESC
                    LIMIT ?`, [20], (err, rows) => {
                if (err) throw err;
                data.last20 = rows;
                console.dir(data);
            });
            // db.all(`SELECT date, duration 
            //         FROM exercise_events
            //         ORDER BY date DESC
            //         LIMIT ?`, [20], (err, rows) => {
            //     if (err) throw err;
            //     console.log(rows);
            //     data.duration = rows;
            //     console.dir(data);
            // });
        });
        db.close(err => {
            if (err) console.error(err.message);
            res.json(data);
        });
    });

    app.post('/add-exercise-event', (req, res) => {
        console.log(req.body);
        const sql = `INSERT INTO exercise_events (date, duration, heart_rate, exercise_type_id)
                    VALUES ('${req.body.date}', 
                        ${parseInt(req.body.duration, 10)}, 
                        ${req.body.heartRate ? parseInt(req.body.heartRate, 10) : null},
                        ${parseInt(req.body.exerciseType, 10)})`
        console.log(req.body.date);
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
}

module.exports = { configureRoutes };