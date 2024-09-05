const state = {
    termekek: [],
    alapanyagok: [],
    osszetevok: [],
};
var termekHaszon = []
const selectColor = [
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
    "dark",
    "light",
];
var selectName = [];
var productsHTML = "";
var productsHTMLdrop = "";
var xid = 1;
var newBtncolor = 0;
var origNev = "";
var origElar = 0;
var origBtncolor = 0;
var origId = 0;
var osszetevoAlapanyagId = -1;
var osszetevoFelhasznaltMennyiseg = -1;
var newTermek = false;

getdata();

/* INFO: adatok bekérése START INFO: */
async function getdata() {
    /* NOTE: get datareadalapanyagok HACK:HACK: */
    var response = await fetch("/datareadalapanyagok");
    state.alapanyagok = await response.json();

    /* NOTE: get datareadtermekek INFO: INFO: INFO:*/
    var response = await fetch("/datareadtermekek");
    state.termekek = await response.json();

    /* NOTE: get datareadosszetevok INFO: INFO: INFO:*/
    var response = await fetch("/datareadosszetevok");
    state.osszetevok = await response.json();

    /* NOTE: get categories */
    var response = await fetch("/categories");
    selectName = await response.json();

    haszon()

    rendertermekek();
}
async function getdataKatto() {
    /* NOTE: get datareadtermekek INFO: INFO: INFO:*/
    var response = await fetch("/datareadtermekek");
    state.termekek = await response.json();
}

