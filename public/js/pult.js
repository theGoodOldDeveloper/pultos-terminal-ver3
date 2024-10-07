/* eslint-disable no-empty */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
  //window.close()
  $("#hideFullScreen").hide();
}

var oraPercFull = new Date();
var oraPerc = `(${oraPercFull.getHours()}-${oraPercFull.getMinutes()})`;
var querykp2 = -1;
let temp = [];
let tempWeek = ["", "", "", "", "", "", ""];
if (localStorage.getItem("todolist")) {
} else {
  localStorage.setItem("todolist", JSON.stringify(tempWeek));
  console.log("NEM letezik");
}
const dayOfWeek = [
  "VASÁRNAP",
  "HÉTFŐ",
  "KEDD",
  "SZERDA",
  "CSÜTÖRTÖK",
  "PÉNTEK",
  "SZOMBAT",
];
var isPultItem = false;
const vissza = localStorage.getItem("adminLocal");
var trNumberDatum = new Date();
const keyboardTemplateHTML = KeyboardModule.keyboardTemplateRender();
var datum = new Date().toLocaleString();
const userLocalName = localStorage.getItem("user");
const userLocalCode = localStorage.getItem("pultos");
const xkimeresnevid = -7;
var betetdij = 0;
saldoTarget();
document.getElementById("localStorageName").innerHTML = userLocalName;

localStorage.setItem("saldoRuning", false);

var saldo = 0;
var saldoComplete = -1;
var timerId;
if (
  localStorage.getItem("saldoRuning") == "false" &&
  parseInt(localStorage.getItem("saldoRuningDay")) != new Date().getDate()
) {
  saldoTarget();
  saldoMessage();
}

var kosarNevPultosKodSQL = -1;
var kosarNevDatumSQL = "";
var kosarNevIdSQL = -1;
var kosarMegnevezesSQL = "";
var trNumber = "";
var pultos = userLocalCode;
var lastTransactionId = -1;
var trFizetesMod = "";
var megjegyzes = "";
var kivetMegnevezes = "";
var osszegKivet = "";
var osszeg = -1;
var mindosszesenTransaction = -1;
var mindosszesenTransactionBeszar = -1;
var mindosszesenTransactionBetDij = -1;
var fizetoHitelesId = -1;
var fizetoHitelesMegjegyzes = "";
var fizetoHitelesIndex = -1;

var errorLog = "unknown";

var visiblesequenceIndex = -1;
var oldTodolist = JSON.parse(localStorage.getItem("todolist"));
var weekNumber = trNumberDatum.getDay();

var productItem = 0;
const tabSor = 8;
const tabOszlop = 6;
const widthBTN = 8;
const heightBTN = 3.75;
var createTabsHTML = "";
var createContentHTML = "";
const btnBgColor = [
  "primary text-body",
  "secondary text-body",
  "success text-body",
  "warning",
  "danger",
  "dark",
  "light",
];

createTrNumber();
var aBeszar = [];
var aNev = [];
var aKeszletsum = [];
var tBeszar = [];

//NOTE: sound generator
document.addEventListener("click", function (event) {
  if (event.target.tagName.toLowerCase() === "button") {
    // Itt játszuk le a hangot, ha a kattintott elem egy gomb
    const sound = new Audio("/click.mp3");
    sound.play();
  }
});
const oldKosar = true;
const state = {
  termekek: [],
  pult: [],
  kosarak: [],
  kosarNevek: [],
  kosarNevekOnly: [],
  fullTransactionsHitel: [],
  osszetevok: [],
  alapanyagok: [],
  tempKosarak: [],
  tempKosarNevek: [],
  todolist: [],
};
let oldKosarNevek = [];
let oldKosarak = [];
let aktualKosarNevThisIdGlobal = -1;
let aktualKosarThisIdGlobal = [];
let oldKosarModify = -1;
getKosarak();

var productsHTML = "";
var foundPult = false;
var foundKosar = false;
var kosarbolVisszatoltott = false;
var cantBeZeroValue = false;
var kosarbolVisszatoltottId = -1;
var kosarMegnevezes = "";

getdata();

async function getdata() {
  /* NOTE: get gettransactionshitel */
  var id = "h";
  var response = await fetch(`/gettransactionshitel/${id}`);
  state.fullTransactionsHitel = await response.json();

  /* NOTE: get datareadalapanyagok HACK:HACK: */
  var response = await fetch("/datareadalapanyagok");
  state.alapanyagok = await response.json();
  for (alapanyag of state.alapanyagok) {
    aBeszar[alapanyag.id] = alapanyag.beszar / alapanyag.kiszereles;
    aNev[alapanyag.id] = alapanyag.nev;
    aKeszletsum[alapanyag.id] = alapanyag.keszletsum;
  }

  /* NOTE: get datareadosszetevok INFO: INFO: INFO:*/
  var response = await fetch("/datareadosszetevok");
  state.osszetevok = await response.json();
  for (osszetevo of state.osszetevok) {
    if (tBeszar[osszetevo.termek_id]) {
      tBeszar[osszetevo.termek_id] +=
        osszetevo.felhasznaltmennyiseg * aBeszar[osszetevo.alapanyag_id];
    } else {
      tBeszar[osszetevo.termek_id] =
        osszetevo.felhasznaltmennyiseg * aBeszar[osszetevo.alapanyag_id];
    }
  }

  /* NOTE: get datareadtermekek */
  var response = await fetch("/datareadtermekek");
  state.termekek = await response.json();

  /* NOTE: get todolist */
  var response = await fetch("/todolist");
  state.todolist = await response.json();

  if (state.todolist[weekNumber] != oldTodolist[weekNumber]) {
    let messageHead = dayOfWeek[weekNumber];
    let message = state.todolist[weekNumber];
    alertDialog(messageHead, message);

    oldTodolist[weekNumber] = state.todolist[weekNumber];
    localStorage.setItem("todolist", JSON.stringify(oldTodolist));
  }
  let index = 1;
  for (termek of state.termekek) {
    termek.visiblesequence = index;
    index++;
  }
  renderProducts();

  /* NOTE: A button click funkciójának figyelése */
  $(document).ready(function () {
    let arrayIndex = -1;
    let eladottElar = -1;
    let sorokNev;
    let kosarUjsorIndex = -1;
    localStorage.setItem("eladottElar", eladottElar);
    let tempEmilsend = -1;
    $(".termekButton").click(function (e) {
      visiblesequenceIndex = e.target.dataset.visiblesequence - 1;
      arrayIndex = visiblesequenceIndex;
      var edb = 1;
      eladottElar = state.termekek[arrayIndex].elar;
      sorokNev = state.termekek[arrayIndex].nev;
      sorokId = state.termekek[arrayIndex].id;
      //console.log("arrayIndex", arrayIndex);
      //console.log("state.pult", state.pult);
      sorokEladottBeszar = tBeszar[sorokId];
      sorokEladottElar = state.termekek[arrayIndex].elar;
      datum = theTime();
      let _pultTombIndex = 0;
      isPultItem = false;
      for (pultItem of state.pult) {
        if (sorokId == pultItem.termekId) {
          state.pult[_pultTombIndex].db++;
          isPultItem = true;
        }
        _pultTombIndex++;
      }

      if (isPultItem == false) {
        state.pult.push({
          id: sorokId,
          nev: sorokNev,
          db: edb,
          eladottbeszar: sorokEladottBeszar,
          eladottelar: sorokEladottElar,
          fizetesmod: "c",
          transactionnumber: arrayIndex,
          megjegyzes: "info",
          datum: datum,
          termekId: sorokId,
        });
      }
      isPultItem = false;
      kosarUjsorIndex = state.pult.length - 1;
      termekKeszletModositas(state.pult[kosarUjsorIndex], "minus");
      renderPult();
    });
  });
}

