//###############################################
//############### this is FRONEND ###############
//###############################################

const personGet = () => {
    window.onload = fetchAndRenderPersons();
};

/* ####### FRONTEND SEND POST REQUEST */
async function sendMongoDB() {
    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;
    const message = document.getElementById("message").value;
    await fetch("/person", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            userName: userName,
            email: email,
            age: age,
            message: message,
        }),
    });
    fetchAndRenderPersons();
}
/* ####### FRONTEND SEND get REQUEST INFO: START INFO:*/
const state = {
    persons: [],
};
/* ####### FRONTEND SEND get REQUEST  INFO: */
async function getMongoDB() {
    const response = await fetch("/dataread2");
    document.getElementById("ucso").innerHTML = "";
    state.persons = await response.json();
    renderPersons();
}

/* ####### RENDER HTML VIEW TABLE */
function renderPersons() {
    let personsHTML = "";
    for (const person of state.persons) {
        personsHTML += `
    <tr>
    <td>${person.userName}</td>
    <td>${person.email}</td>
    <td>${person.age}</td>
    <td>${person.message}</td>
    </tr>
    `;
    }
    document.getElementById("personsData").innerHTML = personsHTML;
}
/* ####### FRONTEND SEND get REQUEST INFO: END INFO:*/

/* ####### RENDER HTML VIEW */
async function fetchAndRenderPersons() {
    const response = await fetch("/person");
    document.getElementById("personsData").innerHTML = "";
    state.persons = await response.json();
    renderPersons();
}
/* ####### RETURN TO SITE... */
/*
function veghSoft() {
    console.log("OK");
    window.location = "http://www.veghsoft.eu";
} */