function rendertermekek() {
    let index = 0;
    let productPercent = 0
    termekekHTML = "";
    for (let termek of state.termekek) {
        productPercent = Math.round((termek.elar - termekHaszon[termek.id]) / termekHaszon[termek.id] * 100)
        termekekHTML += `<tr >
        <td>${termek.id}</td>
        <td class="text-left">${termek.nev}</td>
        <td class="text-right">${Math.round(termek.elar)}</td>
        <td class="text-right">${Math.round(termek.elar - termekHaszon[termek.id])}</td>
        <td  class="text-right">${productPercent}</td>
        <td><button type="button" class="btn btn-${selectColor[termek.btncolor]
            }" style = "width: 8em">${selectName[termek.btncolor]}</button></td>
        <td class="text-right">${termek.visiblesequence}</td>
        <td><button class="updateBtn" id=${termek.id}>Edit</td>
        </tr>
        `;
        index++;
        xid = termek.id;
    }
    document.getElementById("termekek").innerHTML = termekekHTML;
    $("#addNewBtn")
        .off("click")
        .on("click", function () {
            document.getElementById("newTermek").innerHTML = "";
            document.getElementById(
                "newTermek"
            ).innerHTML = `<table class="table table-striped text-center">
            <thead>
                <tr>
                    <th>Neve</th>
                    <th>Eladási ár</th>
                    <th>Szinezése</th>
                </tr>
                <tr>
                    <td><input type="text" name="tNev" id="tNev"></td>
                    <td><input type="number" name="tEladasi" id="tEladasi" style="width: 7em"></td>
                    <td>
                        <input type="radio" id="primary" name="termekColor" value=0 checked>
                          <label for="primary" class="bg-primary text-white xtermekColor ">${selectName[0]}</label>
                          <input type="radio" id="szurke" name="termekColor" value=1>
                          <label for="szurke" class="bg-dark text-white xtermekColor">${selectName[1]}</label>
                          <input type="radio" id="zold" name="termekColor" value=2>
                          <label for="zold" class="bg-success text-white xtermekColor">${selectName[2]}</label>
                          <input type="radio" id="sarga" name="termekColor" value=3>
                          <label for="sarga" class="bg-warning text-white xtermekColor">${selectName[3]}</label>
                          <input type="radio" id="danger" name="termekColor" value=4>
                          <label for="danger" class="bg-danger text-white xtermekColor">${selectName[4]}</label>
                          <input type="radio" id="fekete" name="termekColor" value=5>
                          <label for="fekete" class="bg-dark text-white xtermekColor">${selectName[5]}</label>
                          <input type="radio" id="feher" name="termekColor" value=6>
                          <label for="feher" class="bg-light text-dark xtermekColor">${selectName[6]}</label>
                    </td>
                </tr>
            </thead>
        </table> <input type="button" value="MENTÉS" id="cosnsoleWrite" class="btn btn-danger m-4">
        `;
            $("#cosnsoleWrite").click(function () {
                var nev = document.getElementById("tNev").value;
                var elar = document.getElementById("tEladasi").value;
                const colorNumber = document.querySelectorAll(
                    'input[name="termekColor"]'
                );
                var btncolor = "*";
                for (selected of colorNumber) {
                    if (selected.checked) {
                        btncolor = selected.value;
                    }
                }
                inserttermekek(nev, elar, btncolor);
            });
        });
    $(".updateBtn").click(function () {
        let arrowIndex = -1;
        for (let i = 0; i < state.termekek.length; i++) {
            if (state.termekek[i].id == this.id) {
                arrowIndex = i;
            }
        }
        origNev = state.termekek[arrowIndex].nev;
        origElar = state.termekek[arrowIndex].elar;
        var origBtncolor = state.termekek[arrowIndex].btncolor;
        newBtncolor = origBtncolor;
        origId = state.termekek[arrowIndex].id;
        $("#myModalTermek").modal();
        document.getElementById("newNev").value = origNev;
        document.getElementById("newElar").value = origElar;
        renderBtnColor(origBtncolor);
        renderOsszetevok();
        const colorBtn = document.querySelector("#btnColorForm");
        colorBtn.onchange = function () {
            var x = document.getElementById("btnColorForm").value;
            newBtncolor = parseInt(selectColor.findIndex(checkColor));
            function checkColor(colorArrayNumber) {
                return colorArrayNumber == x;
            }
        };
    });
}
function renderOsszetevok() {
    osszetevokHTML = ``;
    osszetevokHTML += `<table class="table table-striped">
    <thead>
        <tr>
            <th>Id</th>
            <th>Alapag</th>
            <th>Neve</th>
            <th>Kiszerelés jelleg</th>
            <th>Kiszerelés</th>
            <th>Felhasznált mennyiség</th>
        </tr>
    </thead>
    <tbody>`;
    for (osszetevo of state.osszetevok) {
        if (origId == osszetevo.termek_id) {
            /* osszetevokHTML += `${osszetevo.alapanyag_id}`; */
            for (alapanyag of state.alapanyagok) {
                if (alapanyag.id == osszetevo.alapanyag_id) {
                    osszetevokHTML += `
                    <tr>
                    <td id="otid">${osszetevo.id}</td>
                    <td id="otid">${alapanyag.id}</td>
                    <td id="otnev">${alapanyag.nev}</td>
                    <td id="otjelleg">${alapanyag.mertekegyseg}</td>
                    <td id="otkiszereles">${alapanyag.kiszereles}</td>
                    <td id="otfelhasznalt">${osszetevo.felhasznaltmennyiseg}</td>
                    <td><button class="btn btn-danger deleteBtn" id=${osszetevo.id}>DELETE</td>
                    </tr>`;
                }
            }
        }
    }
    osszetevokHTML += `</tbody></table><button type="button" class="btn btn-warning " id="addOsszetevo">Alapanyag hozzáadása</button>`;
    document.getElementById("osszetevok").innerHTML = osszetevokHTML;

    $(".deleteBtn").click(function () {
        id = this.id;
        deleteOsszetevokMySQL();
        async function deleteOsszetevokMySQL() {
            await fetch("/deleteosszetevo/" + id, {
                method: "DELETE",
            });
            await getdata();
            await renderOsszetevok();
        }
    });

    $("#addOsszetevo").click(function () {
        $("#myModalAdd").modal();
        selectOsszetevokHTML = "";
        let index = 0;
        for (alapanyag of state.alapanyagok) {
            selectOsszetevokHTML += `<button type="button" class="btn btn-outline-dark m-2 selected" data-kiszereles=${alapanyag.kiszereles} data-nev="${alapanyag.nev}" id=${alapanyag.id}>${alapanyag.nev}</button>`;
            index++;
        }
        document.getElementById("selectOsszetevo").innerHTML =
            selectOsszetevokHTML;

        $(".selected").click(function (e) {
            osszetevoAlapanyagId = this.id;
            alapanyagKiszereles = e.target.dataset.kiszereles;
            alapanyagNev = e.target.dataset.nev;
            $("#myModalAdd .close").click();
            $("#myModalFelhasznalt").modal();
            document.getElementById("felhasznalt").value = alapanyagKiszereles;
            document.getElementById("felhasznaltNev").innerHTML = alapanyagNev;
            $("#felhasznaltBTN")
                .off("click")
                .on("click", function () {
                    insertOsszetevokMySQL();
                });
            async function insertOsszetevokMySQL() {
                termek_id = origId;
                alapanyag_id = osszetevoAlapanyagId;
                felhasznaltmennyiseg =
                    document.getElementById("felhasznalt").value;
                await fetch("/insertosszetevok/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({
                        termek_id: termek_id,
                        alapanyag_id: alapanyag_id,
                        felhasznaltmennyiseg: felhasznaltmennyiseg,
                    }),
                });
                await getdata();
                await renderOsszetevok();
            }
        });
    });
}
function renderBtnColor(origBtncolor) {
    document.getElementById(
        "selectCategoryColor"
    ).innerHTML = `<select id=btnColorForm "
    name="btnColorForm" form="btnColorForm" >
    <option value="primary" class="bg-primary text-white" ${origBtncolor == 0 ? "selected" : ""
        }>${selectName[0]}</option>
    <option value="secondary" class="bg-secondary text-white" ${origBtncolor == 1 ? "selected" : ""
        }>${selectName[1]}</option>
    <option value="success" class="bg-success text-white"${origBtncolor == 2 ? "selected" : ""
        }>${selectName[2]}</option>
    <option value="warning" class="bg-warning text-white" ${origBtncolor == 3 ? "selected" : ""
        }>${selectName[3]}</option>
    <option value="danger" class="bg-danger text-white"${origBtncolor == 4 ? "selected" : ""
        }>${selectName[4]}</option>
    <option value="dark" class="bg-dark text-white" ${origBtncolor == 5 ? "selected" : ""
        }>${selectName[5]}</option>
    <option value="light" class="bg-light text-black" ${origBtncolor == 6 ? "selected" : ""
        }>${selectName[6]}</option>
    </select>`;
}

