const datumTokenIdActual = createDatumToken();
var datumTokenIdOriginal;
const state = {
    alapanyagok: [],
    pultbanVan: [],
};
var beforeLeltar = []

var localLeltarozottKeszlet = [];
var localLeltarozottKeszletSum = [];
getdata();
var pultos = localStorage.getItem("user");
var leltar = localStorage.getItem("leltar");

var pultosHTML = "";
var alapanyagIndex = -1;
var elsoLeltarozandoIndex = -1;
var utolsLeltarozandoIndex = -1;
const leptet = 1;
var nowKeszletDB = 0
var nowKeszletPULT = 0

$("#container").hide();
var elem = document.documentElement;
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
    /* leltar = true; */
    screenChange();
    leltarFelvitel();
}

function test() {
    if (leltar) {
        console.log("LELTAR is TRUE");
    } else {
        console.log("LELTAR is false");
    }
}

function screenChange() {
    $("#openContainer").hide();
    $("#container").show();
    pultosHTML = `Üdv ${pultos} !`;
    document.getElementById("leltarPultos").innerHTML = pultosHTML;
    $("#leltarFeldolgozas").on("click", function () {
        /* FIGYU a DARABSZAM = LOKALLELTARREKESZ * STATE.ALAPANYAGOK[index].GYUJTO */
        /* 
        -meghatarozni a keszletsum -ot
        kiszamolni a keszlet egesz reszet
        letarolni
        */
        alapanyagIndex = 0
        var data = [];
        var dataLocal = [];
        for (alapanyag of state.alapanyagok) {
            //INFO: ez a darabszam
            if (alapanyag.leltarozando == 1) { localLeltarozottKeszlet[alapanyagIndex] = (localLeltarREKESZ[alapanyagIndex] * alapanyag.gyujto) + localLeltarDB[alapanyagIndex] } else {
                localLeltarozottKeszlet[alapanyagIndex] = Math.round(alapanyag.keszletsum / alapanyag.kiszereles * 100) / 100
            }
            //INFO: ez a keszletsum
            localLeltarozottKeszletSum[alapanyagIndex] = Math.round((localLeltarozottKeszlet[alapanyagIndex] * alapanyag.kiszereles + localLeltarPult[alapanyagIndex]) * 100) / 100

            data.push({ id: alapanyag.id, keszlet: (localLeltarozottKeszlet[alapanyagIndex]), keszletsum: (localLeltarozottKeszletSum[alapanyagIndex]) })

            dataLocal.push({ id: alapanyag.id, keszlet: (localLeltarozottKeszlet[alapanyagIndex]), keszletsum: (localLeltarozottKeszletSum[alapanyagIndex]) })

            alapanyagIndex++
        }
        beforeLeltar = JSON.parse(localStorage.getItem("beforeLELTARsumBD"))
        leltarTarol()
        refreshJSON()

        getAfterData()
        async function getAfterData() {
            var response = await fetch("/datareadalapanyagok");
            state.alapanyagok = await response.json();
            var index = 0
            //var beforeLeltar = []
            //beforeLeltar = JSON.parse(localStorage.getItem("beforeLELTARsumBD"))
            sendLeltarHTML = ''

            console.log('state.alapanyagok---------😛😛😛-----------')
            console.log('localStorage.getItem("beforeLELTARsumBD"')
            console.log(JSON.parse(localStorage.getItem("beforeLELTARsumBD")))
            console.log('state.alapanyagok--------------------')
            console.log(state.alapanyagok)
            console.log('state.alapanyagok--------------------')
            console.log('dataLocal')

            let elteresDB = 0
            let elteresMOD = 0
            for (alapanyag of state.alapanyagok) {
                if (alapanyag.keszletsum != beforeLeltar[index]) {
                    elteresDB = Math.trunc((alapanyag.keszletsum - beforeLeltar[index]) / alapanyag.kiszereles)
                    sendLeltarHTML += `${alapanyag.nev} : ${Math.round((alapanyag.keszletsum - beforeLeltar[index]) * 100) / 100}  ${alapanyag.mertekegyseg}<br>${elteresDB} db<br>`
                    /* if ((alapanyag.keszletsum - beforeLeltar[index]) != 0) {
                        elteresMOD = Math.round(((alapanyag.keszletsum - beforeLeltar[index]) - elteresDB * alapanyag.kiszereles) / 100) * 100
                        sendLeltarHTML += " / " + elteresMOD + "liter"
                    } */

                    console.log("nemOK")
                    console.log(alapanyag.keszletsum)
                    console.log(beforeLeltar[index])
                    console.log("----------------------")
                }
                index++
            }
            console.log(sendLeltarHTML)
            console.log(dataLocal[index].pultos, (dataLocal[index].datumTokenId).toLocaleDateString())
            console.log(dataLocal)

        }

        function leltarTarol() {
            datumTokenId = new Date()
            dataLocal.push({ pultos: pultos, datumTokenId: datumTokenId })

            updateLeltar();

            async function updateLeltar() {
                await fetch("/updateleltar", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        data: dataLocal,
                        beforeLeltar: beforeLeltar,
                    }),

                });

            }
        }

        localStorage.setItem("leltar", false);
        localLeltarDB = [];
        localLeltarREKESZ = [];
        localLeltarPult = [];
        localLeltarozottKeszlet = [];
        window.location.href = "/";
    });
    $("#kilepes").on("click", function () {
        window.location.href = "/";
    });
    $("#leltarozottDB").on("click", function () {
        document.getElementById("csLeltarozottDB").value = 0;
    });
    $("#leltarozottREKESZ").on("click", function () {
        document.getElementById("leltarozottREKESZ").value = 0;
    });
    $("#leltarozottPULT").on("click", function () {
        document.getElementById("leltarozottPULT").value = 0;
    });
}

