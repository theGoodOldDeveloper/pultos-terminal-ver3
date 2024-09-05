/* INFO: async await function */
/* async function dataread() {
    var dataset = await fetch("/dataread");
} */
const state = {
    persons: [],
};
console.log("dataread is ok ............");
/* NOTE: */
async function fetchAndRenderPersons() {
    const response = await fetch("/dataread");
    document.getElementById("personsData").innerHTML = "";
    let persons;
    state.persons = await response.json();
    renderPersons();
}
function renderPersons() {
    let personsHTML = "";
    for (const person of state.persons) {
        personsHTML += `
    <tr>
    <td>${person.userName}</td>
    <td>${person.email}</td>
    <td>${person.message}</td>
    <td>${person.history}</td>
    </tr>
    `;
    }
    document.getElementById("personsData").innerHTML = personsHTML;
}