function renderProducts() {
  productItem = state.termekek.length;
  var allTabs = parseInt(productItem / (tabSor * tabOszlop));
  renderPultFirst();
  $(document).ready(function () {
    $(".nav-tabs a").click(function () {
      $(this).tab("show");
    });
  });
  function renderPultFirst() {
    var contentIndex = 0;
    var actualContentIndex = 0;
    for (let tabIndex = 0; tabIndex <= allTabs; tabIndex++) {
      createTabsHTML += `<li class="nav-item">
            <a class="nav-link font-weight-bolder border border-dark p-1 ${
              tabIndex == 0 ? "active" : ""
            }" href="#menu${tabIndex} " style="font-size: 135%"><kbd>- ${
        tabIndex + 1
      } -</kbd></a>
        </li>`;
    }
    document.getElementById("createTabs").innerHTML = createTabsHTML;
    for (let tabIndex = 0; tabIndex <= allTabs; tabIndex++) {
      createContentHTML += `<div id="menu${tabIndex}" class="container  tab-pane ${
        tabIndex == 0 ? "active" : "fade"
      }">
    `;
      contentIndex < productItem - tabSor * tabOszlop
        ? (actualContentIndex = tabSor * tabOszlop)
        : (actualContentIndex = productItem - contentIndex);
      for (let index = 0; index < actualContentIndex; index++) {
        createContentHTML += `<button type="button" class=" m-1 p-1 font-weight-bold btn btn-${
          btnBgColor[state.termekek[contentIndex + index].btncolor]
        } termekButton" style="width: ${widthBTN}em; height: ${heightBTN}em; font-size: 100%" id = ${
          state.termekek[contentIndex + index].id
        }
                data-visiblesequence = ${
                  state.termekek[contentIndex + index].visiblesequence
                }
                >${state.termekek[contentIndex + index].nev} </button>`;
      }
      contentIndex = contentIndex + tabSor * tabOszlop;
      createContentHTML += `</div>`;
    }
    document.getElementById("createContent").innerHTML = createContentHTML;
  }
}
function renderPultFromDatabases(aktualKosarNev, aktualKosarak) {
  kosarbolVisszatoltott = true;
  kosarNevPultosKodSQL = aktualKosarNev.kosarMegnevezesPultosKod;
  kosarNevIdSQL = aktualKosarNev.thisId;
  kosarMegnevezesSQL = aktualKosarNev.kosarMegnevezes;
  kosarNevDatumSQL = aktualKosarak[0].datum;
  aktualKosarak.forEach((kosar) => {
    state.pult.push({
      aId: kosar.aId,
      cl: kosar.cl,
      datum: kosar.datum,
      db: kosar.db,
      eladottbeszar: kosar.eladottbeszar,
      eladottelar: kosar.eladottelar,
      fizetesmod: kosar.fizetesmod,
      id: kosar.id,
      kosarMegnevezes: kosar.kosarMegnevezes,
      megjegyzes: kosar.megjegyzes,
      nev: kosar.nev,
      sumcl: kosar.sumcl,
      transactionnumber: kosar.transactionnumber,
      termekId: kosar.termekId,
    });
  });
}
/* TODO:TODO:TODO: RENDERPULT TODO:TODO:TODO: */
function renderPult(aktualKosarNev, aktualKosarak) {
  if (aktualKosarNev) {
    aktualKosarNevThisIdGlobal = aktualKosarNev.thisId;
  }
  aktualKosarNevThisId = aktualKosarNev
    ? aktualKosarNev.thisId
    : (let = temporary = "none"); //console.log("newState: 💖💖💖💖💖💖💖💖💖💖💖💖💖💖💖");
  aktualKosarNev ? (dataFirst = aktualKosarNev) : (dataFirst = "hmmm...");

  aktualKosarak
    ? renderPultFromDatabases(aktualKosarNev, aktualKosarak)
    : (let = temporary = "none"); //console.log("aktualKosarak: 😎😎😎  - nincs");

  if (aktualKosarak) {
    aktualKosarak.forEach((kosar) => {
      aktualKosarThisIdGlobal.push(kosar.thisId);
    });
  }
  if (aktualKosarak) {
    oldKosarModify = aktualKosarak.length;
  }
  var tetelSorokHTML = "";
  var mindosszesen = 0;
  var mindosszesenBeszar = 0;
  var tombIndex = 0;
  let betdijText = "";
  let betdij = 0;
  var mindosszesenBetdij = 0;

  for (var sorok of state.pult) {
    if (
      (state.alapanyagok?.[sorok.aId - 1]?.emailsend ?? false) ||
      (state.termekek?.[sorok.transactionnumber]?.emailsend ?? false)
    ) {
      betdij = sorok.db * betetdij;
      betdijText = `<h4>Betétdíj összege: <span class="font-weight-bold">${betdij}</span> Ft</h4>`;
    } else {
      betdij = 0;
      betdijText = "";
    }
    /*if (
      state.alapanyagok[sorok.aId - 1].emailsend ||
      state.termekek[sorok.transactionnumber].emailsend
    ) {
      betdij = sorok.db * betetdij;
      betdijText = `<h4>Betétdíj összege: <span class="font-weight-bold">${betdij}</span> Ft</h4>`;
    }*/

    tetelSorokHTML += `
        <div class="card">
        <div class="font-weight-bold d-flex justify-content-between" style=" padding-right: 3em">
            <h4>
                ${sorok.nev}: </h4>
            <h4 style:"font-size: 155%">${sorok.eladottelar.toLocaleString(
              "hu-HU",
              { maximumFractionDigits: 0 }
            )}</h4>
        </div>
    <div class="d-flex justify-content-between">
        <div >
            <h3><button class="btn mr-4 btn-danger delete-db" id = ${tombIndex}>X</button>   <button class="btn mr-2 btn-warning remove-db" id = ${tombIndex}>-</button>  <span  > ${
      sorok.db
    } </span>   <button class="btn ml-2 btn-success insert-db" id = ${tombIndex}>+</button> </h3>
        </div>
        <h3 class="font-weight-bold">${(
          sorok.eladottelar * sorok.db
        ).toLocaleString("hu-HU", {
          maximumFractionDigits: 0,
        })}</h3>
    </div>
    ${betdijText}
        </div>
        <h6 <hr color="#ff0000"></h6>
`;
    tombIndex++;
    mindosszesen += sorok.eladottelar * sorok.db + betdij;
    mindosszesenBeszar += sorok.eladottbeszar * sorok.db;
    mindosszesenBetdij += betdij;
    betdijText = "";
    betdij = 0;
  }

  document.getElementById("pult").innerHTML = tetelSorokHTML;
  document.getElementById("summa").innerHTML = mindosszesen.toLocaleString(
    "hu-HU",
    { style: "currency", currency: "huf", maximumFractionDigits: 0 }
  );
  mindosszesenTransaction = mindosszesen;
  mindosszesenTransactionBeszar = mindosszesenBeszar;
  mindosszesenTransactionBetDij = mindosszesenBetdij;
  $(".insert-db").click(function (event) {
    //HACK:HACK:HACK:HACK:HACK:
    let pultTombIndex = this.id;
    state.pult[pultTombIndex].db++;
    termekKeszletModositas(state.pult[pultTombIndex], "minus");
    renderPult();
    //HACK:HACK:HACK:HACK:HACK:
  });
  $(".remove-db").click(function (event) {
    let pultTombIndex = this.id;
    if (
      state.pult[pultTombIndex].db == 1 &&
      kosarbolVisszatoltott &&
      this.id < oldKosarModify
    ) {
      alert(
        "Mivel ez egy kosárból visszatoltott termék és, ezért nem lehetet 0 a darabszám!"
      );
    } else {
      state.pult[pultTombIndex].db--;
      termekKeszletModositas(state.pult[pultTombIndex], "plus");
      renderPult();
    }
  });
  $(".delete-db").click(function (event) {
    if (kosarbolVisszatoltott && this.id < oldKosarModify) {
      alert(
        `Mivel ez egy kosárból visszatoltott termék, ezért nem lehet törölni!`
      );
    } else {
      let pultTombIndex = this.id;
      termekKeszletModositas(state.pult[pultTombIndex], "reset");
      state.pult.splice(pultTombIndex, 1);
      renderPult();
    }
  });
  foundPult = tetelSorokHTML == "" ? false : true;
}