function figyel() {
    if (document.getElementById("nev").value == "") {
    }
}

function inserttermekek(vnev, velar, vbtncolor) {
    const nev = vnev;
    const elar = velar;
    const btncolor = vbtncolor;
    const urtartalom = 0;
    const visiblesequence = state.termekek.length + 1;
    insertMySQL();
    async function insertMySQL() {
        const response = await fetch("/inserttermek/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                nev: nev,
                elar: elar,
                urtartalom: urtartalom,
                btncolor: btncolor,
                visiblesequence: visiblesequence,
            }),
        });
        await getdataKatto();
        //await getdata();
        await addButton();
        function addButton() {
            var modalHTML = createModal();
            document.getElementById("newTermek").innerHTML =
                `<div class="card"><h1>${nev}</h1><h3>Eladási ár: ${elar}, Id: ${visiblesequence}, ${btncolor}</h3><button type="button" class="btn btn-warning " id="addOsszetevo">
            Alapanyag hozzáadása
        </button></div><div id="selectOsszetevo"></div>` + modalHTML;
        }
        await addOsszetevoKatto();
        function addOsszetevoKatto() {
            $("#addOsszetevo").click(function () {
                $("#myModalAdd").modal();
                selectOsszetevokHTML = "";
                let index = 0;
                for (alapanyag of state.alapanyagok) {
                    selectOsszetevokHTML += `<button type="button" class="btn btn-outline-dark m-2 selected" data-kiszereles=${alapanyag.kiszereles} data-nev="${alapanyag.nev}" id=${alapanyag.id}>${alapanyag.nev}</button>`;
                    index++;
                }
                document.getElementById("selectOsszetevo").innerHTML =
                    selectOsszetevokHTML;

                $(".selected").click(function (e) {
                    osszetevoAlapanyagId = this.id;
                    alapanyagKiszereles = e.target.dataset.kiszereles;
                    alapanyagNev = e.target.dataset.nev;
                    $("#myModalAdd .close").click();
                    $("#myModalFelhasznalt").modal();
                    document.getElementById("felhasznalt").value =
                        alapanyagKiszereles;
                    document.getElementById("felhasznaltNev").innerHTML =
                        alapanyagNev;
                    $("#felhasznaltBTN")
                        .off("click")
                        .on("click", function () {
                            insertOsszetevokMySQL();
                        });
                    async function insertOsszetevokMySQL() {
                        termek_id = visiblesequence;
                        alapanyag_id = osszetevoAlapanyagId;
                        felhasznaltmennyiseg =
                            document.getElementById("felhasznalt").value;
                        await fetch("/insertosszetevok/", {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json",
                            },
                            body: JSON.stringify({
                                termek_id: termek_id,
                                alapanyag_id: alapanyag_id,
                                felhasznaltmennyiseg: felhasznaltmennyiseg,
                            }),
                        });
                        window.location.href = "/termekek-adatlap";
                    }
                });
            });
        }
    }
}
function updatetermekek() {
    const nev = document.getElementById("newNev").value;
    const elar = document.getElementById("newElar").value;
    const btncolor = newBtncolor;
    const urtartalom = 0;
    const visiblesequence = state.termekek.length + 1;
    if (newTermek) {
        try {
            insertMySQL();
            newTermek = false;
        } catch (e) { }
    } else {
        try {
            updateMySQL();
        } catch (e) { }
    }
    newTermek = false;
    async function insertMySQL() {
        id = origId;
        const response = await fetch("/inserttermek/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                nev: nev,
                elar: elar,
                urtartalom: urtartalom,
                btncolor: btncolor,
                visiblesequence: visiblesequence,
            }),
        });
        let arrowIndex = -1;
        for (let i = 0; i < state.termekek.length; i++) {
            if (state.termekek[i].id == id) {
                arrowIndex = i;
            }
        }
        state.termekek[arrowIndex].nev = nev;
        state.termekek[arrowIndex].elar = elar;
        state.termekek[arrowIndex].btncolor = btncolor;
        await getdata();
        await rendertermekek();
    }
    async function updateMySQL() {
        id = origId;
        newTermek = false;
        const response = await fetch("/updatetermekek/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id: id,
                nev: nev,
                elar: elar,
                btncolor: btncolor,
            }),
        });
        //INFO:TODO:INFO://INFO:TODO:INFO://INFO:TODO:INFO:
        // 418 sor utaan visible = 0
        // alapanyagok leltarozando = 0; kritikus = 0
        //INFO:TODO:INFO://INFO:TODO:INFO://INFO:TODO:INFO:
        let arrowIndex = -1;
        for (let i = 0; i < state.termekek.length; i++) {
            if (state.termekek[i].id == id) {
                arrowIndex = i;
            }
        }
        state.termekek[arrowIndex].nev = nev;
        state.termekek[arrowIndex].elar = elar;
        state.termekek[arrowIndex].btncolor = btncolor;
        rendertermekek();
    }
}
function addAlapanyag() {
    document.getElementById("newTermek").innerHTML = "";
}

