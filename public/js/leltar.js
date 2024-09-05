console.log("leltar.js is OK");
var datumTokenId = "";
createDatumToken();
firstLocalStorage();
const users = [];
const passwords = [];
const state = {
    pultosokPSW: [],
};

getdata();
async function getdata() {
    /* NOTE: get admin INFO: INFO: INFO:*/
    var response = await fetch("/pultosokadminpsw");
    state.pultosokPSW = await response.json();
    for (let pultosPSW of state.pultosokPSW) {
        users.push(pultosPSW.name);
        passwords.push(pultosPSW.pin);
    }
}

$(document).ready(function () {
    const input_value = $("#password");
    $("#password").keypress(function () {
        return false;
    });
    $(".calc").click(function () {
        let value = $(this).val();
        field(value);
    });
    function field(value) {
        input_value.val(input_value.val() + value);
    }
    $("#clear").click(function () {
        input_value.val("");
    });
    $("#enter").click(function () {
        const psw = input_value.val();
        localStorage.setItem("password", psw);
        console.log("localStroage data: " + localStorage.getItem("password"));
        console.log("memory data: " + psw);
        for (let i = 0; i < 4; i++) {
            if (passwords[i] == psw) {
                console.log(users[i]);
                localStorage.setItem("user", users[i]);
                localStorage.setItem("pultos", i);
                $("#pswForm").attr("action", "/leltarozas");
            }
        }
    });
});

function firstLocalStorage() {
    let temp = [];
    if (localStorage.getItem("localLeltarDB")) {
        console.log("leeetezik **localLeltarDB**");
        console.log(JSON.parse(localStorage.getItem("localLeltarDB")));
    } else {
        console.log("NEM  ------localLeltarDB----- leeetezik");
        localStorage.setItem("localLeltarDB", JSON.stringify(temp)); //VERSION-2:
    }
    if (localStorage.getItem("localLeltarPult")) {
        console.log("leeetezik **localLeltarPult**");
        console.log(JSON.parse(localStorage.getItem("localLeltarPult")));
    } else {
        console.log("NEM  ------localLeltarPult----- leeetezik");
        localStorage.setItem("localLeltarPult", JSON.stringify(temp)); //VERSION-2:
    }
    if (localStorage.getItem("localLeltarREKESZ")) {
        console.log("leeetezik **localLeltarREKESZ**");
        console.log(JSON.parse(localStorage.getItem("localLeltarREKESZ")));
    } else {
        console.log("NEM  ------localLeltarREKESZ----- leeetezik");
        localStorage.setItem("localLeltarREKESZ", JSON.stringify(temp)); //VERSION-2:
    }
    if (localStorage.getItem("leltar")) {
        console.log("leeetezik **leltar**");
        console.log(localStorage.getItem("leltar"));
    } else {
        console.log("NEM  ------leltar----- leeetezik");
        localStorage.setItem("leltar", false);
        /* newOldLeltar(); */
    }
    if (localStorage.getItem("datumTokenId")) {
        console.log("leeetezik **datumTokenId**");
        console.log(localStorage.getItem("datumTokenId"));
    } else {
        console.log("NEM  ------datumTokenId----- leeetezik");
        localStorage.setItem("datumTokenId", datumTokenId);
    }
}

function createDatumToken() {
    const datumToken = new Date();
    datumTokenId =
        datumToken.getFullYear().toString() +
        datumToken.getMonth().toString() +
        datumToken.getDate().toString();
}

/* INFO: FIXME: FIXME: FIXME:NA VÉÉÉÉÉÉGRE 😋😋😋😎 */
/* console.log("ide majd a jsont akarom ...");
        alert("A titkos jelszavad: " + input_value.val() + " added"); */

//VERSION-2:
/* var leltar = false;
function pinKod() {
    console.log("mia fa...mat csinlaljak????");
    window.location.href = "/leltarozas";
}
var elem = document.documentElement;
function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { */
/* Safari */
/*       elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { */
/* IE11 */
/*        elem.msRequestFullscreen();
    }
    document.body.innerHTML = "";
    leltar = true;
    pinKod();
}
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { */
/* Safari */
/*    document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { */
/* IE11 */
/*    document.msExitFullscreen();
    }
}
function test() {
    if (leltar) {
        console.log("LELTAR is TRUE");
    }
}
 */