function termekKeszletModositas(sendData, muvelet) {
  //console.log("sendData, muvelet", sendData, muvelet);
  for (osszetevo of state.osszetevok) {
    //HACK - termekId
    if (osszetevo.termek_id == sendData.termekId) {
      //HACK
      sendData.aId = osszetevo.alapanyag_id; //HACK:
      sendData.sumcl =
        Math.round(aKeszletsum[osszetevo.alapanyag_id] * 100) / 100; //HACK:
      sendData.cl = osszetevo.felhasznaltmennyiseg; //HACK:

      if (muvelet == "minus") {
        sendData.sumcl -= sendData.cl;
        sendData.cl = sendData.cl * -1;
        aKeszletsum[osszetevo.alapanyag_id] = sendData.sumcl;
      }
      if (muvelet == "plus") {
        sendData.sumcl += sendData.cl;
        aKeszletsum[osszetevo.alapanyag_id] = sendData.sumcl;
        // eslint-disable-next-line no-self-assign
        sendData.cl = sendData.cl;
      }
      if (muvelet == "reset") {
        sendData.cl = sendData.cl * sendData.db;
        sendData.sumcl += sendData.cl * sendData.db;
        aKeszletsum[osszetevo.alapanyag_id] = sendData.sumcl;
      }
      tarolj(sendData.aId, sendData.sumcl, sendData.cl, sendData.db);
      //console.log("sendData.aId", sendData.aId);
      //console.log("sendData.sumcl", sendData.sumcl);
      //console.log("sendData.cl", sendData.cl);
      //console.log("sendData.db", sendData.db);
    }
  }
}

/* TODO:TODO:TODO: TAROLJ TODO:TODO:TODO: */
function tarolj(id, sumcl, cl, db) {
  sumcl = Math.round(sumcl * 100) / 100;
  try {
    updateMySQL();
  } catch (e) {}
  async function updateMySQL() {
    const response = await fetch("/keszletmodositas/", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ id: id, sumcl: sumcl, cl: cl, db: db }),
    });
  }
}

/* TODO:TODO:TODO: UJ KOSARBA TESSZUK TODO:TODO:TODO: */
function naTegyukEgyUjKosarba() {
  if (foundPult) {
    if (kosarbolVisszatoltott) {
      let tempKosarMegnevezes = state.pult[0].kosarMegnevezes;
      let index = 0;
      for (pult of state.pult) {
        if (!pult.kosarMegnevezes) {
          index++;
          pusingDatatoState(index);
        }
        index++;
      }
      function pusingDatatoState(index) {
        state.kosarak.push({
          aId: 0,
          cl: 0,
          datum: 0,
          db: 0,
          eladottbeszar: 0,
          eladottelar: 0,
          fizetesmod: 0,
          id: 0,
          megjegyzes: 0,
          nev: 0,
          sumcl: 0,
          transactionnumber: 66666,
          termekid: -21,
        });
      }
      state.kosarak[kosarbolVisszatoltottId] = state.pult;

      updateKosarak();

      state.pult = [];
      renderPult();
      kosarbolVisszatoltott = false;
      kosarbolVisszatoltottId = -1;
    } else {
      //HACK-----------------------------------------------------

      // Function to fetch data from the server
      async function fetchKosarNevek() {
        try {
          const response = await fetch("/api/onlykosarnevek");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("There was a problem with the fetch operation:", error);
        }
      }

      // Function to show the modal with fetched data
      async function showKosarMegnevezesModal() {
        // Fetch data from the server
        const kosarNevek = await fetchKosarNevek();
        if (kosarNevek) {
          // Update the state with fetched data
          state.kosarNevekOnly = kosarNevek;

          // Update the modal body with fetched data
          const kosarNevekDiv = document.getElementById(
            "kosarMegnevezesModalNev"
          );
          kosarNevekDiv.innerHTML = state.kosarNevekOnly.join(" - ");

          // Show the modal
          $("#kosarMegnevezesModal").modal();
        }
      }

      // Function to handle keyboard clicks
      function handleKeyboardClick() {
        const closeButton = document.getElementById(
          "closeKosarMegnevezesButton"
        );
        if (kosarMegnevezes === "") {
          closeButton.disabled = true;
        }
        $(".keyboard").off("click");
        $(".keyboard").on("click", function () {
          const inputKey = this.value;

          if (inputKey === "") {
            kosarMegnevezes = kosarMegnevezes.substring(
              0,
              kosarMegnevezes.length - 1
            );
          } else {
            kosarMegnevezes += inputKey;
          }

          document.querySelector("#kosarMegnevezesId").value = kosarMegnevezes;

          // Check if the button should be enabled or disabled
          if (
            kosarMegnevezes === "" ||
            state.kosarNevekOnly.includes(kosarMegnevezes)
          ) {
            closeButton.disabled = true;
          } else {
            closeButton.disabled = false;
          }
        });
      }

      // Call the function to show the modal and handle keyboard clicks
      document.querySelector("#kosarMegnevezesId").value = "";
      kosarMegnevezes = "";
      document.getElementById("keyboardTemplateKosar").innerHTML =
        keyboardTemplateHTML;
      showKosarMegnevezesModal().then(handleKeyboardClick);

      //HACK-----------------------------------------------------
    }
  }

  foundKosar = state.kosarak.length > 0 ? true : false;
}

/* TODO:TODO:TODO: KOSAR NEVET KAP ES TAROL TODO:TODO:TODO: */
function kosarNevSzerintiTarolas() {
  const validKosarak = state.pult.filter((item) => item !== null);
  if (validKosarak.length > 0) {
    const newKosarNev = {
      kosarMegnevezes: kosarMegnevezes,
      kosarMegnevezesIndex: state.kosarNevek.length + 1,
      kosarMegnevezesPultosNeve: userLocalName,
      kosarMegnevezesPultosKod: userLocalCode,
    };

    // Csak az új kosarat és kosárnevet küldjük el
    const kosarNevekToSend = [newKosarNev];
    const kosarakToSend = [validKosarak];

    saveKosarWithItems(kosarNevekToSend, kosarakToSend);

    // Frissítjük a lokális state-et
    state.kosarNevek.push(newKosarNev);
    state.kosarak.push(validKosarak);

    state.pult = [];
    renderPult();
  } else {
    console.error("Nincs érvényes kosár elem a mentéshez");
    // Itt kezelheti azt az esetet, amikor nincs érvényes kosár elem
  }
}
//INFO: Új kosár létrehozása method 2
function createKosarWithItems(kosarnev, termekek) {
  const newKosar = {
    kosarMegnevezes: kosarnev.kosarMegnevezes,
    kosarMegnevezesIndex: kosarnev.kosarMegnevezesIndex,
    kosarMegnevezesPultosNeve: kosarnev.kosarMegnevezesPultosNeve,
    kosarMegnevezesPultosKod: kosarnev.kosarMegnevezesPultosKod,
    termekek: termekek,
  };

  fetch("/api/kosarak", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newKosar),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      getKosarak(); // Frissítjük a kosarak listáját
    })
    .catch((error) =>
      console.error("Hiba történt az új kosár létrehozásakor:", error)
    );
}

