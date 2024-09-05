var szukit = "";
if (localStorage.getItem("keresValue")) {
    var keresValue = localStorage.getItem("keresValue");
    document.querySelector("#nevSzukit").value = keresValue;
    console.log("true");
    console.log(keresValue);
    console.log(document.querySelector("#nevSzukit").value);
} else {
    localStorage.setItem("keresValue", "");
    var keresValue = localStorage.getItem("keresValue");
    document.querySelector("#nevSzukit").value = keresValue;
    console.log("false");
}
//var keresValue = "";
//var keresValue = localStorage.getItem("keresValue");
//console.log("keresValue");
//console.log(keresValue);

const state = {
    alapanyagok: [],
};
var productsAreaHTML = "";
getdata();

var keszlet = 0;
var nev = "";
var kiszerelesId = -1;
var valtoztatas = 0;
var idSend = 0;
var cl = 0;
var sumcl = 0;
//document.getElementById("nevSzukit").value = "";
szukit = document.getElementById("nevSzukit").value;

document.querySelector("#nevSzukit").value = keresValue;
document.addEventListener("keypress", function (e) {
    console.log(e.keyCode);
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        keresValue = document.querySelector("#nevSzukit").value;
        localStorage.setItem("keresValue", keresValue);
        renderAlapanyagok();
        productsButtonRender();
        return false;
    }
});

const szukitBtn = document.querySelector("#szukit-btn");
szukitBtn.onclick = function () {
    //document.querySelector("#nevSzukit").value = keresValue;
    keresValue = document.querySelector("#nevSzukit").value;
    //localStorage.setItem("keresValue", keresValue);
    renderAlapanyagok();
    productsButtonRender();
};

function productsButtonRender() {
    $(".productsButton").click(function (e) {
        let actualID = this.id
        getdata2()
        async function getdata2() {
            var response = await fetch("/datareadalapanyagok");
            state.alapanyagok = await response.json();
            if (e.target.nodeName == "BUTTON") {
                for (product of state.alapanyagok) {
                    if (product.id == actualID) {
                        nev = product.nev;
                        keszlet = Math.trunc(Math.round(product.keszletsum / product.kiszereles * 100) / 100)
                        kiszereles = product.kiszereles;
                        idSend = actualID;
                        keszletsum = product.keszletsum;
                    }
                }
                console.log(idSend)
                addStockQuantity(idSend, nev, keszlet);
            }
        }
    });
}

async function getdata() {
    var response = await fetch("/datareadalapanyagok");
    state.alapanyagok = await response.json();

    renderAlapanyagok();

    $(document).ready(function () {
        productsButtonRender();
    });
}

function addStockQuantity(idSend, nev, keszlet) {
    $("#addStockQuantityModal").modal();
    document.getElementById("addStockQuantityName").innerHTML = nev + "<br>";
    document.getElementById("addStockQuantityKeszlet").innerHTML = keszlet;
}

function renderAlapanyagok() {
    productsAreaHTML = "";
    for (product of state.alapanyagok) {
        if (product.nev.toLowerCase().search(keresValue.toLowerCase()) >= 0) {
            productsAreaHTML += `<button type="button" class="btn btn-primary m-2 p-2 productsButton" id=${product.id} data-nev=${product.nev}>${product.nev} - ${product.id}</button>`;
        }
    }
    document.getElementById("productArea").innerHTML = productsAreaHTML;
}

function keszletValtozas() {
    valtoztatas = document.getElementById("addQuantity").value;
    valtoztatas = parseInt(valtoztatas);
    if (isNaN(valtoztatas)) {
        valtoztatas = 0;
    } else {
        console.log("isNaN 😁");
    }
    document.getElementById("addQuantity").value = "";

    /* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
    updatetermekekbeszerzes(valtoztatas);
    function updatetermekekbeszerzes(valtoztatas) {
        try {
            updateMySQL(valtoztatas);
        } catch (e) { }
        async function updateMySQL(valtoztatas) {
            let origId = idSend;
            keszlet = parseFloat(keszlet) + valtoztatas;
            keszletsum = parseFloat(keszletsum) + valtoztatas * kiszereles;
            /* if (kiszerelesId == 2) {
                cl = parseInt(cl);
                sumcl = parseInt(sumcl) + valtoztatas * cl;
            } else {
                cl = cl;
                sumcl = parseInt(sumcl) + valtoztatas;
            } */

            //INFO:
            for (productNew of state.alapanyagok) {
                if ((productNew.id = origId)) {
                    productNew.keszlet = keszlet;
                    //productNew.cl = cl;
                    productNew.keszletsum = keszletsum;
                }
            }

            const response = await fetch("/updatealapanyagbeszerzes/", {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    id: idSend,
                    keszlet: keszlet,
                    keszletsum: keszletsum,
                }),
            });
            console.log(response);
        }
    }

    /* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
    //INFO:
    //INFO:
    window.location.href = "/admin";
    //INFO:
    //INFO:
}

/* NOTE: INPUT NotNull !!!! NOTE: */

/* NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: NOTE: */

console.log("Ez az adminisztációs Js ami pl figyeli az input mezőket");
console.log("🤔😋😋😋😋😋🤔😎😎😎");
function alapanyagok() {
    console.log("errererererere");
}
