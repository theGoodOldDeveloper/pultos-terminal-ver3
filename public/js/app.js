const users = [];
const passwords = [];
var pultosNumber = -1;

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

    //disable input from typing

    $("#password").keypress(function () {
        return false;
    });

    //add password
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

    /* INFO: ENTER */
    $("#enter").click(function () {
        const psw = input_value.val();
        /* NOTE:localStorage */
        localStorage.setItem("password", psw);
        console.log("localStroage data: " + localStorage.getItem("password"));
        /* NOTE: */
        console.log("memory data: " + psw);

        /* INFO: na akkor vizsgáljuk meg a belépőt */
        //console.log("ez most az admin");

        for (let i = 0; i < 4; i++) {
            if (passwords[i] == psw) {
                console.log(users[i]);
                /*                 alert(
                    "KI akar belepni?" +
                        users[i] +
                        " akinek a jelszava : " +
                        passwords[i] +
                        "es belepo paswordja : " +
                        psw
                ); */
                /* INFO: ha OK */
                localStorage.setItem("user", users[i]);
                localStorage.setItem("pultos", i);
                pultosNumber = i;
                onPultos();
                $("#pswForm").attr("action", "/pult");
            }
        }
    });
});

/* INFO: FIXME: FIXME: FIXME:NA VÉÉÉÉÉÉGRE 😋😋😋😎 */
/* console.log("ide majd a jsont akarom ...");
        alert("A titkos jelszavad: " + input_value.val() + " added"); */

/* TODO:TODO:TODO: pultos beléptetése TODO:TODO:TODO: */
function onPultos() {
    console.log("pultos beléptetése ...");
    let trFizetesMod = "o";
    trNumber = createTrNumber();
    let megjegyzes = "workTime";
    createTranactionDataOnOff(trNumber, trFizetesMod, megjegyzes);
}

/* TODO:TODO:TODO: onOffPultos tárolása TODO:TODO:TODO: */
function createTranactionDataOnOff(trNumber, trFizetesMod, megjegyzes) {
    try {
        updateMySQL();
    } catch (e) { }
    async function updateMySQL() {
        datum = theTime();
        const response = await fetch("/inserttransactions/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                trnumber: trNumber,
                trdate: datum,
                trfizetesmod: trFizetesMod,
                megjegyzes: megjegyzes,
                pultos: pultosNumber,
                kibeosszeg: 0,
                kibeosszegbeszar: 0,
            }),
        });
    }
}

/* TODO:TODO:TODO: theTime TODO:TODO:TODO: */
function theTime() {
    var xDatum = new Date().toLocaleString();
    return xDatum;
}
/* TODO:TODO:TODO: CREATE TR NUMBER TODO:TODO:TODO: */
function createTrNumber() {
    trNumberDatum = new Date();
    trNumber =
        trNumberDatum.getFullYear() +
        "." +
        (trNumberDatum.getMonth() + 1) +
        "." +
        trNumberDatum.getDate() +
        "." +
        trNumberDatum.getHours() +
        "." +
        trNumberDatum.getMinutes() +
        "." +
        trNumberDatum.getSeconds() +
        "." +
        trNumberDatum.getMilliseconds();
    return trNumber;
}