/* TODO:TODO:TODO: KILEPES TODO:TODO:TODO: */

$(".kilepes").click(function () {
  if (state.pult > "") {
    alert("Előbb a kosarakat és a pultot üríteni kell !!!");
  } else {
    let trFizetesMod = "f";
    let megjegyzes = "workTime";
    offPultos(trFizetesMod, megjegyzes);
    //window.location.href = "about:blank";
    window.location.href = "/";
    //window.close()
  }
});

$(".kosarak").click(function () {
  if (foundPult) {
    alert(
      "Előbb a pulton lévő termékeket vagy fizettesd ki, vagy tedd a kosárba, de a pultnak üresnek kell lenni, hogy visszatölts egy kosarat!"
    );
  } else {
    //BUG COPY PASTE
    foundKosar = state.kosarak.length > 0 ? true : false;
    if (foundKosar) {
      oldKosarNevek = [];
      oldKosarak = [];
      let oldKosar = true;
      let state = {
        kosarNevek: [],
        kosarak: [],
      };

      function getKosarak() {
        fetch("/api/kosarnevek")
          .then((response) => response.json())
          .then((data) => {
            // Adatok feldolgozása
            const kosarNevekMap = new Map();

            Object.values(data).forEach((item) => {
              const kosarNev = {
                id: item.id,
                kosarMegnevezes: item.kosarMegnevezes,
                kosarMegnevezesIndex: item.kosarMegnevezesIndex,
                kosarMegnevezesPultosNeve: item.kosarMegnevezesPultosNeve,
                kosarMegnevezesPultosKod: item.kosarMegnevezesPultosKod,
                thisId: item.thisId,
              };

              if (!kosarNevekMap.has(item.kosarMegnevezes)) {
                kosarNevekMap.set(item.kosarMegnevezes, kosarNev);
              }

              state.kosarak.push(
                ...item.kosarak.map((kosar) => ({
                  ...kosar,
                  kosarMegnevezes: item.kosarMegnevezes,
                  oldKosar: oldKosar,
                }))
              );
            });
            state.kosarNevek = Array.from(kosarNevekMap.values());

            // Frissítsük a globális változókat
            oldKosarNevek = [...state.kosarNevek];
            oldKosarak = [...state.kosarak];

            renderKosarak();
          })

          .catch((error) =>
            console.error("Hiba a kosarak lekérésekor:", error)
          );
      }
      //NOTE innen -----------------------------
      function renderKosarak() {
        const tableBody = document.getElementById("kosarakTableBody");
        tableBody.innerHTML = "";

        state.kosarNevek.forEach((kosarNev) => {
          const kosarak = state.kosarak.filter(
            (k) => k.kosarMegnevezes === kosarNev.kosarMegnevezes
          );
          const osszesEladasiAr = kosarak.reduce(
            (sum, kosar) => sum + kosar.eladottelar * kosar.db,
            0
          );

          const row = document.createElement("tr");
          row.innerHTML = `
          <td>
          <button class="btn btn-sm btn-info kosaradatokBtn" data-megnevezes="${
            kosarNev.kosarMegnevezes
          }">Kosáradatok</button>
          </td>
            <td>${kosarNev.kosarMegnevezes}</td>
            <td>${kosarNev.kosarMegnevezesIndex}</td>
            <td>${kosarNev.kosarMegnevezesPultosNeve}</td>
            <td class="text-center">${kosarNev.kosarMegnevezesPultosKod}</td>
            <td class="text-right">${osszesEladasiAr.toFixed(0)} Ft</td>
            <td>
              <button class="btn btn-primary kosarNevBtn" data-megnevezes="${
                kosarNev.kosarMegnevezes
              }">PULTRA</button>
              
            </td>
          `;
          tableBody.appendChild(row);
        });

        //HACK Eseménykezelők hozzáadása
        document.querySelectorAll(".kosarNevBtn").forEach((btn) => {
          btn.addEventListener("click", function () {
            const kosarMegnevezes = this.getAttribute("data-megnevezes");
            const aktualKosarNev = state.kosarNevek.find(
              (k) => k.kosarMegnevezes === kosarMegnevezes
            );
            //console.log("kosarMegnevezes", kosarMegnevezes);
            const aktualKosarak = state.kosarak.filter(
              (k) => k.kosarMegnevezes === kosarMegnevezes
            );
            //console.log("aktualKosarak", aktualKosarak);
            kosarbolVisszatoltottId = state.kosarak.findIndex(
              (k) => k.kosarMegnevezes === kosarMegnevezes
            );
            //console.log("kosarbolVisszatoltottId 😊", kosarbolVisszatoltottId);
            $("#kosarakModal").modal("hide");
            renderPult(aktualKosarNev, aktualKosarak);
            //console.log(aktualKosarak);
          });
        });
        //HACK Eseménykezelők hozzáadása

        document.querySelectorAll(".kosaradatokBtn").forEach((btn) => {
          btn.addEventListener("click", function () {
            const kosarMegnevezes = this.getAttribute("data-megnevezes");
            const kosarNev = state.kosarNevek.find(
              (k) => k.kosarMegnevezes === kosarMegnevezes
            );
            const kosarak = state.kosarak.filter(
              (k) => k.kosarMegnevezes === kosarMegnevezes
            );
            renderKosaradatok(kosarak, kosarNev);
            $("#kosaradatokModal").modal("show");
          });
        });
      }
      //NOTE innen -----------------------------
      function renderKosaradatok(kosarak, kosarNev) {
        const modalTitle = document.getElementById("kosaradatokModalLabel");
        modalTitle.textContent = `Kosár adatai - ${kosarNev.kosarMegnevezes}`;

        const tableBody = document.getElementById("kosaradatokTableBody");
        tableBody.innerHTML = "";

        let osszesEladasiAr = 0;

        kosarak.forEach((kosar) => {
          const teljesAr = kosar.eladottelar * kosar.db;
          osszesEladasiAr += teljesAr;

          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${kosar.nev}</td>
            <td>${kosar.db}</td>
            <td>${kosar.eladottelar.toFixed(2)} Ft</td>
            <td>${teljesAr.toFixed(2)} Ft</td>
            <td>${kosar.fizetesmod}</td>
            <td>${kosar.datum}</td>
          `;
          tableBody.appendChild(row);
        });

        // Összesítő sor hozzáadása
        const osszesitoRow = document.createElement("tr");
        osszesitoRow.innerHTML = `
          <td colspan="3" class="text-right"><strong>Összesen:</strong></td>
          <td><strong>${osszesEladasiAr.toFixed(2)} Ft</strong></td>
          <td colspan="2"></td>
        `;
        tableBody.appendChild(osszesitoRow);
      }
      //NOTE eddig
      // Kosarak modal megjelenítése
      function showKosarakModal() {
        getKosarak();
        $("#kosarakModal").modal("show");
      }

      showKosarakModal();
    }
    //BUG COPY PASTE
  }
  foundKosar = state.kosarak.length > 0 ? true : false;
});

/* TODO:TODO:TODO: TR KP TODO:TODO:TODO: */
async function trKp() {
  let alkotmanyosToday = await alkotmanyosQuery();
  let trFizetesMod = "k";
  trNumber = createTrNumber();
  let megjegyzes = "*";
  if (mindosszesenTransaction > 0) {
    visszajaro(trFizetesMod, saldo, alkotmanyosToday);
    hogyanTovabb(trFizetesMod, megjegyzes);
  }
}
//HACK: visszajaro
function visszajaro(trFizetesMod, saldo, alkotmanyosToday) {
  $("#visszajaroModal").modal({
    backdrop: "static",
    keyboard: false,
  });

  let cimletek = [500, 1000, 2000, 5000, 10000, 20000];
  let betetdijBontas = ``;
  if (trFizetesMod == "m") {
    betetdijBontas = `<h3 class="d-flex justify-content-between w-100 mt-3">Ebből 27%-os ÁFA: <span class="font-weight-bold"> ${
      mindosszesenTransaction - mindosszesenTransactionBetDij
    },- Ft</span></h3>
    <h3 class="d-flex justify-content-between w-100 mb-3 ${
      mindosszesenTransactionBetDij > 0 ? "text-danger" : ""
    }">0%-os ÁFA (betétdíj): <span class="font-weight-bold"> ${mindosszesenTransactionBetDij},- Ft</span></h3>`;
  }
  let visszajaroCimlet = `<table class="table"><tbody> ${betetdijBontas}`;
  let mindossz = ezresCsoportosit(mindosszesenTransaction);
  document.getElementById("backReturnHead").innerHTML = `<span>Fizetendő:</span>
    <span>${mindossz},- Ft</span>`; //`Fizetendő:     ${mindossz},- Ft`;
  for (cimlet of cimletek) {
    if (mindosszesenTransaction < cimlet) {
      visszajaroCimlet += `
            <h3><tr>
            <td class="p-1"><h3><kbd>${cimlet}</kbd></td>
            <td class="p-1">cimletből visszajár: </td>
            <td class="text-right p-1"><h3><span class="font-weight-bold">${ezresCsoportosit(
              cimlet - mindosszesenTransaction
            )},-</span> Ft</td>
            </tr>
            `;
    }
  }
  visszajaroCimlet += `
    </tbody>
    </table>
    `;

  document.getElementById("cimletFelsorolas").innerHTML = visszajaroCimlet;
  document.getElementById("megHatraVan").innerHTML = `<h3>${(
    saldo -
    alkotmanyosToday -
    mindosszesenTransaction
  ).toLocaleString("hu-HU")}</h3>`;
}

//HACK -
async function hogyanTovabb(trFizetesMod, megjegyzes) {
  const buttonPressed = await waitForButtonPress();
  if (buttonPressed == 2) {
    errorLog = "hogyanTovabb";
    renderPult();
    createTranactionData(
      trNumber,
      trFizetesMod,
      megjegyzes,
      mindosszesenTransaction,
      mindosszesenTransactionBeszar
    );
  }
}
async function waitForButtonPress() {
  return new Promise((resolve) => {
    const button1 = document.getElementById("button1");
    const button2 = document.getElementById("button2");

    const handleClick = (buttonNumber) => {
      button1.removeEventListener("click", handleButton1Click);
      button2.removeEventListener("click", handleButton2Click);
      resolve(buttonNumber);
    };

    const handleButton1Click = () => handleClick(1);
    const handleButton2Click = () => handleClick(2);

    button1.addEventListener("click", handleButton1Click);
    button2.addEventListener("click", handleButton2Click);
  });
}

// Használat példa:
async function example() {
  const buttonPressed = await waitForButtonPress();
}

//HACK -

function reset() {
  location.reload();
}

/* TODO:TODO:TODO: TR KP 2 😁 TODO:TODO:TODO: */
var querykp2 = -1;
async function trKp2() {
  if (mindosszesenTransaction == 0) {
    kp2query();
    async function kp2query() {
      let responseKP2 = await fetch("/gettransactionssaldo");
      responseKP2 = await responseKP2.json();
      let responseKP2DaySUM = responseKP2[0]["SUM(kibeosszeg)"];
      $("#responseKP2DaySUM").modal("show");
      document.getElementById("responseKP2DaySUMvalue").innerHTML =
        responseKP2DaySUM + ".- Ft";
      setTimeout(() => {
        $("#responseKP2DaySUM").modal("hide");
      }, 4000);
    }
  } else {
    let alkotmanyosToday = await alkotmanyosQuery();
    let trFizetesMod = "m";
    trNumber = createTrNumber();
    let megjegyzes = "*";
    if (mindosszesenTransaction > 0) {
      visszajaro(trFizetesMod, saldo, alkotmanyosToday);
      hogyanTovabb(trFizetesMod, megjegyzes);
      //HACK> alarmOtherScreen();
    }
  }
}
/* TODO:TODO:TODO: TR CARD TODO:TODO:TODO: */
function trCard() {
  let trFizetesMod = "c";
  trNumber = createTrNumber();
  let megjegyzes = "+";
  errorLog = "trCard";
  createTranactionData(
    trNumber,
    trFizetesMod,
    megjegyzes,
    mindosszesenTransaction,
    mindosszesenTransactionBeszar
  );
  renderPult();
}

function torolFeldolgozottKosarat(kosarId) {
  fetch(`/api/kosarnevek/${kosarId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Frissítjük a state-et
        state.kosarNevek = state.kosarNevek.filter((k) => k.id !== kosarId);
        state.kosarak = state.kosarak.filter((k) => k.kosarnev_id !== kosarId);
      } else {
        console.error("Hiba történt a kosár törlése során:", data.error);
      }
    })
    .catch((error) => {
      console.error("Hiba a kosár törlése során:", error);
    });
}
function trHitel() {
  errorLog = "trHitel";
  createTranactionData(
    trNumber,
    trFizetesMod,
    megjegyzes,
    mindosszesenTransaction,
    mindosszesenTransactionBeszar
  );
}

/* TODO:TODO:TODO: TRANSACTIONS TODO:TODO:TODO: */
async function createTranactionData(
  trNumber,
  trFizetesMod,
  megjegyzes,
  osszeg,
  osszegBeszar
) {
  try {
    await updateMySQL();
    await updateLastId();
  } catch (e) {
    console.error("Hiba történt a tranzakció létrehozása során:", e);
  }

  async function updateMySQL() {
    datum = theTime();
    if (kosarbolVisszatoltott) {
      pultos = kosarNevPultosKodSQL;
      kosarNevPultosKodSQL = -1;
      tarolando = kosarNevDatumSQL;
      kosarNevDatumSQL = "";
      kosarMegnevezes = kosarMegnevezesSQL;
      torolFeldolgozottKosarat(kosarNevIdSQL);
      kosarMegnevezesSQL = "";
      kosarNevIdSQL = -1;
    } else {
      pultos = userLocalCode;
      tarolando = datum;
    }
    //INFOVERSION-2://VERSION-2://VERSION-2://VERSION-2:
    const response = await fetch("/inserttransactions/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        trnumber: trNumber,
        trdate: tarolando,
        trfizetesmod: trFizetesMod,
        megjegyzes: megjegyzes,
        pultos: pultos,
        kibeosszeg: osszeg,
        kibeosszegbeszar: osszegBeszar,
        errorLog: errorLog,
      }),
    });
    await renderGetdata();
    await hitelStateRender();
    await renderPult();
  }

  async function updateLastId() {
    const response = await fetch("/lasttransactionid");
    const data = await response.json();
    lastTransactionId = data[0]["max(id)"];

    for (let pultItem of state.pult) {
      await insertForgalomData(
        lastTransactionId,
        pultItem.id,
        pultItem.db,
        pultItem.eladottbeszar,
        pultItem.eladottelar,
        pultItem.datum,
        xkimeresnevid,
        pultItem.termekId
      );
    }
    state.pult = [];
    await renderPult();
  }
}

/* TODO:TODO:TODO: FORGALOM TODO:TODO:TODO: */
function trKivet() {
  osszeg = osszeg * -1;
  let trFizetesMod = "b";
  trNumber = createTrNumber();
  let megjegyzes = kivet;
  let trKivetNincsBeszar = 0;
  errorLog = "trKivet";
  createTranactionData(
    trNumber,
    trFizetesMod,
    megjegyzes,
    osszeg,
    trKivetNincsBeszar
  );
}

/* TODO:TODO:TODO: FORGALOM TODO:TODO:TODO: */
async function insertForgalomData(
  lastTransactionId,
  id,
  db,
  eladottbeszar,
  eladottelar,
  xDatum,
  xkimeresnevid,
  termekId
) {
  try {
    const response = await fetch("/insertforgalom/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        transaction_id: lastTransactionId,
        termekid: termekId,
        db: db,
        eladottbeszar: eladottbeszar,
        eladottelar: eladottelar,
        eladottdate: xDatum,
        xkimeresnevid: xkimeresnevid,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    foundPult = false;
    if (kosarbolVisszatoltott) {
      kosarbolVisszatoltott = false;
      state.kosarak.splice(kosarbolVisszatoltottId, 1);
      state.kosarNevek.splice(kosarbolVisszatoltottId, 1);
      kosarbolVisszatoltottId = -111;
    }
    if (foundKosar.length == 0) {
      foundKosar = false;
    }
  } catch (error) {
    console.error("Hiba történt a forgalom adatok beszúrása során:", error);
    // Itt kezelheti a hibát, például megjeleníthet egy hibaüzenetet a felhasználónak
  }
}

/* TODO:TODO:TODO: KP KIVET TODO:TODO:TODO: */
$(".kpKivet").click(function () {
  $("#kivetMegnevezesModal").modal();
  //FIXME:
  document.getElementById("keyboardTemplateKivet").innerHTML =
    keyboardTemplateHTML;
  kivetMegnevezes = "";
  kivet = "";
  //FIXME:
  $(".keyboard").off("click");
  document.querySelector("#kivetMegnevezesId").value = "";
  $(".keyboard").on("click", function () {
    inputKey = "";
    inputKey = this.id;
    inputKey = this.value;
    if (inputKey == "") {
      kivetMegnevezes = kivetMegnevezes.substring(
        0,
        kivetMegnevezes.length - 1
      );
    } else {
      kivetMegnevezes += inputKey;
    }
    //kivetMegnevezes += inputKey;
    document.querySelector("#kivetMegnevezesId").value = kivetMegnevezes;
    kivet = kivetMegnevezes;
  });
});

function kivetOsszegNumber() {
  $("#osszegModal").modal();
  $(".calc").off("click");
  document.querySelector("#osszegKivetId").value = "";
  osszegKivet = "";
  osszeg = 0;
  $(".calc").on("click", function () {
    inputKey = "";
    inputKey = this.id;
    inputKey = this.value;
    osszegKivet += inputKey;
    document.querySelector("#osszegKivetId").value = osszegKivet;
    osszeg = parseInt(osszegKivet);
  });
  osszegKivet = "";
}

let datumHTML = datum.substring(0, 13) + oraPerc;
document.getElementById("datum").innerHTML = datumHTML;

/* TODO:TODO:TODO: CREATE TR NUMBER TODO:TODO:TODO: */
function createTrNumber() {
  trNumberDatum = new Date();
  trNumber =
    trNumberDatum.getFullYear() +
    "." +
    (trNumberDatum.getMonth() + 1) +
    "." +
    trNumberDatum.getDate() +
    "." +
    trNumberDatum.getHours() +
    "." +
    trNumberDatum.getMinutes() +
    "." +
    trNumberDatum.getSeconds() +
    "." +
    trNumberDatum.getMilliseconds();
  return trNumber;
}
/* TODO:TODO:TODO: theTime TODO:TODO:TODO: */
function theTime() {
  var xDatum = new Date().toLocaleString();
  return xDatum;
}

/* TODO:TODO:TODO: HITELRENDEZES MOD TODO:TODO:TODO: */
function hitelFizetesKp() {
  let id = fizetoHitelesId;
  trFizetesMod = "k";
  let hitelTrDatum = new Date().toLocaleString();
  let megjegyzes =
    "x " + fizetoHitelesMegjegyzes + " rendezve: " + hitelTrDatum;
  modifyTranactionData(id, trFizetesMod, megjegyzes);
  state.fullTransactionsHitel[fizetoHitelesIndex].trFizetesMod = trFizetesMod;
  state.fullTransactionsHitel.splice(fizetoHitelesIndex, 1);
  fizetoHitelesId = -1;
  fizetoHitelesMegjegyzes = "";
  fizetoHitelesIndex = -1;
  trFizetesMod = "";
}
function hitelFizetesCard() {
  let id = fizetoHitelesId;
  trFizetesMod = "c";
  let hitelTrDatum = new Date().toLocaleString();
  let megjegyzes =
    "x " + fizetoHitelesMegjegyzes + " rendezve: " + hitelTrDatum;
  modifyTranactionData(id, trFizetesMod, megjegyzes);
  state.fullTransactionsHitel[fizetoHitelesIndex].trFizetesMod = trFizetesMod;
  state.fullTransactionsHitel.splice(fizetoHitelesIndex, 1);
  fizetoHitelesId = -1;
  fizetoHitelesMegjegyzes = "";
  fizetoHitelesIndex = -1;
  trFizetesMod = "";
}
/* TODO:TODO:TODO: HITELRENDEZESTRANSACTION TODO:TODO:TODO: */
function modifyTranactionData(id, trFizetesMod, megjegyzes) {
  try {
    updateMySQL();
  } catch (e) {}
  async function updateMySQL() {
    //datum = theTime();
    const response = await fetch("/modifytransactions/", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        trfizetesmod: trFizetesMod,
        megjegyzes: megjegyzes,
      }),
    });
    /* HACK:HACK:HACK:HACK:HACK: Hmmm... */
    renderGetdata();
    hitelStateRender();
  }
}

function fullTransactionsHitel() {
  let hitelListHTML = "";
  $("#hitelRendezesModal").modal();
  hitelListHTML = hitelStateRender();

  document.getElementById("hitelList").innerHTML = hitelListHTML;
  $(".hitelListRendez").off("click");

  $(".hitelListRendez").on("click", function (e) {
    fizetoHitelesId = this.id;
    fizetoHitelesMegjegyzes = e.target.dataset.megjegyzes;
    fizetoHitelesIndex = e.target.dataset.index;
    $("#hitelRendezesModal .close").click();
    $("#fizetoHitelesModModal").modal();
  });
}
function hitelStateRender() {
  let hitelListHTML = "";
  let index = 0;
  for (hitel of state.fullTransactionsHitel) {
    hitelListHTML += `<h5 class='card hitelListRendez' data-megjegyzes=${hitel.megjegyzes} data-index=${index} id='${hitel.id}'>${hitel.megjegyzes} összeg: ${hitel.kibeosszeg} * ${hitel.id}</h5>`;
    index++;
  }
  return hitelListHTML;
}

window.onload = renderPult();

/* TODO:TODO:TODO: RENDER GETDATA TODO:TODO:TODO: */
async function renderGetdata() {
  var id = "h";
  var response = await fetch(`/gettransactionshitel/${id}`);
  state.fullTransactionsHitel = await response.json();
}

/* TODO:TODO:TODO: pultos beléptetése TODO:TODO:TODO: */
function offPultos(trFizetesMod, megjegyzes) {
  trNumber = createTrNumber();

  createTranactionDataOnOff(trNumber, trFizetesMod, megjegyzes);
}

/* TODO:TODO:TODO: onOffPultos tárolása TODO:TODO:TODO: */
function createTranactionDataOnOff(trNumber, trFizetesMod, megjegyzes) {
  try {
    updateMySQL();
  } catch (e) {}
  async function updateMySQL() {
    datum = theTime();
    const response = await fetch("/inserttransactions/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        trnumber: trNumber,
        trdate: datum,
        trfizetesmod: trFizetesMod,
        megjegyzes: megjegyzes,
        pultos: userLocalCode,
        kibeosszeg: 0,
        kibeosszegbeszar: 0,
      }),
    });
  }
}

function ezresCsoportosit(ezresCsoportNormal) {
  ezresCsoport = ezresCsoportNormal.toLocaleString("hu-HU", {
    maximumFractionDigits: 0,
  });
  return ezresCsoport;
}

async function saldoTarget() {
  let response = await fetch("/pultosokadminpsw");
  response = await response.json();
  if (response.length < 7) {
    saldo = 210000;
  } else {
    saldo = response[5].pin;
    betetdij = response[6].pin;
  }
}

function saldoMessage() {
  let saldoDatum = new Date();
  let saldoReactDatum = new Date();
  saldoReactDatum = new Date(saldoReactDatum.setHours("19"));
  saldoReactDatum = new Date(saldoReactDatum.setMinutes("30"));
  saldoReactDatum = new Date(saldoReactDatum.setSeconds("00"));
  let saldoDatumEzred = saldoDatum.getTime();
  let saldoReactDatumEzred = saldoReactDatum.getTime();
  let timerId = setTimeout(
    saldoCalculation,
    saldoReactDatumEzred - saldoDatumEzred
  );
}

async function saldoCalculation() {
  let responseKP2 = await fetch("/gettransactionssaldo");
  responseKP2 = await responseKP2.json();
  let responseCARD = await fetch("/gettransactionssaldocard");
  responseCARD = await responseCARD.json();
  let responseKP2DaySUM = 0;
  let responseCARDDaySUM = 0;
  responseKP2DaySUM = responseKP2[0]["SUM(kibeosszeg)"];
  responseCARDDaySUM = responseCARD[0]["SUM(kibeosszeg)"];
  saldoComplete = (
    saldo -
    responseKP2DaySUM -
    responseCARDDaySUM
  ).toLocaleString("hu-HU", {
    maximumFractionDigits: 0,
  });
  responseKP2DaySUM = responseKP2DaySUM.toLocaleString("hu-HU", {
    maximumFractionDigits: 0,
  });
  responseCARDDaySUM = responseCARDDaySUM.toLocaleString("hu-HU", {
    maximumFractionDigits: 0,
  });

  $("#saldoMessageSend").modal();
  document.getElementById("saldoMessageSendTarget").innerHTML = "LIMIT";
  document.getElementById("saldoMessageSendComplete").innerHTML =
    "<h3>" + saldoComplete + " Ft</h3>";
  //clearTimeout(timerId);
  alert(saldoComplete + "Ft");
  localStorage.setItem("saldoRuning", true);
  localStorage.setItem("saldoRuningDay", new Date().getDate());
}

function alertDialog(messageHead, message) {
  $("#dialog").modal();
  document.getElementById("messageHead").innerHTML = messageHead;
  document.getElementById("message").innerHTML = message;
}

async function alarmOtherScreen() {
  $("#alarmOtherScreenModal").modal("show");
  setTimeout(() => {
    $("#alarmOtherScreenModal").modal("hide");
  }, 4000);
}

async function alkotmanyosQuery() {
  let responseKP2 = await fetch("/gettransactionssaldo");
  responseKP2 = await responseKP2.json();
  let responseKP2DaySUM = responseKP2[0]["SUM(kibeosszeg)"];
  return responseKP2DaySUM;
}
function backReturn() {
  renderPult();
}

document.addEventListener("DOMContentLoaded", () => {
  const counterButtons = document.getElementById("counterButtons");
  const counterValue = document.getElementById("counterValue");
  const saveCounter = document.getElementById("saveCounter");
  const closeCounter = document.getElementById("closeCounter");
  const egyebButton = document.getElementById("egyebButton");
  const egyebModal = new bootstrap.Modal(document.getElementById("egyebModal"));
  const counterModal = new bootstrap.Modal(
    document.getElementById("counterModal")
  );

  let selectedCounter = null;

  egyebButton.addEventListener("click", () => {
    egyebModal.show();
    fetchCounters();
  });

  const typeNames = {
    KÁV: "Kávé",
    JÁT: "Játék",
    CSO: "Csocsó",
    BIL: "Biliárd",
    SÖR: "Hordócsere",
  };

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
      console.error(
        "A szervertől kapott adatok nem tömb formátumúak:",
        counters
      );
    }
  }

  function openCounterModal(counter) {
    selectedCounter = counter;
    document.getElementById("counterModalLabel").textContent = `${
      typeNames[counter.type] || counter.type
    } számláló frissítése`;
    counterValue.value = "0"; // Változtassuk nullára a kezdőértéket
    counterModal.show();
  }

  saveCounter.addEventListener("click", () => {
    const newCount = parseInt(counterValue.value);
    updateCounter(selectedCounter.type, newCount);
  });

  closeCounter.addEventListener("click", () => {
    counterModal.hide();
    egyebModal.hide();
  });

  function updateCounter(type, count) {
    fetch("/api/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, count }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hálózati hiba történt");
        }
        return response.json();
      })
      .then(() => {
        counterModal.hide();
        egyebModal.hide(); // Ez a sor zárja be az egyebModal-t is
        fetchCounters();
      })
      .catch((error) => {
        console.error("Hiba:", error);
        alert("Hiba történt a számláló frissítésekor. Kérjük, próbálja újra.");
      });
  }

  function fetchCounters() {
    fetch("/api/counters")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hálózati hiba történt");
        }
        return response.json();
      })
      .then((data) => {
        createCounterButtons(data);
      })
      .catch((error) => {
        console.error("Hiba:", error);
        counterButtons.innerHTML =
          "<p>Hiba történt az adatok betöltésekor. Kérjük, frissítse az oldalt.</p>";
      });
  }

  function handleSorButton(counter) {
    let trFizetesMod = "s";
    let megjegyzes = "hCsere";
    offPultos(trFizetesMod, megjegyzes);
    updateCounter(counter.type, counter.count + 1);
  }

  fetchCounters();
});
/* HACKFIXME:FIXME SQLITE */
// Kosárnév és kosarak mentése
function saveKosarWithItems(kosarNevek, kosarak) {
  fetch("/api/kosarnevek", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ kosarNevek, kosarak }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Sikeres mentés:", data))
    .catch((error) => console.error("Hiba a mentés során:", error));
}
// Kosárnevek és kosarak lekérése
function getKosarak() {
  fetch("/api/kosarnevek")
    .then((response) => response.json())
    .then((data) => {
      console.log("Kosarak kosárnevekkel:", data);
      displayKosarakTable(data);
    })
    .catch((error) => console.error("Hiba:", error));
}

// Kosárnév és kosarak törlése
function deleteKosar(id) {
  fetch(`/api/kosarnevek/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Törlés sikeres:", data);
      getKosarak();
    })
    .catch((error) => console.error("Hiba:", error));
}

// Kosárnév és kosarak frissítése
function updateKosarWithItems(id, kosarnev, kosarak) {
  fetch(`/api/kosarnevek/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ kosarnev, kosarak }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Frissítés sikeres:", data);
      getKosarak();
    })
    .catch((error) => console.error("Hiba:", error));
}

// Táblázat megjelenítése
function displayKosarakTable(data) {
  const tableBody = document.getElementById("kosarakTableBody");
  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.kosarMegnevezes}</td>
      <td>${item.kosarMegnevezesIndex}</td>
      <td>${item.kosarMegnevezesPultosNeve}</td>
      <td>${item.kosarMegnevezesPultosKod}</td>
      <td>${item.kosarak.length}</td>
      <td>
        <button onclick="showKosarDetails(${item.id})">Részletek</button>
        <button onclick="editKosar(${item.id})">Szerkesztés</button>
        <button onclick="deleteKosar(${item.id})">Törlés</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Kosár részletek megjelenítése
function showKosarDetails(id) {
  fetch(`/api/kosarnevek/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Kosár részletek:", data);
      // Itt megjelenítheti a részleteket egy modális ablakban vagy egy külön oldalon
    })
    .catch((error) => console.error("Hiba:", error));
}

// Kosár szerkesztése
function editKosar(id) {
  fetch(`/api/kosarnevek/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Szerkesztendő kosár:", data);
    })
    .catch((error) => console.error("Hiba:", error));
}

document.addEventListener("DOMContentLoaded", getKosarak);
// Kosárnév és kosarak mentése
function addNewKosar(newKosarNev, newKosarTermekek) {
  const newKosarData = {
    kosarnev: newKosarNev, // Ez már egy objektum, nem kell újra létrehozni
    termekek: newKosarTermekek, // Ez már egy tömb, nem kell újabb tömbbe rakni
  };

  fetch("/kosarak", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newKosarData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Szerver válasza:", data);
      getKosarak(); // Frissítsük a kosarakat
    })
    .catch((error) => console.error("Hiba az új kosár hozzáadásakor:", error));
}

//INFO - OK
function getKosarak() {
  fetch("/api/kosarnevek")
    .then((response) => response.json())
    .then((data) => {
      state.kosarNevek = data.map((item) => ({
        id: item.id,
        kosarMegnevezes: item.kosarMegnevezes,
        kosarMegnevezesIndex: item.kosarMegnevezesIndex,
        kosarMegnevezesPultosNeve: item.kosarMegnevezesPultosNeve,
        kosarMegnevezesPultosKod: item.kosarMegnevezesPultosKod,
        thisId: item.thisId,
      }));

      state.kosarak = data.map((item) => item.kosarak);
    })
    .catch((error) => console.error("Hiba a kosarak lekérésekor:", error));
}

function updateStateWithKosarak(data) {
  // Új kosárnevek és kosarak tömbök létrehozása
  const newKosarNevek = [];
  const newKosarak = [];

  data.forEach((item) => {
    // Kosárnév hozzáadása
    newKosarNevek.push({
      kosarMegnevezes: item.kosarMegnevezes,
      kosarMegnevezesIndex: item.kosarMegnevezesIndex,
      kosarMegnevezesPultosNeve: item.kosarMegnevezesPultosNeve,
      kosarMegnevezesPultosKod: item.kosarMegnevezesPultosKod,
    });

    // Termékek hozzáadása a kosarakhoz
    newKosarak.push(item.termekek);
  });

  // State frissítése az új adatokkal
  state.kosarNevek = newKosarNevek;
  state.kosarak = newKosarak;

  function addNewKosar(newKosarNev, newKosarTermekek) {
    // Új kosár adatainak összeállítása
    const newKosarData = {
      kosarMegnevezes: newKosarNev.kosarMegnevezes,
      kosarMegnevezesIndex: newKosarNev.kosarMegnevezesIndex,
      kosarMegnevezesPultosNeve: newKosarNev.kosarMegnevezesPultosNeve,
      kosarMegnevezesPultosKod: newKosarNev.kosarMegnevezesPultosKod,
      termekek: newKosarTermekek,
    };

    // Küldés a szervernek
    fetch("/api/kosarnevek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newKosarData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Új kosár sikeresen hozzáadva:", data);

        // Frissítsük a teljes kosár listát
        getKosarak();
      })
      .catch((error) =>
        console.error("Hiba az új kosár hozzáadásakor:", error)
      );
  }
}
function ggggetKosarak() {
  fetch("/kosarak")
    .then((response) => response.json())
    .then((data) => {
      kosarakTotal = data; // Globális változóba mentjük a kosarakat
      console.log("Kosarak lekéréve:", kosarakTotal);
    })
    .catch((error) =>
      console.error("Hiba történt a kosarakTotal lekérésekor:", error)
    );
}
function createStateKosarKosarnevek(kosarakTotal) {
  state.kosarNevek = [];
  state.kosarak = [];
  let index = 0;
  for (kosarnev of kosarakTotal) {
    state.kosarNevek.push({
      kosarMegnevezes: kosarnev.kosarMegnevezes,
      kosarMegnevezesIndex: kosarnev.kosarMegnevezesIndex,
      kosarMegnevezesPultosNeve: kosarnev.kosarMegnevezesPultosNeve,
      kosarMegnevezesPultosKod: kosarnev.kosarMegnevezesPultosKod,
    });
    for (termek of kosarakTotal[index].termekek) {
      state.kosarak.push({
        aId: termek.aId,
        cl: termek.cl,
        datum: termek.datum,
        db: termek.db,
        eladottbeszar: termek.eladottbeszar,
        eladottelar: termek.eladottelar,
        fizetesmod: termek.fizetesmod,
        id: termek.id,
        megjegyzes: termek.megjegyzes,
        nev: termek.nev,
        sumcl: termek.sumcl,
        transactionnumber: termek.transactionnumber,
      });
    }
    index++;
  }
}

function showKosarDetails(kosarId) {
  const kosar = kosarak.find((k) => k.id === kosarId);
  if (kosar) {
    const detailsDiv = document.getElementById("kosarDetails");
    detailsDiv.innerHTML = `
      <h3>${kosar.kosarMegnevezes} részletei</h3>
      <table>
        <thead>
          <tr>
            <th>Név</th>
            <th>Darab</th>
            <th>Eladási ár</th>
            <th>Fizetési mód</th>
            <th>Dátum</th>
          </tr>
        </thead>
        <tbody>
          ${kosar.termekek
            .map(
              (termek) => `
            <tr>
              <td>${termek.nev}</td>
              <td>${termek.db}</td>
              <td>${termek.eladottelar}</td>
              <td>${termek.fizetesmod}</td>
              <td>${termek.datum}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }
}

function deleteKosar(id) {
  if (confirm("Biztosan törölni szeretné ezt a kosarat?")) {
    fetch(`/api/kosarak/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        getKosarak(); // Frissítjük a kosarak listáját
      })
      .catch((error) =>
        console.error("Hiba történt a kosár törlésekor:", error)
      );
  }
}

function updateKosarWithItems(id, kosarnev, termekek) {
  const updatedKosar = {
    kosarMegnevezes: kosarnev.kosarMegnevezes,
    kosarMegnevezesIndex: kosarnev.kosarMegnevezesIndex,
    kosarMegnevezesPultosNeve: kosarnev.kosarMegnevezesPultosNeve,
    kosarMegnevezesPultosKod: kosarnev.kosarMegnevezesPultosKod,
    termekek: termekek,
  };

  fetch(`/api/kosarak/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedKosar),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
      getKosarak(); // Frissítjük a kosarak listáját
    })
    .catch((error) =>
      console.error("Hiba történt a kosár frissítésekor:", error)
    );
}

// Kosár szerkesztése
function editKosar(id) {
  fetch(`/api/kosarnevek/${id}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Szerkesztendő kosár:", data);
      // Itt megnyithat egy űrlapot a kosár szerkesztéséhez
    })
    .catch((error) => console.error("Hiba:", error));
}

/* HACKFIXME:FIXME SQLITE */
function updateKosarak() {
  fetch("/api/updateKosarak", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      state: { pult: state.pult },
      aktualKosarThisIdGlobal: aktualKosarThisIdGlobal,
      aktualKosarNevThisIdGlobal: aktualKosarNevThisIdGlobal,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log(data.message);
        // További műveletek siker esetén
      } else {
        console.error(data.error);
        // Hibakezelés
      }
    })
    .catch((error) => {
      console.error("Hiba történt:", error);
    });
  aktualKosarNevThisIdGlobal = -1;
  aktualKosarThisIdGlobal = [];
  oldKosarModify = [];
}
