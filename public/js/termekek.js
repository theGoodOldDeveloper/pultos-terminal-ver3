const vissza = localStorage.getItem("adminLocal");
console.log("hol vagzok 😁");
console.log(vissza);

var lastTransaction = -1;
var termekKiszereles = 9;
var csoportKiszereles = 5;
// NOTE: Ez definiálja a bekért adatbázis ojektum tömbjét 😎
const state = {
    /* keszlet: [], HACK:HACK:*/
    csoportkategoria: [],
    xkimeres: [],
    lastTransaction: [],
    xkimeresnev: [],
    kiszereles: [],
    termekek: [],
};
// NOTE: Ezek kellenek a forgalom //okhoz
//const arrayPultNev = [];
//const arrayPultElar = [];
var productsHTML = "";
var productsHTMLdrop = "";
var xid = 1;

getdata();

/* INFO: termék //ok bekérése START INFO: */
async function getdata() {
    /* NOTE: get last-transaction */
    var response = await fetch("/lasttransaction");
    state.lastTransaction = await response.json();

    /* NOTE: get keszlet HACK:HACK: */
    /* var response = await fetch("/dataread");
    state.keszlet = await response.json();
 */
    /* NOTE: get kiszereles */
    var response = await fetch("/datareadkiszereles");
    state.kiszereles = await response.json();

    /* NOTE: get csoport */
    var response = await fetch("/datareadcsoport");
    state.csoportkategoria = await response.json();

    /* NOTE: get xkimeres INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeres");
    state.xkimeres = await response.json();

    /* NOTE: get xkimeresnev INFO: INFO: INFO:*/
    var response = await fetch("/datareadxkimeresnev");
    state.xkimeresnev = await response.json();

    /* NOTE: get datareadtermekek INFO: INFO: INFO:*/
    var response = await fetch("/datareadtermekek");
    state.termekek = await response.json();

    async function getdataonlytermekek() {
        /* NOTE: get datareadtermekek INFO:*/
        var response = await fetch("/datareadtermekek");
        state.termekek = await response.json();
        // BUG: esetleg rendertermekek() BUG:
    }

    /* INFO:HACK:HACK:HACK: torol HACK:HACK:HACK:INFO: */
    rendertermekek();
    /* INFO:HACK:HACK:HACK: torol HACK:HACK:HACK:INFO: */
    /* HACK: */
    renderkiszereles();
    rendercsoport();
    /* HACK: */
    /* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

    $(document).ready(function () {
        $("#newdata").click(function () {
            /* TODO: NOTE: INFO: insertMySQL(); TODO: NOTE: INFO:*/
            insertMySQL();
            async function insertMySQL() {
                /* TODO: NOTE: INFO: NOTE: TODO: */
                const nevInput = document.querySelector("#nev");
                /* HACK: const nev = nevInput.value; HACK: */
                const nev = nevInput.value == "" ? "noname" : nevInput.value;
                nevInput.value = "";

                const beszarInput = document.querySelector("#beszar");
                /* const beszar = beszarInput.value; */
                const beszar =
                    beszarInput.value == "" ? "0" : beszarInput.value;
                beszarInput.value = "";

                const elarInput = document.querySelector("#elar");
                const elar = elarInput.value == "" ? "0" : elarInput.value;
                elarInput.value = "";

                const leltarozandoInput = document.querySelectorAll(
                    'input[name="leltarozando"]'
                );
                var leltarozando = "*";
                console.log(leltarozandoInput);
                for (selected of leltarozandoInput) {
                    if (selected.checked) {
                        console.log(selected.value);
                        console.log(leltarozando);

                        leltarozando = selected.value;
                    }
                }
                /* const leltarozandoInput =
                    document.querySelector("#leltarozando");
                const leltarozando = leltarozandoInput.value; */
                //const leltarozando = leltarozandoInput.value == "i" ? "i" : "n";
                /* const leltarozando =
                    leltarozandoInput.value == ""
                        ? "i"
                        : leltarozandoInput.value; */
                leltarozandoInput.value = "";

                const kritikusInput = document.querySelector("#kritikus");
                const kritikus =
                    kritikusInput.value == "" ? "0" : kritikusInput.value;
                kritikusInput.value = "";

                const gyujtoInput = document.querySelector("#gyujto");
                const gyujto =
                    gyujtoInput.value == "" ? "0" : gyujtoInput.value;
                gyujtoInput.value = "";

                const jelenlegiKeszletInput =
                    document.querySelector("#jelenlegiKeszlet");
                const jelenlegiKeszlet =
                    jelenlegiKeszletInput.value == ""
                        ? "0"
                        : jelenlegiKeszletInput.value;
                jelenlegiKeszletInput.value = "";

                const urtartalomInput = document.querySelector("#urtartalom");
                const urtartalom =
                    urtartalomInput.value == ""
                        ? "0"
                        : parseInt(urtartalomInput.value * 100);
                urtartalomInput.value = "";
                /* BUG:BUG:BUG:BUG:BUG:  */
                //const cl = urtartalom * 10;
                //const cl = termekKiszereles == 2 ? urtartalom * 10 : 1;
                const cl = termekKiszereles == 2 ? parseInt(urtartalom) : 1;
                /* const cl =
                    termekKiszereles == 2 ? parseInt(urtartalom * 100) : 1; */
                /* BUG:BUG:BUG:BUG:BUG: */
                const sumcl = jelenlegiKeszlet * cl;

                var id = xid + 1;
                /* INFO: inserttermekek  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                await fetch("/inserttermekek/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        /* TODO: NOTE: INFO: NOTE: TODO: */
                        nev: nev,
                        beszar: beszar,
                        elar: elar,
                        leltarozando: leltarozando,
                        kritikus: kritikus,
                        gyujto: gyujto,
                        urtartalom: urtartalom,
                        jelenlegiKeszlet: jelenlegiKeszlet,
                        cl: cl,
                        sumcl: sumcl,
                        kiszerelesId: termekKiszereles,
                        csoportId: csoportKiszereles,

                        /* TODO: NOTE: INFO: NOTE: TODO: */
                    }),
                });

                var myArray = [];
                //INFO:INFO:INFO:INFO:INFO:INFO:INFO:INFO:INFO:
                if (termekKiszereles == 2) {
                    $("#createXkimeres").modal();
                    //var myArray = [];
                    var indexArray = [];
                    var myObject = {};
                    createXkimeresHTML = "";
                    let str = `<h3 style = "color: blue">${nev}</h3>`;
                    document.getElementById("azonosito").innerHTML = str;

                    for (vKimeresNev of state.xkimeresnev) {
                        createXkimeresHTML += `<h4 class = "xKimeresSelect" title=0 id = ${vKimeresNev.id} 
                        style = "background: coral" >${vKimeresNev.nev}</h4>`;
                        myObject = {
                            xKim: {
                                elemID: vKimeresNev.id,
                                tarolhato: 0,
                            },
                        };
                        myArray.push(myObject);
                        indexArray.push(vKimeresNev.id);
                    }
                    document.getElementById("modalKineresNev").innerHTML =
                        createXkimeresHTML;
                    $(".xKimeresSelect").click(function () {
                        let index = 0;
                        let arrayIndex = 0;
                        for (let i of indexArray) {
                            if (i == this.id) {
                                index = arrayIndex;
                            }
                            arrayIndex++;
                        }
                        this.title == 0
                            ? this.setAttribute("title", 1)
                            : this.setAttribute("title", 0);
                        /* this.title == 1
                            ? (this.class = "btn btn-success xKimeresSelect")
                            : (this.class = "btn btn-danger xKimeresSelect"); */
                        this.title == 1
                            ? /* this.style.color = "green" */
                              (this.style.background = "greenyellow")
                            : (this.style.background = "coral");

                        this.title == 1
                            ? (myArray[index].xKim.tarolhato = 1)
                            : (myArray[index].xKim.tarolhato = 0);
                        //console.log(myArray);
                    });

                    //BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
                    $("#mDataSend").click(function () {
                        var termek_id = "";
                        var termek_nev = "";
                        var xkimeresnev_id = "";
                        var insertIndex = 0;
                        let index = 1;
                        id = id - 1; //NOTE: a tárolando termek_id

                        for (insertId of myArray) {
                            if (insertId.xKim.tarolhato == 1) {
                                //BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
                                //ide kell a fetch !!!!!!!!!!!!!!!!!!!!!!!!!!!
                                insertIndex = insertId.xKim.elemID;

                                insertXkimereMySQL();
                                //BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
                            }
                        }

                        async function insertXkimereMySQL() {
                            termek_id = id;
                            termek_nev = nev;
                            xkimeresnev_id = insertIndex;

                            /* INFO: inserxkimeres  INFO: INFO: INFO: INFO:*/
                            await fetch("/inserxkimeres/", {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json",
                                },
                                body: JSON.stringify({
                                    termek_id: termek_id,
                                    termek_nev: termek_nev,
                                    xkimeresnev_id: xkimeresnev_id,
                                }),
                            });
                            /* INFO: inserxkimeres  INFO: INFO: INFO: INFO: */
                            /* INFO: Visszaloni a gyokerbe  INFO:INFO:INFO:INFO: */
                            //window.location.href = vissza;
                            /* INFO: Visszaloni a gyokerbe  INFO:INFO:INFO:INFO: */
                        }
                    });
                    //BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
                }
                //INFO:INFO:INFO:INFO:INFO:INFO:INFO:INFO:INFO:

                /* INFO: inserttermekek  INFO: INFO: INFO: INFO: INFO: INFO: INFO:*/
                /* FIXME:FIXME:FIXME: */
                termekekHTML = "";
                termekekHTML += `<tr >
                <td>${id}</td>
                <td>${nev}</td>
                <td>${beszar}</td>
                </tr>
                `;
                /* FIXME:FIXME:FIXME: */
                id++;
                xid++;
                //document.getElementById("termekek").innerHTML = termekekHTML;
                /* FIXME:FIXME:FIXME: */
                document.getElementById("totalForm").reset();
            }
        });
    });
}

