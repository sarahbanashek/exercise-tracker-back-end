# Exercise Tracker - Back End

## Available Endpoints
- ### /
  - **HTTP Method:** GET

    - **Parameters:** None

    - **Expected Response:**
        ```
        {
        durationAvg: number,
        heartRateAvg: number,
        last20: { 
            date: 'yyyy-mm-dd',
            description: string,
            duration: number,
            heart_rate: number,
            index: number
        }[],
        totalNumOfWorkouts: number,
        totalTimeAllWorkouts: number,
        untilLastWeekDurationAvg: number,
        untilLastWeekHeartRateAvg: number,
        workoutTypeFrequencies: { workoutType: string, totalCount: number }[],
        workoutTypeTimeSpent: { workoutType: string, totalTime: number }[]
        }
        ```

- ### /add-exercise-event
    - **HTTP Method:** GET

        - **Parameters:** None

        - **Expected Response:**
            `{ id: number, description: string }[]`
    
    - **HTTP Method:** POST

        - **Parameters:** 
            ```
            {
                date: 'yyyy-mm-dd',
                duration: string | number,
                exerciseType: number,
                heartRate: string | number | undefined
            }
            ```

        - **Expected Response:**
            `{ "success" : true }`

- ### /edit-exercise-types
    - **HTTP Method:** GET

        - **Parameters:** None

        - **Expected Response:**
            `{ id: number, description: string }[]`

    - **HTTP Method:** POST

        - **Parameters:** 
            ```
            {
                toAdd: string[] | undefined,
                toRemove: string[] | number[] | undefined
            }
            ```
            - toRemove lists the ids corresponding to the exercise type descriptions that are to be removed

        - **Expected Response:**
            `{ "success" : true }`

- ### /edit-exercise-events
    - **HTTP Method:** GET

        - **Parameters:** None

        - **Expected Response:**
            ```
            {
                date: 'yyyy-mm-dd',
                description: string,
                duration: number,
                heart_rate: number,
                id: number
            }[]
            ```
            - Fetches all exercise events from database

     - **HTTP Method:** POST

        - **Parameters:** 
            `number[]`
            - Lists the ids corresponding to the exercise events that are to be removed

        - **Expected Response:**
            `{ "success" : true }`

---

## For more information, see [Exercise Tracker - Front End](https://github.com/sarahbanashek/exercise-tracker-front-end)

---

## Available Scripts

In the project directory, you can run:

### `npm install`
Installs all dependencies.

### `npm start`
Runs the app on port 3001.