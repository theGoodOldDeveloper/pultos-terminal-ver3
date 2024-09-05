var maiDatum = new Date()
var maiDatumShort = `${maiDatum.getFullYear()}.${maiDatum.getMonth() + 1}.${maiDatum.getDate()}.`
//document.getElementById('maiDatum').innerHTML = maiDatumShort

const state = {
    alapanyagok: [],
    lastLeltar: [],
};
var lastStockHTML = ''

getdata();

async function getdata() {
    var response = await fetch("/datareadalapanyagok");
    state.alapanyagok = await response.json();

    var response = await fetch("/laststockdata");
    state.lastLeltar = await response.json();
    renderLastStock();
}

function renderLastStock() {
    var lastIndex = 0
    for (alapanyag of state.alapanyagok) {
        let stockDB = (Math.trunc(Math.round(alapanyag.keszletsum / alapanyag.kiszereles * 100) / 100))
        let stockPult = Math.round((Math.round(alapanyag.keszletsum / alapanyag.kiszereles * 100) / 100 - stockDB) * 100) / 100
        lastStockHTML += `
          <tr >
          <td>${alapanyag.nev}</td>
          <td>${alapanyag.kiszereles} ${alapanyag.mertekegyseg}</td>
          <td>${alapanyag.gyujto}</td>
          <td class = "font-weight-bold" >${alapanyag.keszlet}  db</td>
          </tr>
          `
        //<td>${stockPult}</td>
        lastIndex++
    }
    adatokHTML = `Leltározó: ${state.lastLeltar[lastIndex].pultos}<br>Dátum: ${state.lastLeltar[lastIndex].datumTokenId}`
    document.getElementById('leltarData').innerHTML = lastStockHTML
    document.getElementById('adatok').innerHTML = adatokHTML
}