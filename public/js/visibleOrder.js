console.log("visibleOrder is OK");

//VERSION-2:BUG:VERSION-2:
//alert('Átalakítás alatt!')
//window.location.href = '/admin'
//VERSION-2:BUG:VERSION-2:

const state = {
    termekek: [],
    rendezettTermekek: [],
    ujraRendezettTermekek: [],
};

const selectColor = [
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "dark",
    "light",
];
var termekekHTML = "";
var klikkSzamlalo = -1;
var ezt = -1;
var ide = -1;
var selectName = [];

getdata();

async function getdata() {
    /* NOTE: get datareadtermekek */
    var response = await fetch("/datareadtermekek");
    state.termekek = await response.json();

    console.log('state.termekek*******************************')
    console.log(state.termekek)

    rendezettTermekek();
    rendertermekek();
    /* NOTE: get categories */
}
$(document).ready(function () { });

function rendertermekek() {
    termekekHTML = "";
    let page = 1;
    //let pagePerItem = 2;
    let pagePerItem = 48;
    let pagePerItemIndex = 0;
    for (termek of state.rendezettTermekek) {
        if (pagePerItemIndex == pagePerItem) {
            pagePerItemIndex = 0;
            termekekHTML += `<br><<<<<<<<<<${page}. oldal>>>>>>>>>><br><br>`;
            page++;
        }
        //console.log(selectColor[termek.btncolor]);
        /* termekekHTML += `<button class=" m-1 p-1 btn btn-outline-dark termekButton" id = ${termek.id} */
        termekekHTML += `<button class=" m-1 p-1 btn btn-${selectColor[termek.btncolor]
            } termekButton" id = ${termek.id} 
        data-visiblesequence = ${termek.visiblesequence}
        >${termek.nev}  ${termek.visiblesequence} </button>`;
        pagePerItemIndex++;
    }

    document.getElementById("btnTermekek").innerHTML = termekekHTML;
    klikkFigyelo();
}

function rendezettTermekek() {
    for (termek of state.termekek) {
        state.rendezettTermekek[termek.visiblesequence - 1] = termek;
    }
}
function ujraRendezettTermekek() {
    for (termek of state.rendezettTermekek) {
        state.ujraRendezettTermekek[termek.visiblesequence - 1] = termek;
    }
    //rendezettTermekek = ujraRendezettTermekek;
}
function ujraRender() {
    termekekHTML = "";
    for (termek of state.ujraRendezettTermekek) {
        termekekHTML += `<button class=" m-1 p-1 btn btn-outline-dark termekButton" id = ${termek.id} 
    data-visiblesequence = ${termek.visiblesequence}
    >${termek.nev}  ${termek.visiblesequence} </button>`;
        document.getElementById("btnTermekek").innerHTML = termekekHTML;
    }
}

function klikkFigyelo() {
    $(".termekButton").off("click");
    $(".termekButton").on("click", function (e) {
        visiblesequenceIndex = e.target.dataset.visiblesequence;
        console.log("visiblesequenceIndex");
        console.log(visiblesequenceIndex);

        if (klikkSzamlalo == -1) {
            klikkSzamlalo = 1;
            ezt = parseInt(visiblesequenceIndex);
        } else {
            klikkSzamlalo = -1;
            ide = parseInt(visiblesequenceIndex);

            console.log("ezt, ide");
            console.log(ezt, ide);
            console.log(state.rendezettTermekek);

            if (ezt > ide) {
                for (x_Index = ide - 1; x_Index < ezt - 1; x_Index++) {
                    state.rendezettTermekek[x_Index].visiblesequence =
                        state.rendezettTermekek[x_Index].visiblesequence + 1;
                }
                state.rendezettTermekek[ezt - 1].visiblesequence =
                    parseInt(ide);
            } else {
                console.log("nahaaat - nahaaat");
                for (x_Index = ide - 1; x_Index > ezt - 1; x_Index--) {
                    state.rendezettTermekek[x_Index].visiblesequence =
                        state.rendezettTermekek[x_Index].visiblesequence - 1;
                }
                state.rendezettTermekek[ezt - 1].visiblesequence =
                    parseInt(ide);
            }
            console.log(state.rendezettTermekek);

            //VERSION-2:BUG:VERSION-2:
            let id = []
            let visiblesequence = []
            /* for (termek of state.rendezettTermekek) {
                let id = termek.id;
                let visiblesequence = termek.visiblesequence;
                updatetermekek(id, visiblesequence);
            } */
            for (termek of state.rendezettTermekek) {
                id.push(termek.id)
                visiblesequence.push(termek.visiblesequence)
            }
            updatetermekek(id, visiblesequence);
            //VERSION-2:BUG:VERSION-2:

            console.log('id FE')
            console.log(id)
            console.log('visiblesequence FE')
            console.log(visiblesequence)
            ujraRendezettTermekek();
            ujraRender();
            ezt = -1;
            ide = -1;
        }
    });
}

/* for (let index = 0; index < state.termekek.length; index++) {
        termekekHTML += `<button class=" m-1 p-1 btn btn-success termekButton" id = ${state.termekek[index].id} 
        data-visiblesequence = ${state.termekek[index].visiblesequence}
        >${state.termekek[index].nev}  ${state.termekek[index].visiblesequence} </button>`;
    } */

function updatetermekek(id, visiblesequence) {
    try {
        updateMySQL();
    } catch (e) { }
    //updateMySQL()//VERSION-2:
    async function updateMySQL() {

        //VERSION-2:BUG:VERSION-2:        
        id = id;
        visiblesequence = visiblesequence;
        //VERSION-2:BUG:VERSION-2:

        const response = await fetch("/updatetermekeksequence/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                visiblesequence: visiblesequence,
            }),
        });

        //VERSION-2:BUG:VERSION-2:
        window.location.href = "/visibleOrder";
        //VERSION-2:BUG:VERSION-2:

    }
    console.log('NALeeeeeeeeeeeeeeeeeptem!!!!!!!!!!!!!!!!!!!!!!!')
}

function kilepes() {
    window.location.href = "/admin";
}
