const URL = "http://localhost:8080/"

function convertToJson() {
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

async function sendData(jsonData) {
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
        console.log(json)
        let jsonOutput = document.getElementById("jsonOutput");
        jsonOutput.innerHTML = `<pre>${json.last_name}, ${json.first_name}, ${json.id}, ${json.email}, ${json.username} </pre>`;
    }
    catch (error) {
        console.error('Error:', error)
    }
}

function submitFormData() {
    JSONData = convertToJson();
    sendData(JSONData)
}

function mySubmitFunction(e) {
    e.preventDefault();
}

async function getUsers() {
    let url = URL + "/api/users"
    const response = await fetch(url);
    const users = await response.json();
    document.getElementById('output').textContent = JSON.stringify(users, null, 2);
}

let exerciseFormCount = 0;

function addExerciseForm() {
    exerciseFormCount++;

    const formContainer = document.createElement("div");
    formContainer.id = `exercise-${exerciseFormCount}`;

    formContainer.innerHTML = `        
     <form onsubmit="mySubmitFunction(event)" method="post">
        <label for="name-${exerciseFormCount}">Exercise Name:</label>
        <input type="text" name="name" id="name-${exerciseFormCount}">

        <label for="tool-${exerciseFormCount}">Exercise Tool:</label>
        <input type="text" name="tool" id="tool-${exerciseFormCount}">

        <label for="username-${exerciseFormCount}">User Who Created Exercise:</label>
        <input type="text" name="username" id="username-${exerciseFormCount}">

        <button type="submit" onclick="submitFormData()">Submit</button>
        
    </form>
    `;

    document.getElementById('exercises').appendChild(formContainer);
}
