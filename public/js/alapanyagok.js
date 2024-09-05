var alapanyagokHTML = "";
const state = {
    alapanyagok: [],
    pultbanVan: [],
};
getdata();
var sendData = true;
var newData = true;
var id = -1;
var lastId = -1;
var pultbanVanId = -1;
var keresValue = "";
var nowKeszletDB = 0
var nowKeszletPULT = 0

document.addEventListener("keypress", function (e) {
    console.log(e.keyCode);
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        keresValue = document.querySelector("#nevSzukit").value;
        renderAlapanyagokData();
        return false;
    }
});

function newAlapanyag() {
    var nev = document.getElementById("nev").value;
    var mertekegyseg = document.getElementById("mertekegyseg").value;
    if (mertekegyseg == "darab") {
        document.getElementById("kiszereles").value = 1;
    }
    var kiszereles = document.getElementById("kiszereles").value;
    if (mertekegyseg == "darab") {
        kiszereles = 1;
        sendData = true;
    }
    if (kiszereles !== "") {
        sendData = true;
    }
    if (nev == "") {
        alert("NÉV kitöltése kötelező!");
        sendData = false;
    }
    if (kiszereles == "") {
        alert("KISZERELÉS kitöltése kötelező!");
        sendData = false;
    }
    if (mertekegyseg == "") {
        alert("******* kitöltése kötelező!");
        sendData = false;
    }
    kiszereles = parseFloat(kiszereles);
    var leltarozando = parseInt(document.getElementById("leltarozando").value);
    var kritikus = parseInt(document.getElementById("kritikus").value);
    var gyujto = parseInt(document.getElementById("gyujto").value);
    var keszlet = parseInt(document.getElementById("keszlet").value);
    var pultbanVan = parseInt(document.getElementById("pultbanvan").value);
    var beszar = parseInt(document.getElementById("beszar").value);
    var pult = parseFloat(document.getElementById("pult").value);
    var keszletsum = keszlet * kiszereles + pult;

    //VERSION-2:
    if (sendData) {
        /* alert(
            "SEND !!! -> newData: " + newData + " Nev: " + nev + " Id: " + id
        ); */
        if (newData) {
            insertMySQL(
                nev,
                mertekegyseg,
                kiszereles,
                leltarozando,
                kritikus,
                gyujto,
                keszlet,
                beszar,
                keszletsum
            );
            refreshJSON(pultbanVan, (lastId + 1))
            sendData = true;
            document.getElementById("newAlapanyag").reset();
        } else {
            updateMySQL(
                id,
                nev,
                mertekegyseg,
                kiszereles,
                leltarozando,
                kritikus,
                gyujto,
                keszlet,
                beszar,
                keszletsum
            );
            refreshJSON(pultbanVan, id)
            newData = true;
            sendData = true;
            document.getElementById("newAlapanyag").reset();
        }

    }
    //VERSION-2:
}
function darabValue() {
    if (document.getElementById("mertekegyseg").value == "darab") {
        document.getElementById("kiszereles").value = 1;
        sendData = true;
    }
}
async function getdata() {
    var response = await fetch("/datareadalapanyagok");
    state.alapanyagok = await response.json();
    response = await fetch("/pultbanvan");
    state.pultbanVan = await response.json();
    renderAlapanyagokData();
}
async function insertMySQL(
    nev,
    mertekegyseg,
    kiszereles,
    leltarozando,
    kritikus,
    gyujto,
    keszlet,
    beszar,
    keszletsum
) {
    await fetch("/insertalapanyagok", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            nev: nev,
            mertekegyseg: mertekegyseg,
            kiszereles: kiszereles,
            leltarozando: leltarozando,
            kritikus: kritikus,
            gyujto: gyujto,
            keszlet: keszlet,
            beszar: beszar,
            keszletsum: keszletsum,
        }),
    });
    getdata();
    renderAlapanyagokData();
}
//VERSION-2:
async function updateMySQL(
    id,
    nev,
    mertekegyseg,
    kiszereles,
    leltarozando,
    kritikus,
    gyujto,
    keszlet,
    beszar,
    keszletsum
) {
    //id = origId;

    const response = await fetch("/updatealapanyagok/", {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            nev: nev,
            mertekegyseg: mertekegyseg,
            kiszereles: kiszereles,
            leltarozando: leltarozando,
            kritikus: kritikus,
            gyujto: gyujto,
            keszlet: keszlet,
            beszar: beszar,
            keszletsum: keszletsum,
        }),
    });
    /* let arrowIndex = -1;
    for (let i = 0; i < state.termekek.length; i++) {
        if (state.termekek[i].id == id) {
            arrowIndex = i;
        }
    }
    state.termekek[arrowIndex].nev = nev;
    state.termekek[arrowIndex].beszar = beszar;
    state.termekek[arrowIndex].elar = elar;
    state.termekek[arrowIndex].leltarozando = leltarozando;
    state.termekek[arrowIndex].kritikus = kritikus;
    state.termekek[arrowIndex].gyujto = gyujto;
    rendertermekek(); */
    getdata();
    renderAlapanyagokData();
}
//VERSION-2:

async function refreshJSON(pultbanVan, id) {
    let data = []
    state.pultbanVan[id] = pultbanVan
    for (let item of state.pultbanVan) {
        data.push(item)
    }
    await fetch("/refreshpultbanvan", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ data: data }),
    });
}

function renderAlapanyagokData() {
    let index = 0;
    alapanyagokHTML = "";
    for (alapanyag of state.alapanyagok) {
        if (alapanyag.nev.toLowerCase().search(keresValue.toLowerCase()) >= 0) {
            /* productsAreaHTML += `<button type="button" class="btn btn-primary m-2 p-2 productsButton" id=${alapanyag.id} data-nev=${alapanyag.nev}>${alapanyag.nev} - ${alapanyag.id}</button>`; */
            //VERSION-2:
            nowKeszletDB = Math.trunc(Math.round(alapanyag.keszletsum / alapanyag.kiszereles * 100) / 100)
            nowKeszletPULT = Math.round(alapanyag.keszletsum - nowKeszletDB * alapanyag.kiszereles * 100) / 100
            //VERSION-2:
            /* <td>${index}</td> */
            alapanyagokHTML += `<tr >
        <td>${alapanyag.id}</td>
        <td>${alapanyag.nev}</td>
        <td>${alapanyag.mertekegyseg}</td>
        <td>${alapanyag.kiszereles}</td>
        <td>${alapanyag.leltarozando}</td>
        <td>${alapanyag.kritikus}</td>
        <td>${alapanyag.gyujto}</td>
        <td>${nowKeszletDB}</td>
        <td>${alapanyag.beszar}</td>
        <td><button class="updateBtn btn btn-danger" data-index=${index} id=${alapanyag.id}>Edit</td>
        </tr>
        `;
        }
        lastId = alapanyag.id
        index++;
    }
    document.getElementById("alapanyagokData").innerHTML = alapanyagokHTML;
    $(".updateBtn").click(function (e) {
        let clickIndex = e.target.dataset.index;
        id = parseInt(this.id);
        newData = false;
        /* document.getElementById("id").value =
            state.alapanyagok[clickIndex].id; */
        //VERSION-2:
        nowKeszletDB = Math.trunc(Math.round(state.alapanyagok[clickIndex].keszletsum / state.alapanyagok[clickIndex].kiszereles * 100) / 100)
        nowKeszletPULT = ((state.alapanyagok[clickIndex].keszletsum - Math.round(nowKeszletDB * state.alapanyagok[clickIndex].kiszereles * 100) / 100))
        nowKeszletPULT = Math.round(nowKeszletPULT * 100) / 100
        //VERSION-2:

        document.getElementById("nev").value =
            state.alapanyagok[clickIndex].nev;
        document.getElementById("mertekegyseg").value =
            state.alapanyagok[clickIndex].mertekegyseg;
        document.getElementById("kiszereles").value =
            state.alapanyagok[clickIndex].kiszereles;
        document.getElementById("leltarozando").value =
            state.alapanyagok[clickIndex].leltarozando;
        document.getElementById("kritikus").value =
            state.alapanyagok[clickIndex].kritikus;
        document.getElementById("gyujto").value =
            state.alapanyagok[clickIndex].gyujto;
        document.getElementById("keszlet").value =
            nowKeszletDB;

        if (state.pultbanVan[id] >= 0 && state.pultbanVan[id] != null) {
            console.log('😛 ok', id)
        } else {
            state.pultbanVan[id] = 0
        }
        document.getElementById("pultbanvan").value =
            (state.pultbanVan[id]);
        document.getElementById("pult").value =
            nowKeszletPULT;
        document.getElementById("beszar").value =
            state.alapanyagok[clickIndex].beszar;
        document.getElementById("nev").focus();
    });
}
const szukitBtn = document.querySelector("#szukit-btn");
szukitBtn.onclick = function () {
    keresValue = document.querySelector("#nevSzukit").value;
    renderAlapanyagokData();
};
