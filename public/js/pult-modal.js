// NOTE: Ez definiálja a bekért adatok ojektum tömbjét 😎
const state = {
    keszlet: [],
    csoportkategoria: [],
    xkimeres: [],
};

var productsHTML = "";
getdata();

/* INFO: termék adatok bekérése START INFO: */
async function getdata() {
    /* NOTE: get keszlet */
    var response = await fetch("/dataread");
    state.keszlet = await response.json();
    console.log(state.keszlet[0].nev);

    /* NOTE: get csoport */
    var response = await fetch("/datareadcsoport");
    state.csoportkategoria = await response.json();
    console.log(state.csoportkategoria[0].nev);

    /* NOTE: get xkimeres */
    var response = await fetch("/datareadxkimeres");
    state.xkimeres = await response.json();
    console.log(state.xkimeres[0].nev);

    renderProducts(); /* HACK: fv() hívás HACK: */
    /* NOTE: A button click funkciójának figyelése */
    $(document).ready(function () {
        const arrayPultNev = [];
        const arrayPultElar = [];
        let arrayIndex = -1;
        let vElar = -1;
        localStorage.setItem("vElar", vElar);
        let summa = 0;
        let xxx = "";
        $(".btnKeszlet").click(function () {
            //alert(this.id);
            arrayIndex = this.id;
            /* NOTE: INFO: ?? */
            if (state.keszlet[arrayIndex].kiszereles_id == 2) {
                /* NOTE: PULT nev */
                arrayPultNev.push(state.keszlet[arrayIndex].nev);
                console.log(arrayPultNev);
                adat = state.xkimeres[arrayIndex].nev;
                /* NOTE: PULT aladasi ar */
                getModal(
                    adat,
                    arrayPultNev,
                    arrayPultElar
                ); /* BUG: MODAL hívása BUG: */
                arrayPultElar.push(parseInt(localStorage.getItem("vElar")));
                //arrayPultElar.push(await myPromise);
                /* arrayPultElar.push(parseInt(localStorage.getItem("vElar"))); */
                document.getElementById("pult").innerHTML +=
                    state.keszlet[arrayIndex].nev + " Ea: " + vElar + "<br>";
            } else {
                /* NOTE: INFO: ?? */
                /* NOTE: PULT nev */
                arrayPultNev.push(state.keszlet[arrayIndex].nev);
                console.log(arrayPultNev);
                /* NOTE: PULT aladasi ar */
                arrayPultElar.push(state.keszlet[arrayIndex].elar);
                console.log("arrayPultElar");
                console.log(arrayPultElar);

                vElar = state.keszlet[arrayIndex].elar;
                //vElar = state.keszlet[arrayIndex].elar;
                //summa += vElar;
                document.getElementById("pult").innerHTML +=
                    state.keszlet[arrayIndex].nev + " Ea: " + vElar + "<br>";
            }
            /* TODO: summa */
            let selement = 0;
            /*             arrayPultElar.forEach((element) => {
                console.log(element);
                selement = selement + element;
            }); */
            console.log(selement);
            document.getElementById("summa").innerHTML = selement;
        });
    });
}
/* INFO: termék adatok bekérése END INFO: */

/* HACK: termék button-ok felrajzolása STAR HACK: */
function renderProducts() {
    for (const csoport of state.csoportkategoria) {
        console.log(csoport.nev + "**********");

        productsHTML += `<p class="bg-dark text-white mb-0">${csoport.nev}</p>`;
        let vIndex = 0;
        for (const product of state.keszlet) {
            if (csoport.nev == product.csoport_nev) {
                productsHTML += `<button type='button' class='btn btn-danger  m-1 btnKeszlet' id = ${vIndex}>${product.nev}</button>`;
            }
            vIndex++;
        }
        productsHTML += `<br>`;
    }

    document.getElementById("termek").innerHTML = productsHTML;
}

/* BUG: MODAL BUG: */
async function getModal(adat, arrayPultNev, arrayPultElar) {
    let myPromise = new Promise(function (resolve) {
        resolve("I love You !!");
    });
    localStorage.setItem("vElar", await myPromise);
    document.getElementById("summa").innerHTML = await myPromise;

    /* async function getModal(adat, arrayPultNev, arrayPultElar) {
    let myPromise = new Promise(function (resolve) {
        resolve("I love You !!");
    }); */

    /* function getModal(adat, arrayPultNev, arrayPultElar) {
    $("#myModal").modal();
    document.getElementById("modal-body").innerHTML = adat;
    console.log(" ******adat*************");
    console.log(adat);
    btnindex = 0;
    $("#btnModal").click(function () {
        btnindex = btnindex + 1;
        console.log("btnindex ++++++++++++++++++++++++++++++++");
        console.log(btnindex);
        vElar = state.xkimeres[1].elar;
        localStorage.setItem("vElar", vElar);
        console.log("vElar");
        console.log(vElar);
        console.log("arrayPultNev");
        console.log(arrayPultNev);
        console.log("arrayPultElar");
        console.log(arrayPultElar);
        console.log("state.xkimeres[1].elar");
        console.log(state.xkimeres[1].elar);
    }); */
}

/* HACK: termék button-ok felrajzolása END HACK: */

/* ####### FRONTEND SEND get REQUEST INFO: START INFO:*/
/* ####### FRONTEND SEND get REQUEST  INFO: */

/* ####### BUTTON EVENT INFO: variable INFO:*/
/* NOTE: A button click funkciójának figyelése */
/* $(document).ready(function () {
        let arrayIndex = -1;
        let indexId = -1;
        let tempId = -1;
        $(".btnKeszlet").click(function () {
            alert(this.id);
            $(this).hide();
            arrayIndex = this.id;
            console.log("tempId :");
            console.log(tempId);
            indexId = this.id;
            console.log("this.id :");
            console.log(this.id);
            console.log("indexId :");
            console.log(indexId);
            console.log("state.keszlet tombindex :");
            console.log(arrayIndex);
            console.log(state.keszlet[arrayIndex].nev);
            console.log(state.keszlet[arrayIndex].id);
            //document.getElementById("pult").innerHTML = state.keszlet[0].nev;
            document.getElementById("pult").innerHTML =
                state.keszlet[arrayIndex].nev;
        });
    }); */
