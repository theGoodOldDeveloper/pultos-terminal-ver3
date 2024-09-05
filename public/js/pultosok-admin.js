/* INFO: termék adatok bekérése START INFO: */

const state = {
    pultosokPSW: [],
};
var pultosokHTML = "";
var otevesTerv = 0

getdata();

async function getdata() {
    /* NOTE: get admin INFO: INFO: INFO:*/
    var response = await fetch("/pultosokadminpsw");
    state.pultosokPSW = await response.json();
    if (state.pultosokPSW.length < 6) {
        console.log('NEM letezik')
    }
    var index = 0;
    for (let pultosPSW of state.pultosokPSW) {
        if (index < 4) {
            pultosokHTML += `<div class="card bg-success text-white m-2 p-3" style="width:700px" id=${index}>
            <form>
            <label>Pultos neve :</label>
            <input type="text" value= "${pultosPSW.name}" id=newName${index} >
            <label>PIN kódja :</label>
            <input type="text" value= "${pultosPSW.pin}" id=newPin${index}>
            </form>
            </div>`;
        }
        if (index == 4 && state.pultosokPSW.length < 6) {
            pultosokHTML += `<div class="card bg-danger text-white ml-2 mt-4 p-3" style="width:700px" id=${index}>
            <form>
            <label>Adminisztrátor neve :</label>
            <input type="text" value=  "${pultosPSW.name}" id=newName${index}>
            <label>JELSZAVA :</label>
            <input type="text" value= "${pultosPSW.pin}" id=newPin${index}>
            </form>
            </div>
            <div class="text-center" style="width:700px">
            <br>
            <label>A TERV :</label>
            <input type="number" value= "${pultosPSW.pin}" id=newPin${index + 1}>
            </div>`}
        if (index == 4 && state.pultosokPSW.length == 6) {
            pultosokHTML += `<div class="card bg-danger text-white ml-2 mt-4 p-3" style="width:700px" id=${index}>
            <form>
            <label>Adminisztrátor neve :</label>
            <input type="text" value=  "${pultosPSW.name}" id=newName${index}>
            <label>JELSZAVA :</label>
            <input type="text" value= "${pultosPSW.pin}" id=newPin${index}>
            </form>
            </div>
            `}
        if (index == 5) {
            let akarmi = (parseInt(pultosPSW.pin))
            /* let akarmi = (pultosPSW.pin).toLocaleString("hu-HU", {
                maximumFractionDigits: 0,
            }) */
            pultosokHTML +=
                `<div class="text-center" style="width:700px">
            <br>
            <label>A TERV :</label>
            <input type="text" value= "${akarmi}" id=newPin${index}>
            </div>`;
        }
        index++;
    }

    pultosokHTML += `<button type="button" class="btn btn-primary btn-block ml-2 mt-4 p-3 " style="width:700px" onclick="pultosokAdminTarol()">Tárolom</button>`;
    document.getElementById("pultosokList").innerHTML = pultosokHTML;
}
function pultosokAdminTarol() {
    var data = [];
    var newPinData = "";
    var newPinName = "";
    for (let index = 0; index < 5; index++) {
        newPinData = document.getElementById("newPin" + index).value;
        newPinName = document.getElementById("newName" + index).value;
        data.push({ pin: newPinData, name: newPinName });
    }
    otevesTerv = parseInt(document.getElementById('newPin5').value)
    data.push({ pin: otevesTerv, name: 'otevesTerv' })
    updatePultosokFe();

    async function updatePultosokFe() {
        await fetch("/updatepultosok", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ data: data }),
        });
    }
    //alert("Tesztelés alatt!!! 😊");
    //window.location.href = "http://localhost:7766";
    //window.location.href = "http://photovegh.synology.me:7766/";
}
