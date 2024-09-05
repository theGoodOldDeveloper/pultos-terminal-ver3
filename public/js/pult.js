var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
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
/* if (localStorage.getItem("localKosarak")) {
} else {
  localStorage.setItem("localKosarak", JSON.stringify(temp));
} */
/* if (localStorage.getItem("localKosarNevek")) {
} else {
  localStorage.setItem("localKosarNevek", JSON.stringify(temp));
} */
if (localStorage.getItem("todolist")) {
  //console.log("letezik 😋");
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
const keyboardTemplateHTML = keyboardTemplateRender();
var datum = new Date().toLocaleString();
const userLocalName = localStorage.getItem("user");
const userLocalCode = localStorage.getItem("pultos");
const xkimeresnevid = -7;
document.getElementById("localStorageName").innerHTML = userLocalName;

/* if (localStorage.getItem("saldoRuning")) {
} else {
    localStorage.setItem("saldoRuning", false);
} */
//localStorage.setItem("saldoRuningDay", new Date().getDate())
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
var fizetoHitelesId = -1;
var fizetoHitelesMegjegyzes = "";
var fizetoHitelesIndex = -1;
var trFizetesMod = "";
var visiblesequenceIndex = -1;
var oldTodolist = JSON.parse(localStorage.getItem("todolist"));
var weekNumber = trNumberDatum.getDay();
var beforStateGroceryValue = 0;

var productItem = 0;
const tabSor = 8;
const tabOszlop = 6;
const widthBTN = 8;
//BUG: - const heightBTN = 3.95;
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

const state = {
  termekek: [],
  pult: [],
  kosarak: [],
  kosarNevek: [],
  fullTransactionsHitel: [],
  osszetevok: [],
  alapanyagok: [],
  tempKosarak: [],
  tempKosarNevek: [],
  todolist: [],
  otherlist: [],
};
// localStorage kosarak & kosarnevek INFO:
//state.kosarak = JSON.parse(localStorage.getItem("localKosarak"));
/* state.kosarak = JSON.parse(getData()); */
getDataKosarak();

async function getDataKosarak() {
  try {
    const response = await fetch("/getStoreDataKosarak");

    if (response.ok) {
      state.kosarak = await response.json();
      beforStateGroceryValue = state.kosarak.length;
      /* renderTable(state.kosarak); */
    } else {
      console.error("Failed to get state.kosarak");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
//state.kosarNevek = JSON.parse(localStorage.getItem("localKosarNevek"));
getDataKosarNevek();
async function getDataKosarNevek() {
  try {
    const response = await fetch("/getStoreDataKosarNevek");

    if (response.ok) {
      state.kosarNevek = await response.json();
      /* renderTable(state.kosarak); */
    } else {
      console.error("Failed to get state.kosarak");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

//console.log(localStorage.getItem("localKosarak"));
//BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
/* console.log("***********KOSARak********");
console.log(state.kosarak);
console.log("-------");
console.log(localStorage.getItem("localKosarak"));

console.log("++++++++++++++++++++++++++++++");
console.log(state.kosarNevek);
console.log("-------");
console.log(localStorage.getItem("localKosarNevek")); */

backupKosarakStart(state.kosarak);
backupKosarNevekStart(state.kosarNevek);

async function backupKosarakStart(data) {
  //console.log('data')
  //console.log(data)
  await fetch("/backupkosarak", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: data }),
  });
}
async function backupKosarNevekStart(data) {
  //console.log('data')
  //console.log(data)
  await fetch("/backupkosarnevek", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ data: data }),
  });
}
//tempData();
//async function tempData() {
//  var responsekosarak = await fetch("/readbackupkosarak");
//  state.tempKosarak = await responsekosarak.json();
//console.log('state.tempKosarak ******************************')
//console.log(state.tempKosarak)

//  var responsenevek = await fetch("/readbackupkosarnevek");
//  state.tempKosarNevek = await responsenevek.json();
//console.log('state.tempKosarNevek ******************************')
//console.log(state.tempKosarNevek)
//}

//BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:

var productsHTML = "";
var foundPult = false;
var foundKosar = false;
var kosarbolVisszatoltott = false;
var cantBeZeroValue = false;
var kosarbolVisszatoltottId = -1;
var kosarMegnevezes = "*";

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

  /* NOTE: get otherlist */
  var response = await fetch("/otherdata");
  state.otherlist = await response.json();

  if (state.todolist[weekNumber] != oldTodolist[weekNumber]) {
    ////VERSION-2:alert(state.todolist[weekNumber])
    let messageHead = dayOfWeek[weekNumber];
    let message = state.todolist[weekNumber];
    alertDialog(messageHead, message);

    //$("#dialog").modal();

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
    $(".termekButton").click(function (e) {
      visiblesequenceIndex = e.target.dataset.visiblesequence - 1;
      arrayIndex = visiblesequenceIndex;
      var edb = 1;
      eladottElar = state.termekek[arrayIndex].elar;
      /* console.log('**************************************')
            console.log('visiblesequenceIndex', visiblesequenceIndex)
            console.log()
            console.log('id', state.termekek[arrayIndex].id)
            console.log('nev', state.termekek[arrayIndex].nev)
            console.log('**************************************') */
      sorokNev = state.termekek[arrayIndex].nev;
      sorokId = state.termekek[arrayIndex].id;
      sorokEladottBeszar = tBeszar[sorokId];
      sorokEladottElar = state.termekek[arrayIndex].elar;
      datum = theTime();
      let _pultTombIndex = 0;
      isPultItem = false;
      for (pultItem of state.pult) {
        if (sorokId == pultItem.id) {
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
          transactionnumber: 21,
          megjegyzes: "info",
          datum: datum,
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
    //HACK             state.kosarak listener                //
    $(".termekButton").click(function () {
      console.log("state.kosarak.length", state.kosarak.length);
      console.log("beforStateGroceryValue", beforStateGroceryValue);
      if (beforStateGroceryValue > state.kosarak.length) {
        kosarakTarol();
        beforStateGroceryValue = state.kosarak.length;
        kosarakTest();
      } else {
        beforStateGroceryValue = state.kosarak.length;
      }
    });
    function kosarakTest() {
      console.log("Kosarak mentve !!!!! 😈😈😈😈😈");
    }
    //HACK             state.kosarak listener                //
  }
}

/* TODO:TODO:TODO: RENDERPULT TODO:TODO:TODO: */
function renderPult() {
  var tetelSorokHTML = "";
  var mindosszesen = 0;
  var mindosszesenBeszar = 0;
  var tombIndex = 0;
  for (var sorok of state.pult) {
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
        </div>
        <h6 <hr color="#ff0000"></h6>
`;
    tombIndex++;
    mindosszesen += sorok.eladottelar * sorok.db;
    mindosszesenBeszar += sorok.eladottbeszar * sorok.db;
  }

  document.getElementById("pult").innerHTML = tetelSorokHTML;
  document.getElementById("summa").innerHTML = mindosszesen.toLocaleString(
    "hu-HU",
    { style: "currency", currency: "huf", maximumFractionDigits: 0 }
  );
  mindosszesenTransaction = mindosszesen;
  mindosszesenTransactionBeszar = mindosszesenBeszar;
  $(".insert-db").click(function (event) {
    //HACK:HACK:HACK:HACK:HACK:
    let pultTombIndex = this.id;
    state.pult[pultTombIndex].db++;
    termekKeszletModositas(state.pult[pultTombIndex], "minus");
    renderPult();
    //HACK:HACK:HACK:HACK:HACK:
  });
  $(".remove-db").click(function (event) {
    console.log("kosarbolVisszatoltott: 😈 ", kosarbolVisszatoltott);

    let pultTombIndex = this.id;
    if (state.pult[pultTombIndex].db == 1 && kosarbolVisszatoltott) {
      alert(
        "Mivel ez egy kosárból visszatoltott termék és, ezért nem lehetet 0 a darabszám!"
      );
    } else {
      console.log(
        "state.pult[pultTombIndex].db: 😈 ",
        state.pult[pultTombIndex].db
      );
      state.pult[pultTombIndex].db--;
      termekKeszletModositas(state.pult[pultTombIndex], "plus");
      renderPult();
    }
  });
  $(".delete-db").click(function (event) {
    if (kosarbolVisszatoltott) {
      alert(
        "Mivel ez egy kosárból visszatoltott termék, ezért nem lehet törölni!"
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
  for (osszetevo of state.osszetevok) {
    if (osszetevo.termek_id == sendData.id) {
      sendData.aId = osszetevo.alapanyag_id; //HACK:
      sendData.sumcl =
        Math.round(aKeszletsum[osszetevo.alapanyag_id] * 100) / 100; //HACK:

      //console.log('*************sendData.sumcl***************', sendData.sumcl)

      sendData.cl = osszetevo.felhasznaltmennyiseg; //HACK:

      if (muvelet == "minus") {
        sendData.sumcl -= sendData.cl;
        sendData.cl = sendData.cl * -1;
        aKeszletsum[osszetevo.alapanyag_id] = sendData.sumcl;
      }
      if (muvelet == "plus") {
        sendData.sumcl += sendData.cl;
        aKeszletsum[osszetevo.alapanyag_id] = sendData.sumcl;
        sendData.cl = sendData.cl;
      }
      if (muvelet == "reset") {
        sendData.cl = sendData.cl * sendData.db;
        sendData.sumcl += sendData.cl * sendData.db;
        aKeszletsum[osszetevo.alapanyag_id] = sendData.sumcl;
      }

      //VERSION-2: kritikus me exam
      /* let arrayIndexAlapanyag = 0
            let index = 0
            for (alapanyag of state.alapanyagok) {
                if (alapanyag.id == osszetevo.alapanyag_id) {
                    arrayIndexAlapanyag = index
                }
                index++
            }
            console.log('keszletsum*********************')
            console.log(aKeszletsum[osszetevo.alapanyag_id])
            console.log(state.alapanyagok[arrayIndexAlapanyag].nev)
            console.log('kritikus--------------------')
            console.log(state.alapanyagok[arrayIndexAlapanyag].kritikus) */

      tarolj(sendData.aId, sendData.sumcl, sendData.cl, sendData.db);
    }
  }
}

/* TODO:TODO:TODO: TAROLJ TODO:TODO:TODO: */
function tarolj(id, sumcl, cl, db) {
  sumcl = Math.round(sumcl * 100) / 100;
  //console.log('<<<<<<<<<<<<<<<<<<id, sumcl, cl, db>>>>>>>>>>>>>>>>>')
  //console.log(id, sumcl, cl, db)
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
      state.kosarak[kosarbolVisszatoltottId] = state.pult;
      state.pult = [];
      renderPult();
      kosarbolVisszatoltott = false;
      kosarbolVisszatoltottId = -1;
    } else {
      document.querySelector("#kosarMegnevezesId").value = "";
      kosarMegnevezes = "";
      $("#kosarMegnevezesModal").modal();
      document.getElementById("keyboardTemplateKosar").innerHTML =
        keyboardTemplateHTML;
      $(".keyboard").off("click");
      $(".keyboard").on("click", function () {
        inputKey = "";
        inputKey = this.id;
        inputKey = this.value;
        //VERSION-2:
        if (inputKey == "") {
          console.log("torleesgomb");
          kosarMegnevezes = kosarMegnevezes.substring(
            0,
            kosarMegnevezes.length - 1
          );
        } else {
          kosarMegnevezes += inputKey;
        }
        //VERSION-2:
        document.querySelector("#kosarMegnevezesId").value = kosarMegnevezes;
      });
    }
  }

  kosarakTarol();
  foundKosar = state.kosarak.length > 0 ? true : false;
}

/* TODO:TODO:TODO: KOSAR NEVET KAP ES TAROL TODO:TODO:TODO: */
function kosarNevSzerintiTarolas() {
  state.kosarak.push(state.pult);
  state.kosarNevek.push({
    kosarMegnevezes: kosarMegnevezes,
    kosarMegnevezesIndex: state.kosarak.length,
    kosarMegnevezesPultosNeve: userLocalName,
    kosarMegnevezesPultosKod: userLocalCode,
  });
  kosarakTarol();
  state.pult = [];
  renderPult();
}

/* TODO:TODO:TODO: KILEPES TODO:TODO:TODO: */

$(".kilepes").click(function () {
  if (state.pult > "") {
    alert("Előbb a kosarakat és a pultot üríteni kell !!!");
  } else {
    kosarakTarol();
    offPultos();
    //window.location.href = "about:blank";
    window.location.href = "/";
    //window.close()
  }
});

/* TODO:TODO:TODO: KOSARAK TODO:TODO:TODO: */
$(".kosarak").click(function () {
  if (foundPult) {
    alert(
      "Előbb a pulton lévő termékeket vagy fizettesd ki, vagy tedd a kosárba, de a pultnak üresnek kell lenni, hogy visszatölts egy kosarat!"
    );
  } else {
    foundKosar = state.kosarak.length > 0 ? true : false;
    if (foundKosar) {
      $("#kosarakModal").modal();
      var kosarSorokHTML = "";
      for (let index = 0; index < state.kosarak.length; index++) {
        kosarSorokHTML += `<button type="button" class="btn btn-info m-2 zzzzz zizitoast " id=${index} style="color: black; font-weight: bold;"> ${state.kosarNevek[index].kosarMegnevezes} - ${state.kosarNevek[index].kosarMegnevezesIndex}</button> --> ${state.kosarak[index][0].datum} 
<br>`;
        /* <button type="button" class="btn btn-danger m-2 tempdelete" id=${index}>DELETE</button> */
      }

      document.getElementById("kosarakFelsorolasa").innerHTML = kosarSorokHTML;

      $(".tempdelete").click(function () {
        console.log("klikkkkeltem", this.id);

        /* let text = `Ha BIZTOS  vagy benne, hogy torolni akarod a :\n  ${state.kosarNevek[this.id].kosarMegnevezes}\n Akkor kattints az OK gombra`
    if (confirm(text) == true) {
        text = "You pressed OK!";
    state.kosarak.splice(this.id, 1);
    state.kosarNevek.splice(this.id, 1);
    kosarbolVisszatoltott = false;
                    foundKosar = state.kosarak.length > 0 ? true : false;

    kosarakTarol();
                } else {
        text = "You canceled!";
    console.log('You canceled!')
                } */

        $("#kosarakModal .close").click();
        //kosarakTarol();
      });
      /* TODO:TODO:TODO: KOSAR KLIKK FIGYELES TODO:TODO:TODO: */
      $(".zzzzz").click(function () {
        if (state.kosarak[this.id].length == 0) {
          //alert("Ezt most törlöm mert üres kosár!");
          state.kosarak.splice(this.id, 1);
          state.kosarNevek.splice(this.id, 1);
          kosarbolVisszatoltott = false;
          foundKosar = state.kosarak.length > 0 ? true : false;
          $("#kosarakModal .close").click();
          kosarakTarol();
        } else {
          kosarbolVisszatoltott = true;
          kosarbolVisszatoltottId = this.id;
          state.pult = state.kosarak[this.id];
          $("#kosarakModal .close").click();
        }
        kosarakTarol();
        foundKosar = state.kosarak.length > 0 ? true : false;
        renderPult();
      });
    }
    kosarakTarol();
  }
  foundKosar = state.kosarak.length > 0 ? true : false;
});

/* TODO:TODO:TODO: TR KP TODO:TODO:TODO: */
function trKp() {
  let trFizetesMod = "k";
  trNumber = createTrNumber();
  let megjegyzes = "*";
  kosarakTarol();
  //INFO: new line !!!!!!!
  renderPult();
  createTranactionData(
    //INFO: new line !!!!!!!
    trNumber,
    trFizetesMod,
    megjegyzes,
    mindosszesenTransaction,
    mindosszesenTransactionBeszar
  );
  if (mindosszesenTransaction > 0) {
    visszajaro();
  }
}

function visszajaro() {
  $("#visszajaroModal").modal();
  let cimletek = [500, 1000, 2000, 5000, 10000, 20000];
  let visszajaroCimlet = `<table class="table"><thead><tr><th></th><th></th><th></th></tr></thead><tbody>`;
  let mindossz = ezresCsoportosit(mindosszesenTransaction);
  document.getElementById(
    "backReturnHead"
  ).innerHTML = `Fizetendő:     ${mindossz},- Ft`;
  for (cimlet of cimletek) {
    if (mindosszesenTransaction < cimlet) {
      visszajaroCimlet += `
            <h3><tr>
            <td><h3><kbd>${cimlet}</kbd></td>
            <td>cimletből visszajár: </td>
            <td class="text-right"><h3><span class="font-weight-bold">${ezresCsoportosit(
              cimlet - mindosszesenTransaction
            )},-</span> Ft</td>
            </tr>
            `;
      /* visszajaroCimlet += `<h4><kbd>${cimlet}</kbd> cimletből visszajár: <span class="font-weight-bold"> ${cimlet - mindosszesenTransaction
        },- </span> Ft</h4>`; */
    }
  }
  visszajaroCimlet += `
    </tbody>
    </table>
    `;
  document.getElementById("cimletFelsorolas").innerHTML = visszajaroCimlet;
}

function reset() {
  location.reload();
}

/* TODO:TODO:TODO: TR KP 2 😁 TODO:TODO:TODO: */
var querykp2 = -1;
function trKp2() {
  if (mindosszesenTransaction == 0) {
    kp2query();
    async function kp2query() {
      let responseKP2 = await fetch("/gettransactionssaldo");
      responseKP2 = await responseKP2.json();
      let responseKP2DaySUM = responseKP2[0]["SUM(kibeosszeg)"];
      console.log("responseKP2DaySUM: ------->> 😛😛😛", responseKP2DaySUM);
      $("#responseKP2DaySUM").modal("show");
      document.getElementById("responseKP2DaySUMvalue").innerHTML =
        responseKP2DaySUM + ".- Ft";
      setTimeout(() => {
        $("#responseKP2DaySUM").modal("hide");
      }, 4000);
    }
  } else {
    let trFizetesMod = "m";
    trNumber = createTrNumber();
    let megjegyzes = "*";
    createTranactionData(
      trNumber,
      trFizetesMod,
      megjegyzes,
      mindosszesenTransaction,
      mindosszesenTransactionBeszar
    );
    //NOTE: NEW LINE !!!
    kosarakTarol();
    renderPult();
    //NOTE: NEW LINE !!!
    if (mindosszesenTransaction > 0) {
      visszajaro();
      alarmOtherScreen();
    }
  }
}
/* TODO:TODO:TODO: TR CARD TODO:TODO:TODO: */
function trCard() {
  let trFizetesMod = "c";
  trNumber = createTrNumber();
  let megjegyzes = "+";
  createTranactionData(
    trNumber,
    trFizetesMod,
    megjegyzes,
    mindosszesenTransaction,
    mindosszesenTransactionBeszar
  );
  //NOTE: old LINE !!!
  kosarakTarol();
  renderPult();
  //NOTE: old LINE !!!
  /* reset() */ //VERSION-2:
}
//BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
/* TODO:TODO:TODO: TR HITEL TODO:TODO:TODO: */
function nevesitettHitel() {
  trFizetesMod = "h";
  trNumber = createTrNumber();
  megjegyzes = "";

  document.querySelector("#hitelMegnevezesId").value = "";
  hitelMegnevezes = "";

  if (kosarbolVisszatoltott) {
    megjegyzes = state.kosarNevek[kosarbolVisszatoltottId].kosarMegnevezes;
    trHitel();
  } else {
    if (foundPult) {
      $("#hitelMegnevezesModal").modal();
      //FIXME:
      document.getElementById("keyboardTemplateHitel").innerHTML =
        keyboardTemplateHTML;
      //FIXME:
      $(".keyboard").off("click");
      $(".keyboard").on("click", function () {
        inputKey = "";
        inputKey = this.id;
        inputKey = this.value;
        hitelMegnevezes += inputKey;
        document.querySelector("#hitelMegnevezesId").value = hitelMegnevezes;
        megjegyzes = hitelMegnevezes;
      });
    }
  }
}
//BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
function trHitel() {
  createTranactionData(
    trNumber,
    trFizetesMod,
    megjegyzes,
    mindosszesenTransaction,
    mindosszesenTransactionBeszar
  );
}

/* TODO:TODO:TODO: TRANSACTIONS TODO:TODO:TODO: */
function createTranactionData(
  trNumber,
  trFizetesMod,
  megjegyzes,
  osszeg,
  ossegBeszar
) {
  try {
    updateMySQL();
    updateLastId();
  } catch (e) {}
  async function updateMySQL() {
    datum = theTime();
    if (kosarbolVisszatoltott) {
      pultos =
        state.kosarNevek[kosarbolVisszatoltottId].kosarMegnevezesPultosKod;
      tarolando = state.kosarak[kosarbolVisszatoltottId][0].datum;
    } else {
      pultos = userLocalCode;
      tarolando = datum;
    }
    //VERSION-2://VERSION-2://VERSION-2://VERSION-2:
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
        kibeosszegbeszar: ossegBeszar,
      }),
    });
    renderGetdata();
    hitelStateRender();
    renderPult(); //BUG
  }
  async function updateLastId() {
    var response = await fetch("/lasttransactionid");
    lastTransactionId = await response.json();
    lastTransactionId = lastTransactionId[0]["max(id)"];
    for (let pultItem of state.pult) {
      insertForgalomData(
        lastTransactionId,
        pultItem.id,
        pultItem.db,
        pultItem.eladottbeszar,
        pultItem.eladottelar,
        pultItem.datum,
        xkimeresnevid
      );
    }
    //console.log("renderPult yesss!!! 😈");
    state.pult = [];
    renderPult();
  }
}

/* TODO:TODO:TODO: FORGALOM TODO:TODO:TODO: */
function trKivet() {
  osszeg = osszeg * -1;
  let trFizetesMod = "b";
  trNumber = createTrNumber();
  let megjegyzes = kivet;
  let trKivetNincsBeszar = 0;
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
  xkimeresnevid
) {
  const response = await fetch("/insertforgalom/", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      transaction_id: lastTransactionId,
      termekid: id,
      db: db,
      eladottbeszar: eladottbeszar,
      eladottelar: eladottelar,
      eladottdate: xDatum,
      xkimeresnevid: xkimeresnevid,
    }),
  });
  foundPult = false;
  if (kosarbolVisszatoltott) {
    kosarbolVisszatoltott = false;
    state.kosarak.splice(kosarbolVisszatoltottId, 1);
    state.kosarNevek.splice(kosarbolVisszatoltottId, 1);
    kosarbolVisszatoltottId = -1;
  }
  if (foundKosar.length == 0) {
    foundKosar = false;
  }
  //BUG:state.pult = [];
  //BUG: renderPult();
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
      console.log("torleesgomb");
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

//INFO: * keyboardTemplateRender * INFO:
function keyboardTemplateRender() {
  return `
    <div class="vKeyboard-container d-flex row">

        <div class=" vKeyboard-letters " id="vKeyboard-letters">
            <div class="row vKeyboardRow vKeyboard-offsetRow1 justify-content-center m-1">
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-Q" value="Q">Q</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-W" value="W">W</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-E" value="E">E</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-R" value="R">R</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-T" value="T">T</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-Z" value="Z">Z</button>

                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-U" value="U">U</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-I" value="I">I</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-O" value="O">O</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-P" value="P">P</button>
            </div>
            <div class="row vKeyboardRow vKeyboard-offsetRow2 justify-content-center">
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-A" value="A">A</button>

                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-S" value="S">S</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-D" value="D">D</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-F" value="F">F</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-G" value="G">G</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-H" value="H">H</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-J" value="J">J</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-K" value="K">K</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-L" value="L">L</button>

            </div>
            <div class="row vKeyboardRow vKeyboard-offsetRow3 justify-content-center">
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-Y" value="Y">Y</button>

                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-X" value="X">X</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-C" value="C">C</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-V" value="V">V</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-B" value="B">B</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-N" value="N">N</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-letter m-1"
                    id="keyboard-M" value="M">M</button>
                <span class="vKeyboard-spacer"></span>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-symbol m-1"
                    id="keyboard-tiret" value="-">-</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-symbol m-1"
                    id="keyboard-underscore" value="_">_</button>
                <button type="button col" class="btn keyboard btn-primary vKeyboard-symbol m-1"
                    id="keyboard-@" value="@">@</button>
            </div>
            <div class="row vKeyboardRow justify-content-center">

                <button type="button col"
                    class="btn keyboard btn-primary vKeyboard-symbol vKeyboard-space"
                    id="keyboard-space" value=".">
                    <span class="vKeyboard-space-character">┗━━━━━━━━━━━┛</span>
                </button>
                <button type="button col" class="btn keyboard btn-danger vKeyboard-symbol ml-3"
                    id="keyboard-torol>" value="">⌫</button>
            </div>
        </div>

    </div>
    `;
}
/* <button type="button col" class="btn btn-primary vKeyboard-return vKeyboard-numOk vKeyboard-double ml-3"
        id="keyboard-return" value="t">⌫</button> */

/* INFO: másodlagos STATE bekérés INFO: */
/* TODO:TODO:TODO: RENDER GETDATA TODO:TODO:TODO: */
async function renderGetdata() {
  var id = "h";
  var response = await fetch(`/gettransactionshitel/${id}`);
  state.fullTransactionsHitel = await response.json();
}

/* TODO:TODO:TODO: KOSARAK TODO:TODO:TODO: */
async function kosarakTarol() {
  /* localStorage.setItem("localKosarak", JSON.stringify(state.kosarak)); */

  const dataToSendKosarak = state.kosarak;
  //const dataToSendNevek = state.kosarNevek;

  try {
    const responseKosarak = await fetch("/storeDataKosarak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSendKosarak),
    });

    if (responseKosarak.ok) {
      //console.log("Data sent successfully");
    } else {
      console.error("Failed to send data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
  kosarNevekTarol();
}

async function kosarNevekTarol() {
  const dataToSendNevek = state.kosarNevek;
  try {
    const responseNevek = await fetch("/storeDataKosarNevek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSendNevek),
    });
    if (responseNevek.ok) {
      //console.log("Data sent successfully");
    } else {
      console.error("Failed to send data");
    }
  } catch (error) {
    console.error("Error:", " ezzazz");
  }
}
/* localStorage.setItem("localKosarNevek", JSON.stringify(state.kosarNevek)); */
/* const dataToSendNevek = state.kosarNevek; */

/* try {
    const responseNevek = await fetch("/storeDataKosarNevek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSendNevek),
    });

    if (responseNevek.ok) {
      console.log("Data sent successfully");
    } else {
      console.error("Failed to send data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
} */

/* TODO:TODO:TODO: pultos beléptetése TODO:TODO:TODO: */
function offPultos() {
  let trFizetesMod = "f";
  trNumber = createTrNumber();
  let megjegyzes = "workTime";
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
  if (response.length < 6) {
    saldo = 210000;
  } else {
    saldo = response[5].pin;
  }
}

function saldoMessage() {
  //console.log("Saldo message START!");
  let saldoDatum = new Date();
  let saldoReactDatum = new Date();
  saldoReactDatum = new Date(saldoReactDatum.setHours("19"));
  saldoReactDatum = new Date(saldoReactDatum.setMinutes("30"));
  saldoReactDatum = new Date(saldoReactDatum.setSeconds("00"));
  let saldoDatumEzred = saldoDatum.getTime();
  let saldoReactDatumEzred = saldoReactDatum.getTime();
  /* console.log('Belepes datum: ', saldoDatum)
    console.log('Message datum: ', saldoReactDatum)
    console.log('Belepes datumEzred: ', saldoDatumEzred)
    console.log('Message datumEzred: ', saldoReactDatumEzred)
    console.log("Saldo message START time 😊! " + ((saldoReactDatumEzred - saldoDatumEzred) / 1000) + " sec"); */

  let timerId = setTimeout(
    saldoCalculation,
    saldoReactDatumEzred - saldoDatumEzred
  );

  //let timerId = setTimeout(...);
}

async function saldoCalculation() {
  let responseKP2 = await fetch("/gettransactionssaldo");
  responseKP2 = await responseKP2.json();
  let responseCARD = await fetch("/gettransactionssaldocard");
  responseCARD = await responseCARD.json();
  let responseKP2DaySUM = 0;
  let responseCARDDaySUM = 0;
  /* console.log('RESPONSE: KP2------->>', responseKP2)
    console.log('RESPONSE: KP2------->>', {responseKP2})
    console.log('RESPONSE: KP2------->>', responseKP2[0]["SUM(kibeosszeg)"]) */
  responseKP2DaySUM = responseKP2[0]["SUM(kibeosszeg)"];
  //console.log('responseKP2DaySUM: ------->> 😛😛😛', responseKP2DaySUM)
  //-------------------------------------------------
  /* console.log('RESPONSE: CARD------->>', responseCARD)
    console.log('RESPONSE: CARD------->>', {responseCARD})
    console.log('RESPONSE: CARD------->>', responseCARD[0]["SUM(kibeosszeg)"]) */
  responseCARDDaySUM = responseCARD[0]["SUM(kibeosszeg)"];
  //console.log('responseCARDDaySUM: ------->> 😛😛😛', responseCARDDaySUM)

  //console.log('NAPIcel: ------->> 😛', saldo)
  saldoComplete = (
    saldo -
    responseKP2DaySUM -
    responseCARDDaySUM
  ).toLocaleString("hu-HU", {
    maximumFractionDigits: 0,
  });
  //console.log('Saldo calculation: ----EZAZ???--->>', saldoComplete)
  responseKP2DaySUM = responseKP2DaySUM.toLocaleString("hu-HU", {
    maximumFractionDigits: 0,
  });
  responseCARDDaySUM = responseCARDDaySUM.toLocaleString("hu-HU", {
    maximumFractionDigits: 0,
  });

  //console.log('saldoComplete: ------->> 😛', saldoComplete)
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
$("#other").off("click");
$("#other").on("click", () => {
  let datumNow = new Date().toLocaleString();
  massage = `
    <label for="other1">Kávégép számlálóállása: (${state.otherlist[0].dataValue})</label > <br>
        <input type="number" id="adat1" name="other1"><br>
            <label for="other2">Játékgépek számlálóállása: (${state.otherlist[1].dataValue})</label><br>
                <input type="number" id="adat2" name="other2"><br>
                    <label for="other3">Csocsó számláló: (${state.otherlist[2].dataValue})</label><br>
                        <input type="number" id="adat3" name="other3"><br>
                            <label for="other4">Biliárd: (${state.otherlist[3].dataValue})</label><br>
                                <input type="number" id="adat4" name="other4"><br>
                                    `;
  alertDialog(datumNow, massage);
  $("#sendData").off("click");
  $("#sendData").on("click", () => {
    let data = [];
    if (document.getElementById("adat1").value == "") {
      document.getElementById("adat1").value = state.otherlist[0].dataValue;
    }
    data.push({
      dataType: "Kávégép számlálóállása",
      dataValue: document.getElementById("adat1").value,
    });
    if (document.getElementById("adat2").value == "") {
      document.getElementById("adat2").value = state.otherlist[1].dataValue;
    }
    data.push({
      dataType: "Játékgépek számlálóállása",
      dataValue: document.getElementById("adat2").value,
    });
    if (document.getElementById("adat3").value == "") {
      document.getElementById("adat3").value = state.otherlist[2].dataValue;
    }
    data.push({
      dataType: "Csocsó számláló",
      dataValue: document.getElementById("adat3").value,
    });
    if (document.getElementById("adat4").value == "") {
      document.getElementById("adat4").value = state.otherlist[3].dataValue;
    }
    data.push({
      dataType: "Biliárd",
      dataValue: document.getElementById("adat4").value,
    });
    data.push({ dataType: "Dátum", dataValue: datumNow });

    data.push({
      dataType: "Kávégép előző számlálóállása",
      dataValue: state.otherlist[0].dataValue,
    });
    data.push({
      dataType: "Játékgépek előző számlálóállása",
      dataValue: state.otherlist[1].dataValue,
    });
    data.push({
      dataType: "Csocsó előző számláló",
      dataValue: state.otherlist[2].dataValue,
    });
    data.push({
      dataType: "Biliárd előző",
      dataValue: state.otherlist[3].dataValue,
    });
    data.push({
      dataType: "Dátum előző",
      dataValue: state.otherlist[4].dataValue,
    });
    otherTarol();
    async function otherTarol() {
      await fetch("/othersave", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ data: data }),
      });
    }
  });
});

async function alarmOtherScreen() {
  //let responseKP2 = await fetch("/gettransactionssaldo")
  //responseKP2 = await responseKP2.json()
  //let responseKP2DaySUM = responseKP2[0]["SUM(kibeosszeg)"]
  //console.log('responseKP2DaySUM: ------->> 😛😛😛', responseKP2DaySUM)
  $("#alarmOtherScreenModal").modal("show");
  //document.getElementById('responseKP2DaySUMvalue').innerHTML = responseKP2DaySUM + '.- Ft'
  setTimeout(() => {
    $("#alarmOtherScreenModal").modal("hide");
  }, 4000);
}

/* 
$(".hitelListRendez").off("click");

    $(".hitelListRendez").on("click", function (e) {
*/