async function refreshJSON() {
    let data = []
    //state.pultbanVan[id] = pultbanVan
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

function leltarFelvitel() {
    alapanyagIndex = elsoLeltarozandoIndex;
    renderAlapanyag();

    $("#leptetElore").on("click", function () {
        v_leltarozottDB = parseInt(
            document.getElementById("csLeltarozottDB").value
        ) + parseInt(
            document.getElementById("pultbanvan").value
        )
        v_leltarozottREKESZ = parseInt(
            document.getElementById("leltarozottREKESZ").value
        );
        v_leltarozottPULT = parseFloat(
            document.getElementById("leltarozottPULT").value
        );
        state.pultbanVan[state.alapanyagok[alapanyagIndex].id] = parseInt(document.getElementById('pultbanvan').value)

        if (!v_leltarozottDB) {
            v_leltarozottDB = 0;
        }
        if (!v_leltarozottREKESZ) {
            v_leltarozottREKESZ = 0;
        }
        if (!v_leltarozottPULT) {
            v_leltarozottPULT = 0;
        }

        localLeltarDB[alapanyagIndex] = v_leltarozottDB;
        localLeltarREKESZ[alapanyagIndex] = v_leltarozottREKESZ;
        localLeltarPult[alapanyagIndex] = v_leltarozottPULT;
        //VERSION-2:
        state.alapanyagok[alapanyagIndex].keszletsum = Math.round(localLeltarDB[alapanyagIndex]
            * state.alapanyagok[alapanyagIndex].kiszereles * 100) / 100 + localLeltarPult[alapanyagIndex]
        //VERSION-2:
        saveLocalStorageLeltarData(
            alapanyagIndex,
            v_leltarozottDB,
            v_leltarozottREKESZ,
            v_leltarozottPULT
        );
        if (alapanyagIndex <= utolsLeltarozandoIndex) {
            if (alapanyagIndex == utolsLeltarozandoIndex) {
                alapanyagIndex = utolsLeltarozandoIndex;
            } else {
                alapanyagIndex += 1;
            }
            for (i = alapanyagIndex; i <= state.alapanyagok.length - 1; i++) {
                alapanyagIndex = i;
                if (state.alapanyagok[i].leltarozando == 1) {
                    renderAlapanyag();
                    break;
                }
            }
        }
    });

    $("#leptetHatra").on("click", function () {
        v_leltarozottDB = parseInt(
            document.getElementById("csLeltarozottDB").value
        ) + parseInt(
            document.getElementById("pultbanvan").value
        )
        v_leltarozottREKESZ = parseInt(
            document.getElementById("leltarozottREKESZ").value
        );
        v_leltarozottPULT = parseFloat(
            document.getElementById("leltarozottPULT").value
        );
        state.pultbanVan[state.alapanyagok[alapanyagIndex].id] = parseInt(document.getElementById('pultbanvan').value)
        if (!v_leltarozottDB) {
            v_leltarozottDB = 0;
        }
        if (!v_leltarozottREKESZ) {
            v_leltarozottREKESZ = 0;
        }
        if (!v_leltarozottPULT) {
            v_leltarozottPULT = 0;
        }

        localLeltarDB[alapanyagIndex] = v_leltarozottDB;
        localLeltarREKESZ[alapanyagIndex] = v_leltarozottREKESZ;
        localLeltarPult[alapanyagIndex] = v_leltarozottPULT;
        //VERSION-2:
        state.alapanyagok[alapanyagIndex].keszletsum = Math.round(localLeltarDB[alapanyagIndex]
            * state.alapanyagok[alapanyagIndex].kiszereles * 100) / 100 + localLeltarPult[alapanyagIndex]
        //VERSION-2:
        saveLocalStorageLeltarData(
            alapanyagIndex,
            v_leltarozottDB,
            v_leltarozottREKESZ,
            v_leltarozottPULT
        );
        if (alapanyagIndex >= elsoLeltarozandoIndex) {
            if (alapanyagIndex == elsoLeltarozandoIndex) {
                alapanyagIndex = elsoLeltarozandoIndex;
            } else {
                alapanyagIndex -= 1;
            }
            for (i = alapanyagIndex; i >= 0; i--) {
                alapanyagIndex = i;
                if (state.alapanyagok[i].leltarozando == 1) {
                    renderAlapanyag();
                    break;
                }
            }
        }
    });
}

function renderAlapanyag() {
    nowKeszletDB = Math.trunc(Math.round(localLeltarDB[alapanyagIndex] * 100) / 100)

    nowKeszletPULT = ((state.alapanyagok[alapanyagIndex].keszletsum - Math.round(nowKeszletDB * state.alapanyagok[alapanyagIndex].kiszereles * 100) / 100))
    nowKeszletPULT = Math.round(nowKeszletPULT * 100) / 100
    localLeltarPult[alapanyagIndex] = nowKeszletPULT
    document.getElementById("alapanyagNev").innerHTML =
        state.alapanyagok[alapanyagIndex].nev;
    document.getElementById("csLeltarozottDB").value = parseInt(
        nowKeszletDB
    ) - parseInt(state.pultbanVan[state.alapanyagok[alapanyagIndex].id])
    document.getElementById("leltarozottPULT").value = parseFloat(
        nowKeszletPULT
    );
    document.getElementById("leltarozottREKESZ").value = parseInt(
        localLeltarREKESZ[alapanyagIndex]
    );
    if (state.pultbanVan[state.alapanyagok[alapanyagIndex].id] == null) {
        state.pultbanVan[state.alapanyagok[alapanyagIndex].id] = 0
    }
    document.getElementById("pultbanvan").value = parseInt(
        state.pultbanVan[state.alapanyagok[alapanyagIndex].id]
    );

    ("state.alapanyagok😣😣😣😣😣😣[alapanyagIndex].mertekegyseg");

    state.alapanyagok[alapanyagIndex].mertekegyseg == "darab"
        ? (document.getElementById("dbORliter").innerHTML = "DARAB")
        : (document.getElementById("dbORliter").innerHTML = "ÜVEG / HORDÓ ...");

    if (state.alapanyagok[alapanyagIndex].mertekegyseg == "darab") {
        $(".pult").hide();
    } else {
        $(".pult").show();
    }
    if (state.alapanyagok[alapanyagIndex].gyujto < 2) {
        $(".gyujto").hide();
    } else {
        $(".gyujto").show();
    }
}

function firstLocalStorage() {
    let temp = [];
    if (localStorage.getItem("localLeltarDB")) {
    } else {
        localStorage.setItem("localLeltarDB", JSON.stringify(temp));
    }
    if (localStorage.getItem("localLeltarPult")) {
    } else {
        localStorage.setItem("localLeltarPult", JSON.stringify(temp));
    }
    if (localStorage.getItem("localLeltarREKESZ")) {
    } else {
        localStorage.setItem("localLeltarREKESZ", JSON.stringify(temp));
    }
    if (localStorage.getItem("leltar")) {
    } else {
        localStorage.setItem("leltar", false);
    }
}

function newOldLeltar() {
    if (leltar == "false" || datumTokenIdOriginal != datumTokenIdActual) {
        let i = 0;
        localLeltarDB = [];
        localLeltarREKESZ = [];
        localLeltarPult = [];
        beforeLELTARsumBDdata = []
        for (item of state.alapanyagok) {
            localLeltarDB.push(item.keszlet);
            localLeltarREKESZ.push(0);
            localLeltarPult.push(0);
            beforeLELTARsumBDdata.push(item.keszletsum)
            i++;
        }
        localStorage.setItem("beforeLELTARsumBD", JSON.stringify(beforeLELTARsumBDdata))
        localStorage.setItem("localLeltarDB", JSON.stringify(localLeltarDB));
        localStorage.setItem(
            "localLeltarREKESZ",
            JSON.stringify(localLeltarREKESZ)
        );
        localStorage.setItem(
            "localLeltarPult",
            JSON.stringify(localLeltarPult)
        );
        localStorage.setItem("datumTokenId", datumTokenIdActual);
    } else {
        localLeltarDB = JSON.parse(localStorage.getItem("localLeltarDB"));
        localLeltarREKESZ = JSON.parse(
            localStorage.getItem("localLeltarREKESZ")
        );
        localLeltarPult = JSON.parse(localStorage.getItem("localLeltarPult"));
    }
}

function saveLocalStorageLeltarData(index, darab, rekesz, pult) {
    localStorage.setItem("leltar", true);
    let sumDB = 0
    let itemKeszletSum = 0
    let id = 0
    localLeltarDB[index] = darab;
    localLeltarREKESZ[index] = rekesz;
    localLeltarPult[index] = pult;

    sumDB = (rekesz * state.alapanyagok[alapanyagIndex].gyujto) + darab

    itemKeszletSum = Math.round((sumDB * state.alapanyagok[alapanyagIndex].kiszereles + pult) * 100) / 100
    id = state.alapanyagok[alapanyagIndex].id
    updateLeltarDatabase(id, sumDB, itemKeszletSum)
    async function updateLeltarDatabase(id, keszlet, keszletsum) {
        await fetch("/updatealapanyagok", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                keszlet: keszlet,
                keszletsum: keszletsum,
            }),
        });
    }
    localStorage.setItem("localLeltarDB", JSON.stringify(localLeltarDB));
    localStorage.setItem(
        "localLeltarREKESZ",
        JSON.stringify(localLeltarREKESZ)
    );
    localStorage.setItem("localLeltarPult", JSON.stringify(localLeltarPult));
}

async function getdata() {
    var response = await fetch("/datareadalapanyagok");
    state.alapanyagok = await response.json();
    response = await fetch("/pultbanvan");
    state.pultbanVan = await response.json();
    firstLocalStorage();
    indexFirstLast();
    localLeltarDB = JSON.parse(localStorage.getItem("localLeltarDB"));
    localLeltarREKESZ = JSON.parse(localStorage.getItem("localLeltarREKESZ"));
    localLeltarPult = JSON.parse(localStorage.getItem("localLeltarPult"));
    datumTokenIdOriginal = JSON.parse(localStorage.getItem("datumTokenId"));
    newOldLeltar();
}

function indexFirstLast() {
    let i = 0;
    for (melyik of state.alapanyagok) {
        if (melyik.leltarozando == 1) {
            if (elsoLeltarozandoIndex == -1) {
                elsoLeltarozandoIndex = i;
            }

            utolsLeltarozandoIndex = i;
        }
        i++;
    }
}

function createDatumToken() {
    const datumToken = new Date();
    let datumTokenIdActual =
        datumToken.getFullYear().toString() +
        datumToken.getMonth().toString() +
        datumToken.getDate().toString();
    return datumTokenIdActual;
}

