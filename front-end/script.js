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
    let JSONData = convertUserToJson();
    sendUserData(JSONData)
    clearUserFormFields();
}

function mySubmitFunction(e) {
    e.preventDefault();
}

/*async function getUsers() {
    let url = URL + "/api/users"
    const response = await fetch(url);
    const users = await response.json();
    document.getElementById('output').textContent = JSON.stringify(users, null, 2);
}
*/

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
    }
    catch (error) {
        console.error('Error:', error)
    }
}

function clearExerciseFromFields() {
    document.getElementById('name').value = '';
    document.getElementById('tool').value = '';
    document.getElementById('user_id').value = '';
}

function submitExerciseFormData() {
    let jsonData = convertExerciseToJson();
    sendExerciseData(jsonData);
    clearExerciseFromFields();
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
