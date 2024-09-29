const datum = new Date();
var todoList = [];
const state = {
  otherList: [],
  hordoCsere: [],
  csapoltTermekek: [],
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
//console.log(datum.getDay()); // 0 - vasarnap

getdata();
//fetchCounters();
async function getdata() {
  /* NOTE: get todolist */
  var response = await fetch("/todolist");
  todoList = await response.json();
  /* NOTE: get other */
  var response = await fetch("/api/counters");
  state.otherList = await response.json();
  var response = await fetch("/api/hordocsere");
  let hordoCsereData = await response.json();
  state.hordoCsere = hordoCsereData.map((item) => ({
    ...item,
    trdate: new Date(item.trdate),
  }));

  //console.log("hordócsere: ", state.hordoCsere);
  //BUG
  var response = await fetch("/api/csapolttermekek");
  let csapoltTermekekData = await response.json();
  state.csapoltTermekek = csapoltTermekekData.map((item) => {
    //console.log("Raw eladottdate:", item.eladottdate);
    const parsedDate = parseHungarianDate(item.eladottdate);
    //console.log("Parsed eladottdate:", parsedDate);
    return {
      ...item,
      eladottdate: parsedDate,
    };
  });
  //  console.log("csapoltTermekek:", state.csapoltTermekek);

  renderTodo();
  //BUG
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
  //hordócsere
  // BUG... existing code ...

  // Rendezzük a hordócsere adatokat dátum szerint növekvő sorrendbe
  state.hordoCsere.sort((a, b) => a.trdate - b.trdate);

  let hordoCsereHTML = `
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Hcsere Id</th>
          <th>Dátum</th>
          <th>Összesen liter</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < state.hordoCsere.length; i++) {
    let startDate = state.hordoCsere[i].trdate;
    let endDate =
      i < state.hordoCsere.length - 1
        ? state.hordoCsere[i + 1].trdate
        : new Date();

    /* console.log(
      `Calculating for period: ${startDate.toISOString()} to ${endDate.toISOString()}`
    ); */
    let totalLiters = calculateTotalLiters(startDate, endDate);
    //console.log(`Total liters for this period: ${totalLiters}`);

    hordoCsereHTML += `
      <tr>
        <td>${state.hordoCsere[i].id}</td>
        <td>${startDate.toLocaleString("hu-HU")}</td>
        <td>${totalLiters.toFixed(2)}</td>
      </tr>
    `;
  }

  hordoCsereHTML += `
      </tbody>
    </table>
  `;

  document.getElementById("sorosHordoData").innerHTML = hordoCsereHTML;

  //BUG ... rest of the function ...
  //otherDataHTML = '<tr>'
  let counterDiferent = 0;

  for (list of state.otherList) {
    const date = new Date(list.date);
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    otherDataHTML += `<tr><td>${list.type} </td>
        <td>${list.count} </td>
        <td>${formattedDate} </td></tr>`;
  }
  otherDataHTML += "</tr>";
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

function fetchCounters() {
  fetch("/api/counters")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hálózati hiba történt");
      }

      return response;
    })
    .then((data) => {
      /* createCounterButtons(data); */
    })
    .catch((error) => {
      console.error("Hiba:", error);
      counterButtons.innerHTML =
        "<p>Hiba történt az adatok betöltésekor. Kérjük, frissítse az oldalt.</p>";
    });
}

function createCounterButtons(counters) {
  counterButtons.innerHTML = "";
  if (Array.isArray(counters)) {
    counters.forEach((counter) => {
      const button = document.createElement("button");
      button.textContent = `${typeNames[counter.type] || counter.type}: ${
        counter.count
      }`;
      button.className = "btn btn-primary m-2 ";

      if (counter.type === "SÖR") {
        button.classList.add("btn-danger");
        button.addEventListener("click", () => handleSorButton(counter));
      } else {
        button.addEventListener("click", () => openCounterModal(counter));
      }

      counterButtons.appendChild(button);
    });
  } else {
    console.error("A szervertől kapott adatok nem tömb formátumúak:", counters);
  }
}

function calculateTotalLiters(startDate, endDate) {
  /*  console.log(
    `Calculating total liters from ${startDate.toISOString()} to ${endDate.toISOString()}`
  ); */
  //console.log(`Number of csapoltTermekek: ${state.csapoltTermekek.length}`);

  return state.csapoltTermekek.reduce((total, termek) => {
    if (
      termek.eladottdate &&
      termek.eladottdate >= startDate &&
      termek.eladottdate < endDate
    ) {
      //console.log(`Found matching termek: `, termek);
      switch (termek.termekid) {
        case 1:
          return total + 0.5 * termek.db;
        case 2:
          return total + 0.3 * termek.db;
        case 3:
          return total + 0.2 * termek.db;
        default:
          return total;
      }
    }
    return total;
  }, 0);
}

function parseHungarianDate(dateString) {
  if (!dateString) {
    console.log("Empty date string");
    return null;
  }
  try {
    //console.log("Parsing date string:", dateString);
    const [datePart, timePart] = dateString.split(" ").slice(-2);
    //console.log("Date part:", datePart, "Time part:", timePart);
    const [year, month, day] = dateString.split(". ").slice(0, 3).map(Number);
    //console.log("Year:", year, "Month:", month, "Day:", day);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    //console.log("Hours:", hours, "Minutes:", minutes, "Seconds:", seconds);
    const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);
    //console.log("Parsed date:", parsedDate);
    return parsedDate;
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return null;
  }
}