function createModal() {
    return `<div class="modal" id="myModalFelhasznalt">
    <div class="modal-dialog">
        <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header bg-warning">
                <h4 class="modal-title">Milyen mennyiséget használjak fel?</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">
                <h3 class="card" id="felhasznaltNev"></h3>
                <input type="number" id="felhasznalt" name="felhasznalt">

            </div>

            <!-- Modal footer -->
            <div class="modal-footer bg-warning">
                <button type="button" class="btn btn-info" data-dismiss="modal"
                    id="felhasznaltBTN">Rögzíten</button>
            </div>

        </div>
    </div>
</div>`;
}

function haszon() {
    var alapanyagBeszar = []
    for (var alapanyag of state.alapanyagok) {
        alapanyagBeszar[alapanyag.id] = alapanyag.beszar / alapanyag.kiszereles
    }
    let index = 0
    for (let besz of state.termekek) {
        termekHaszon[besz.id] = 0
        index++
    }
    var mindosszesenBeszar = 0;
    var tombIndex = 0;
    for (var termek of state.termekek) {
        for (var osszetevo of state.osszetevok) {
            if (osszetevo.termek_id == termek.id) {
                termekHaszon[termek.id] += osszetevo.felhasznaltmennyiseg * alapanyagBeszar[osszetevo.alapanyag_id]
            }
        }
    }
}