console.log("todo is OK");
const datum = new Date();
var todoList = [];
const state = {
    otherList: [],
};
var todoListDayName = [
    "VASÁRNAP",
    "HÉTFŐ",
    "KEDD",
    "SZERDA",
    "CSÜTÖRTÖK",
    "PÉNTEK",
    "SZOMBAT",
];
var todoDataHTML = "";
var otherDataHTML = "";
var arrayDayData = "";
var arrayDayNumber = -1;
var newData = [];
console.log("nap szama");
console.log(datum.getDay()); // 0 - vasarnap

getdata();

async function getdata() {
    /* NOTE: get todolist */
    var response = await fetch("/todolist");
    todoList = await response.json();
    /* NOTE: get other */
    var response = await fetch("/otherdata");
    state.otherList = await response.json();
    renderTodo();
}

function renderTodo() {
    todoDataHTML = "";
    todoDataHTML += `<tr>
    <td>${todoList[1]}</td>
    <td>${todoList[2]}</td>
    <td>${todoList[3]}</td>
    <td>${todoList[4]}</td>
    <td>${todoList[5]}</td>
    <td>${todoList[6]}</td>
    <td>${todoList[0]}</td>
  </tr>`;
    document.getElementById("todoData").innerHTML = todoDataHTML;
    //otherDataHTML = '<tr>'
    let counterDiferent = 0
    for (index = 0; index < 5; index++) {
        counterDiferent = index < 4 ? parseInt(state.otherList[index].dataValue) - parseInt(state.otherList[index + 5].dataValue) : 0
        otherDataHTML += `<tr>
        <td>${state.otherList[index].dataType} </td>
        <td>${state.otherList[index].dataValue} </td>
        <td>${state.otherList[index + 5].dataValue} </td>
        <td>${counterDiferent} </td>
        </tr>`
    }

    /* for (list of state.otherList) {
        otherDataHTML += `<tr><td>${list.dataType} </td>
        <td>${list.dataValue} </td></tr>`
    } */
    //otherDataHTML += '</tr>'
    document.getElementById("otherData").innerHTML = otherDataHTML;

}

$(".zizi").click(function () {
    console.log("klikkkeltem");
    console.log(this.id);
    console.log(todoListDayName[this.id]);
    arrayDayNumber = this.id;
    $("#myModal").modal();
});

function newTodoDayData() {
    arrayDayData = document.getElementById("todoDayData").value;
    document.getElementById("todoDayData").value = "";
    console.log("arrayDayData");
    console.log(arrayDayData);
    console.log("arrayDayNumber");
    console.log(arrayDayNumber);
    todoList[arrayDayNumber] = arrayDayData;

    todoListTarol(todoList);

    renderTodo();
}

function todoListTarol(todoList) {
    for (let index = 0; index < 7; index++) {
        newData.push(todoList[index]);
    }
    console.log("newData uj adat");
    console.log(newData);
    updateTodoList(newData);

    async function updateTodoList(newData) {
        console.log("newData");
        console.log(newData);
        await fetch("/updatetodolist", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ data: newData }),
        });
        window.location.href = "http://localhost:7766/todo";
    }
}
/* async function updateTodoList(data) {
    await fetch("/updatetodolist", {
        method: "POST",
        headers: {
            "Content-type": "application/text",
        },
        body: { data: data },
    });
} */
//alert("Tesztelés alatt!!! 😊");
//window.location.href = "http://localhost:7766";
//window.location.href = "http://photovegh.synology.me:7766/";
