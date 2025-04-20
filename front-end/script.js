const URL = "http://localhost:8080/"

function convertUserToJson() {
    let form = document.getElementById("userData");
    let formData = {};
    for (let i = 0; i < form.elements.length; i++) {
        let element = form.elements[i];
        if (element.type !== "submit") {
            formData[element.name] = element.value;
        }
    }
    return JSON.stringify(formData);
}    

async function sendUserData(jsonData) {
    let url = URL + "api/users"
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData,
        });

        const json = await response.json()
        let jsonOutput = document.getElementById("jsonOutput");
        jsonOutput.innerHTML = `<pre>${json.last_name}, ${json.first_name}, ${json.id}, ${json.email}, ${json.username} </pre>`;
    }
    catch (error) {
        console.error('Error:', error)
    }
}

function clearUserFormFields() {
    document.getElementById('last_name').value = '';
    document.getElementById('first_name').value = '';
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';

}

function submitUserFormData() {
    const JSONData = convertUserToJson();
    sendUserData(JSONData)
    clearUserFormFields();
}

function mySubmitFunction(e) {
    e.preventDefault();
}

function addExerciseForm() {
    const formContainer = document.createElement("div");
    formContainer.id = `exerciseFormContainer`;

    formContainer.innerHTML = `        
     <form id="exerciseData" onsubmit="mySubmitFunction(event)" method="post">
        <label for="name">Exercise Name:</label>
        <input type="text" name="name" id="name">

        <label for="tool">Exercise Tool:</label>
        <input type="text" name="tool" id="tool">

        <label for="user_id">User Who Created Exercise:</label>
        <input type="text" name="user_id" id="user_id">

        <button type="submit" onclick="submitExerciseFormData()">Submit</button>
        
    </form>
    `;

    document.getElementById('createExercise').style.display = 'none';
    document.getElementById('Exercises').appendChild(formContainer);
}

function convertExerciseToJson() {
    let form = document.getElementById("exerciseData");
    let formData = {};
    for (let i = 0; i < form.elements.length; i++) {
        let element = form.elements[i];
        if (element.type !== "submit") {
            formData[element.name] = element.value;
        }
    }
    return JSON.stringify(formData);
} 

async function sendExerciseData(jsonData) {
    let url = URL + "api/exercises"
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData,
        });

        const json = await response.json()
        console.log(json)
        let div = document.createElement('div')
        let jsonOutput = document.getElementById("exercises");
        div.innerHTML = `<pre>${json.name}, ${json.tool}, ${json.id}, ${json.user_id} </pre>`;
        jsonOutput.appendChild(div);
        fetchExercises();
    }
    catch (error) {
        console.error('Error:', error)
    }
}

function clearExerciseFormFields() {
    document.getElementById('name').value = '';
    document.getElementById('tool').value = '';
    document.getElementById('user_id').value = '';
}

function submitExerciseFormData() {
    let jsonData = convertExerciseToJson();
    sendExerciseData(jsonData);
    clearExerciseFormFields();
}

async function fetchExercises() {
    try {
        const response = await fetch(`${URL}api/exercises`);
        const exercises = await response.json();

        if (!exercises || exercises.length === 0) {
            console.warn("No exercises found")
            return;
        }

        populateExerciseDropdown(exercises);
    } catch (error) {
        console.error("Error fetching exercises:", error);
    }
}

function populateExerciseDropdown(exercises) {
    const selects = document.querySelectorAll("#exerciseList select")

    selects.forEach(select => {
        select.innerHTML = "";
        exercises.forEach(exercise => {
            let option = document.createElement("option");
            option.value = exercise.id;
            option.textContent = `${exercise.name}, ${exercise.tool}`;
            select.appendChild(option);
        });
    });
}

document.addEventListener("DOMContentLoaded", fetchExercises);

function convertWorkoutToJson() {
    const form = document.getElementById("workoutRoutineData");

    const formData = {
        name: form.workoutRoutineName.value,
        description: form.description.value,
        total_duration: parseInt(form.duration.value),
        rounds_per_exercise: parseInt(form.roundsPerExercise.value),
        round_duration: parseInt(form.roundDuration.value),
        rest_duration: parseInt(form.restDuration.value),
        exercises: [
            form.elements["exercise1"].value,
            form.elements["exercise2"].value,
            form.elements["exercise3"].value,
            form.elements["exercise4"].value,
            form.elements["exercise5"].value,
        ]
    };

    console.log(formData)
    return JSON.stringify(formData);
}

async function sendWorkoutData(jsonData) {
    let url = URL + "api/workouts"
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData,
        });

        const json = await response.json()
        console.log(json)
        let div = document.createElement('div')
        let jsonOutput = document.getElementById("WorkoutRoutines");
        div.innerHTML = `<pre>${json.Workout.name}, ${json.Workout.description}, ${json.Exercises}</pre>`;
        jsonOutput.appendChild(div);
        fetchWorkouts();
    }
    catch (error) {
        console.error('Error:', error)
    }
}

function clearWorkoutFormFields() {
    document.getElementById('workoutRoutineName').value = '';
    document.getElementById('description').value = '';
    document.getElementById('duration').value = '';
    document.getElementById('roundsPerExercise').value = '';
    document.getElementById('roundDuration').value = '';
    document.getElementById('restDuration').value = '';
}

function submitWorkoutRoutineFormData() {
    const jsonData = convertWorkoutToJson();
    sendWorkoutData(jsonData);
    clearWorkoutFormFields();
}

async function fetchWorkouts() {
    try {
        const response = await fetch(`${URL}api/workouts`);
        const workouts = await response.json();

        if (!workouts || workouts.length === 0) {
            console.warn("No workouts found")
            return;
        }

        populateWorkoutDropdown(workouts);
    } catch (error) {
        console.error("Error fetching workouts:", error);
    }
}
function populateWorkoutDropdown(workouts) {
    const select = document.querySelector("#workoutData select")

    select.innerHTML = "";
    workouts.forEach(workout => {
        let option = document.createElement("option");
        option.value = workout.id;
        option.textContent = workout.name;
        select.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", fetchWorkouts);

async function populateWorkoutExercises() {
    const workoutID = document.getElementById("workoutData").elements["workoutName"].value;
    const response = await fetch(`${URL}api/workouts/${workoutID}`);
    const exercises = await response.json();

    if (!exercises || exercises.length === 0) {
        console.warn("No workouts found")
        return;
    }

    const selects = document.querySelectorAll("td:nth-child(1)")

    const exerciseIDs = exercises.ExerciseIDs;

    const exerciseData = await Promise.all(exerciseIDs.map(async (exerciseID) => {
        const response = await fetch(URL + `api/exercises/${exerciseID}`);
        const data = await response.json();
        return data;
    }));

    selects.forEach((select, i) => {
        if (i < exerciseIDs.length && i < exerciseData.length) {
            select.value = exerciseIDs[i];
            select.innerHTML = exerciseData[i].name;
        }
    });    

    const timer = document.querySelector("#timer")

    timer.innerHTML = `Timer: ${exercises.Workout.total_duration}:00`

    const roundTime = document.querySelector("#round_duration")
    const rest = document.querySelector("#rest")

    roundTime.innerHTML = `Round Duration: ${exercises.Workout.round_duration} seconds`
    rest.innerHTML = `Rest: ${exercises.Workout.rest_duration} seconds`
}