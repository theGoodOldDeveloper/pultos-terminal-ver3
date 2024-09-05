const state = {
    pultosokPSW: [],
};
var pultosPSW = []
var pultosName = []
getdata();
async function getdata() {
    var response = await fetch("/pultosokadminpsw");
    state.pultosokPSW = await response.json();
    renderAutentication()
}


function renderAutentication() {
    for (index = 0; index < 5; index++) {
        pultosName.push(state.pultosokPSW[index].name)
        pultosPSW.push(state.pultosokPSW[index].pin)
    }
    if (pultosPSW[4] == 'admin') {
        let messageHTML = `
        <div class="card bg-warning " style="width: 41%; margin:auto; padding: 1%;">
                <h4>Figyelem!</h4>
                <h5>A felhaszáló default neve és jelszava</h5>
                <h4 class="font-weight-bolder text-danger "> admin </h4>
                <h5>Változtasd meg!</h5>
            </div>
        `
        document.getElementById('message').innerHTML = messageHTML
    }
}
function adminLogin() {
    let validName = state.pultosokPSW[4].name
    let valinPsw = state.pultosokPSW[4].pin
    let inputName = document.getElementById('userName').value
    let inputPsw = document.getElementById('psw').value
    console.log(validName, valinPsw, inputName, inputPsw)
    if (validName == inputName && valinPsw == inputPsw) {
        window.location.href = '/admin'

    } else {
        alert('Vagy a név, vagy a jelszó nem stimmel! ☹')
    }
}
