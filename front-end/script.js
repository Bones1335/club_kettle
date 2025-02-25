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
    let jsonData = JSON.stringify(formData);
    
    async function sendData(data) {
        let url = URL + "api/users"
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: data
            })

            const json = await response.json()
            console.log(json)
            let jsonOutput = document.getElementById("jsonOutput");
            jsonOutput.innerHTML = "<pre>" + json.last_name + "</pre>";
        }
        catch (error) {
            console.error('Error:', error)
        }
   }

   sendData(jsonData);
}

function mySubmitFunction(e) {
    e.preventDefault();
    return false
}