/* function modalDataSedn() {
    console.log("modalDataSedn()******************");
    console.log("nev:");
    console.log(nev);
} */
/* INFO:HACK:HACK:HACK: torol HACK:HACK:HACK:INFO: */
function rendertermekek() {
    let index = 0;
    termekekHTML = "";
    for (let vTermekek of state.termekek) {
        termekekHTML += `<tr >
                <td>${vTermekek.id}</td>
                <td>${vTermekek.nev}</td>
                <td>${vTermekek.beszar}</td>
                <td><button class="updateBtn" id=${vTermekek.id}>Edit</td>
                </tr>

     `;
        index++;
        xid = vTermekek.id;
    }
    document.getElementById("termekek").innerHTML = termekekHTML;
    $(".updateBtn").click(function () {
        let arrowIndex = -1;
        for (let i = 0; i < state.termekek.length; i++) {
            if (state.termekek[i].id == this.id) {
                arrowIndex = i;
            }
        }
        var origNev = state.termekek[arrowIndex].nev;
        origId = state.termekek[arrowIndex].id;
        $("#myModal").modal();
        document.getElementById("newNev").value = origNev;
    });
}
/* INFO:HACK:HACK:HACK: torol HACK:HACK:HACK:INFO: */
/* HACK: */
function renderkiszereles() {
    /* var termekKiszereles = 0; */
    let kiszerelesHTML = "";
    kiszerelesHTML += "<form>";
    for (let vKiszereles of state.kiszereles) {
        if (vKiszereles.id > 1) {
            kiszerelesHTML += `
            <input type="radio" id=${vKiszereles.id} name="kiszerelesRadio" value=${vKiszereles.id} class="kiszerelesRadio">
            <label for=${vKiszereles.id}>${vKiszereles.nev}</label><br>
            `;
        }

        //console.log("vKiszereles.id");
        //console.log(vKiszereles.id);
    }
    kiszerelesHTML += "</form>";
    //console.log("**********kiszerelesHTML***********");
    //console.log(kiszerelesHTML);
    document.getElementById("kiszerelesSelect").innerHTML = kiszerelesHTML;
    /* BUG: */
    $(".kiszerelesRadio").click(function () {
        termekKiszereles = this.id;
        console.log("kiszerelesRadio OK");
        console.log(this.id);
        console.log("termekKiszereles");
        console.log(termekKiszereles);
    });
    /* BUG: */
}
/* HACK: https://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_form_horizontal&stacked=h HACK: */
function rendercsoport() {
    /* var csoportKiszereles = 0; */
    let csoportHTML = "";
    csoportHTML += "<form>";
    for (let vCsoport of state.csoportkategoria) {
        if (vCsoport.id > 1) {
            csoportHTML += `
            <input type="radio" id=${vCsoport.id} name="csoportRadio" value=${vCsoport.id} class="csoportRadio">
            <label for=${vCsoport.id}>${vCsoport.nev}</label><br>
            `;
        }
    }
    csoportHTML += "</form>";
    //console.log("**********csoportHTML***********");
    //console.log(csoportHTML);
    document.getElementById("csoportSelect").innerHTML = csoportHTML;
    /* BUG: */
    $(".csoportRadio").click(function () {
        csoportKiszereles = this.id;
        console.log("csoportRadio OK");
        console.log(this.id);
        console.log("csoportKiszereles");
        console.log(csoportKiszereles);
    });
    /* BUG: */
}
/* HACK: */
function figyel() {
    if (document.getElementById("nev").value == "") {
        console.log("******* mezo UUURRREEESSS *******");
    }
    console.log("******* Ok *******");
}
/* HACK: */

/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
function updatetermekek() {
    const nev = document.getElementById("newNev").value;
    try {
        updateMySQL();
    } catch (e) {}
    async function updateMySQL() {
        id = origId;

        const response = await fetch("/updatetermekek/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ nev: nev, id: id }),
        });
        console.log(response);
        let arrowIndex = -1;
        for (let i = 0; i < state.termekek.length; i++) {
            if (state.termekek[i].id == id) {
                arrowIndex = i;
            }
        }
        state.termekek[arrowIndex].nev = nev;
        rendertermekek();
    }
}
/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
