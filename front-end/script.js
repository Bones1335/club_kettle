const URL = "http://localhost:8080/"

// DOM elements
const contentElement = document.getElementById("content");
const login = document.getElementById("Users");
const profile = document.getElementById("Profile");
const exercises = document.getElementById("Exercises");
const workoutRoutines = document.getElementById("WorkoutRoutines");
const workouts = document.getElementById("Workouts");
const workoutSummaries = document.getElementById("WorkoutSummaries");

// Navigation Elements
const navProfile = document.getElementById("nav-profile");
const navExercises = document.getElementById("nav-exercises");
const navWorkouts = document.getElementById("nav-workouts");
const navSummaries = document.getElementById("nav-summaries");



// State
let currentView = "login";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');

    if (token) {
        currentView = "workouts";
        login.style.display = "none";
        renderWorkouts();
    } else {
        currentView = "login";
        login.style.display = "block";
        profile.style.display = "none";
        exercises.style.display = "none";
        workoutRoutines.style.display = "none";
        workouts.style.display = "none";
        workoutSummaries.style.display = "none";
    }
});

// Login + Logout 
function convertLoginToJson() {
    let form = document.getElementById("login");
    let formData = {};
    for (let i = 0; i < form.elements.length; i++) {
        let element = form.elements[i];
        if (element.type !== "submit") {
            formData[element.name] = element.value;
        }
    }
    return JSON.stringify(formData);
}

async function sendLoginData(jsonData) {
    let url = URL + "api/login"
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: jsonData,
        });

        const json = await response.json()
        if (json.token) {
            localStorage.setItem("token", json.token);
            let jsonOutput = document.getElementById("login-container");
            jsonOutput.innerHTML = `<h4>${json.username} logged in</h4>`;
            renderWorkouts();
        } else {
            alert("Login failed")
        }

    }
    catch (error) {
        console.error('Error:', error)
    }   
}

function clearLoginFormFields() {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

function submitLoginFormData() {
    const JSONData = convertLoginToJson();
    sendLoginData(JSONData)
    clearLoginFormFields();
}

function logout() {
    localStorage.removeItem("token");
    document.getElementById("Users").style.display = "block";
    currentView = "login";
    exercises.style.display = "none";
    workoutRoutines.style.display = "none";
    workouts.style.display = "none";
}

// Users

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

        await response.json()
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

// Exercises

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
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: jsonData,
        });

        await response.json()

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

// Workouts

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

        await response.json()
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

function convertCompletedWorkoutToJson() {
    const form = document.getElementById("workoutData");

    const summary = {
        workout_routine_id: form.elements["workoutName"].value,
        weight_in_kg: parseInt(form.weight.value),
        workout_number: parseInt(form.workoutNumber.value),
        date: new Date(form.date.value).toISOString(),
    };

    const rounds = [];
    let table = document.getElementById("workoutTableData")
    for (let i = 1; i < table.rows.length; i++) {
        let row = table.rows[i]
        for (let j = 0; j < row.cells.length - 1; j++) {
            rounds.push({
                date: new Date(form.date.value).toISOString(),
                round_number: j+1,
                reps_completed: parseInt(form.elements[`ex${i}rd${j+1}`]?.value),
                workout_exercise_id: row.cells[0].value,
            });
        };
    }

    const formData = {
        workout_summary: summary,
        rounds: rounds
    }

    return JSON.stringify(formData);
}

async function sendCompletedWorkoutData(jsonData) {
    let url = URL + "api/workout_summaries"
    try {
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: jsonData,
        });

        await response.json()
    }
    catch (error) {
        console.error('Error:', error)
    }
}

function clearCompletedWorkoutFormFields() {
    const form = document.getElementById("workoutData");
    const inputs = form.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i]
        input.value = "";
    }
}

function submitWorkoutData() {
    const jsonData = convertCompletedWorkoutToJson();
    clearCompletedWorkoutFormFields();
    sendCompletedWorkoutData(jsonData);
}

// Workout Summaries

async function fetchWorkoutSummaries() {
    try {
        const response = await fetch(`${URL}api/workout_summaries`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
        });
        const summaries = await response.json();

        if (!summaries || summaries.length === 0) {
            console.warn("No workout summaries found");
            return;
        } 

        return summaries;
    } catch (error) {
        console.error("Error fetching workout summaries:", error);
    }
}

// Render Pages

async function fetchUser() {
    const response = await fetch(`${URL}api/users/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    });
    const user = await response.json();

    if (!user) {
        console.warn("not logged in")
        return;
    }

    return user;
}

async function renderProfile() {
    login.style.display = "none";
    exercises.style.display = "none";
    workoutRoutines.style.display = "none";
    workouts.style.display = "none";
    workoutSummaries.style.display = "none";
    profile.style.display = "block";
    try {
        const user = await fetchUser();
        let html = `
        <div id="userProfile">
            <h2>${user.username}'s Profile</h2>
            <ul>
                <li>Last Name: ${user.last_name}</li>
                <li>First Name: ${user.first_name}</li>
                <li>Email: ${user.email}</li>
            </ul>
        </div>
        `
        profile.innerHTML = html;
    } catch (error) {
        profile.innerHTML = `<div class="error">Error loading workout summaries: ${error.message}</div>`;
    }
}

function renderExercises() {
    login.style.display = "none";
    profile.style.display = "none";
    workouts.style.display = "none";
    workoutRoutines.style.display = "none";
    workoutSummaries.style.display = "none";
    exercises.style.display = "block";
}

function renderWorkouts() {
    login.style.display = "none";
    profile.style.display = "none";
    exercises.style.display = "none";
    workoutSummaries.style.display = "none";
    workoutRoutines.style.display = "block";
    workouts.style.display = "block";
}

async function renderSummaries() {
    login.style.display = "none";
    profile.style.display = "none";
    exercises.style.display = "none";
    workoutRoutines.style.display = "none";
    workouts.style.display = "none";
    workoutSummaries.style.display = "block";
    try {
        const summaries = await fetchWorkoutSummaries();
        let html = `
        <div id="workoutSummaries">
            <h2>Workout Summaires</h2>
            <div id="summaryList">
        `
        if (summaries.length === 0) {
            html += "<p>No workout summarires found</p>"
        } else {
            html += "<ul>"
            const summaryItems = await Promise.all(summaries.map(async (summary) => {
                const response = await fetch(`${URL}api/workouts/${summary.workout_routine_id}`);
                const routine = await response.json();
                html += `
                    <li class="summaryItem" data-id="${summary.id}">
                        <h3>${routine.Workout.name} - ${new Date(summary.date).toLocaleDateString("en-CA")}</h3>
                        <button class="viewSummary" data-id="${summary.id}">View Details</button>
                        <button class="deleteSummary" data-id="${summary.id}">Delete</button>
                    </li>
                `;
            }));
            html += summaryItems.join("");
            html += "</ul>";
        }
        html += "</div>";
        workoutSummaries.innerHTML = html;
    } catch (error) {
        workoutSummaries.innerHTML = `<div class="error">Error loading workout summaries: ${error.message}</div>`;
    }
}

// Navigation
navProfile.addEventListener("click", (e) => {
    e.preventDefault();
    currentView = "profile";
    renderProfile();
});

navExercises.addEventListener("click", (e) => {
    e.preventDefault();
    currentView = "exercises";
    renderExercises();
});

navWorkouts.addEventListener("click", (e) => {
    e.preventDefault();
    currentView = "workouts";
    renderWorkouts();
});

navSummaries.addEventListener("click", (e) => {
    e.preventDefault();
    currentView = "summaries";
    renderSummaries();
});
