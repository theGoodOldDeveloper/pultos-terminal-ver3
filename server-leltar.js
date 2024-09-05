setupWeekQuery()
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const conf = dotenv.config();
var cron = require("node-cron");
const fs = require("fs");
var nodemailer = require("nodemailer");
const month = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];

var alapanyagARRAYnev = []
var alapanyagARRAYmertekegyseg = []
var alapanyagARRAYkiszereles = []
var alapanyagARRAYgyujto = []
var alapanyagARRAYkeszletsum = []
var criticalQuantity = false

const sgMail = require("@sendgrid/mail");
var apiKey = conf.parsed.APIKEY;
sgMail.setApiKey(
    conf.parsed.APIKEY
);

console.log('conf.parsed.APIKEY');
console.log(conf.parsed.APIKEY);

var port = conf.parsed.LELTARPORT;
var mysql = require("mysql");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));

var con = mysql.createConnection({
    host: "localhost",
    user: "pultos",
    password: "Terminal-2022",
    database: "pultosterminal",////VERSION-2:
});
con.connect(function (err) {
    if (err) throw err;
    console.log("database conect OK!");
});

/* NOTE: induló képernyő */
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/leltar.html");
});
/* NOTE: leltarozas képernyő */
app.get("/leltarozas", (req, res) => {
    res.sendFile(__dirname + "/views/leltarozas.html");
});
/* NOTE: pultosokadminpsw pultos - psw */
app.get("/pultosokadminpsw", (req, res) => {
    res.sendFile(__dirname + "/psw.txt");
});
/* INFO: pultbanvan */
app.get("/pultbanvan", (req, res) => {
    res.sendFile(__dirname + "/pultbanvan.txt");
});
/* INFO: refreshpultbanvan */
app.post("/refreshpultbanvan", bodyParser.json(), (req, res) => {
    const content = req.body.data;
    fs.writeFile("pultbanvan.txt", JSON.stringify(content), (err) => {
        if (err) {
            console.error(err);
        }
    });
});
// NOTE: /datareadalapanyagok DATA
app.get("/datareadalapanyagok", (req, res) => {
    con.query("SELECT * FROM alapanyagok", (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});
// NOTE: /sendmessage
app.get("/sendmessage", (req, res) => {
    sendMessageHTML = weeklySalesCalculation()
    res.send(sendMessageHTML);

});

/* =========================================================================== */
/* ================= INFO: LELTAR JELENTES INFO: ================= */
// NOTE: /updateleltar
app.post("/updateleltar", bodyParser.json(), (req, res) => {
    const content = req.body.data;
    const beforeLeltar = req.body.beforeLeltar;
    const state = {
        alapanyagok: [],
    }
    fs.writeFile("lastLeltar.txt", JSON.stringify(content), (err) => {
        if (err) {
            console.error(err);
        }
    });

    con.query("SELECT * FROM alapanyagok", (err, data4) => {
        if (err) throw err;
        state.alapanyagok = data4;
        var index = 0
        sendLeltarHTML = ''
        let elteresDB = 0
        let elteresMOD = 0
        for (alapanyag of state.alapanyagok) {
            if (alapanyag.keszletsum != beforeLeltar[index]) {
                elteresDB = Math.trunc((alapanyag.keszletsum - beforeLeltar[index]) / alapanyag.kiszereles)
                sendLeltarHTML += `${alapanyag.nev} : ${Math.round((alapanyag.keszletsum - beforeLeltar[index]) * 100) / 100}  ${alapanyag.mertekegyseg}<br>${elteresDB} db<br>`
                console.log("nemOK")
                console.log(alapanyag.keszletsum)
                console.log(beforeLeltar[index])
                console.log("----------------------")
            }
            index++
        }
        console.log("LELTAR report");
        let sendTextRequired = "required";
        let templateText = "pultosTerminal C2022 LELTAR !!!";
        let templateTime = "leltár jelentés"
        let datum = new Date()
        datum = datum.toLocaleDateString()
        if (sendLeltarHTML != '') {
            console.log('content[index].pultos')
            console.log(content[index].pultos)
            console.log('index')
            console.log(index)
            sendLeltarHTML += `A leltározást végezte: ${content[index].pultos} Dátum: ${datum}`
            //INFO:TODO:INFO:
            sendMailData(sendTextRequired, sendLeltarHTML, templateTime);
            //sendMailDataCopy(sendTextRequired, sendLeltarHTML, templateTime);
        }
    });
});

/* INFO: laststock */
app.get("/laststock", (req, res) => {
    res.sendFile(__dirname + "/lastLeltar.txt");
});

// INFO: /alapanyagok DATA update
app.patch("/updatealapanyagok", bodyParser.json(), (req, res) => {
    var id = req.body.id;
    var keszlet = [req.body.keszlet];
    var keszletsum = [req.body.keszletsum];
    con.query(
        "UPDATE alapanyagok SET keszlet = ?, keszletsum = ? WHERE id = ?",
        [
            keszlet,
            keszletsum,
            id,
        ],
        (err, data) => {
            try {
                res.send(data);
            } catch {
                if (err) throw err;
            }
        }
    );
});

app.listen(port, () => console.log("server is OK 😋 LELTARPORT: " + port));

//VERSION-2:VERSION-2:VERSION-2:
const state = {
    alapanyagReport: [],
    forgalomReport: [],
    fromTermekToAlapanyag: [],
    alapanyagok: [],
    weekReportJSON: [],
    summaAlapagyagWeekJSON: [],
    transactions: [],
    pultosokPSW: [],
};


function getdata() {
    con.query("SELECT * FROM alapanyagok", (err, data) => {
        if (err) throw err;
        state.alapanyagReport = data;
    });
    //INFO:TODO:INFO:con.query("SELECT * FROM forgalom", (err, data2) => {
    con.query("SELECT * FROM forgalom WHERE eladottdate >= ?;",
        [twoMontInterval()],
        (err, data2) => {
            if (err) throw err;
            state.forgalomReport = data2;
            //console.log(state.forgalomReport)
        });
    con.query("SELECT * FROM termekek_has_alapanyagok", (err, data3) => {
        if (err) throw err;
        state.fromTermekToAlapanyag = data3;
    });
    con.query("SELECT * FROM alapanyagok", (err, data4) => {
        if (err) throw err;
        state.alapanyagok = data4;
    });
    //INFO:TODO:INFO:con.query("SELECT * FROM transactions", (err, data5) => {
    con.query("SELECT * FROM transactions WHERE trdate >= ?;",
        [twoMontInterval()],
        (err, data5) => {
            if (err) throw err;
            state.transactions = data5;
            //console.log(state.transactions)
        });

    fs.readFile(__dirname + "/psw.txt", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        state.pultosokPSW = JSON.parse(data)
    });

}

getdata();// BUG: ??? mert az elso futas = 0 BUG:

/* INFO: twoMontInterval */
function twoMontInterval() {
    //console.log(datum, '*******************meeee*********************')
    let intervalDatum = new Date(Date.parse(new Date()) - (48 * 24 * 60 * 60 * 1000))
    let ev = intervalDatum.getFullYear()
    let honap = intervalDatum.getMonth() + 1
    honap = honap < 10 ? "0" + honap : honap
    let nap = intervalDatum.getDate()
    nap = nap < 10 ? "0" + nap : nap

    let twoMonthDate = `${ev}. ${honap}. ${nap}.`
    //console.log('twoMonthDate: ', twoMonthDate)
    return twoMonthDate
}

/* https://crontab.guru/ */

//cron.schedule("0 */1 * * * *", () => {
//    transporter.sendMail(mailOptions, function (err, info) {
//        if (err) console.log(err);
//        else console.log(info);
//    });
//});

/* =========================================================================== */
//cron.schedule("*/5 * * * * *", () => {
//    console.log("runs in every 5 second SendMailData 🥇🥇🥇🥇🥇🥇🥇");
//    sendMailData();
//});

/* ================= mined nap 7-kor INFO: NAPI KRITIKUS INFO: ================= */
cron.schedule("45 6 * * *", () => {
    //VERSION-2:INFO:TODO:INFO:VERSION-2:
    getdata()
});
//cron.schedule("55 16 * * *", () => {
//cron.schedule("*/5 * * * * *", () => {
cron.schedule("0 7 * * *", () => {
    //cron.schedule("*/5 * * * * *", () => {
    //VERSION-2:INFO:TODO:INFO:VERSION-2:
    getdata()
    console.log("runs in on all days at 7 o'clock SendMailData");
    let sendTextRequired = "required";
    let templateText = "pultosTerminal C2022 Test data !!!";
    let templateTime = "napi (kritikus me.) jelentés"
    let sendHTML = dailyCriticCalculation()
    /* let sendHTML = `<strong>madeIn SusuSoft with Node.js C2022</strong><br>emilsender is OK😊${templateText}😊<br>valid remote SENDER <br><strong>remote --> RaspberryPi 🚀 BAF</strong>` */
    //console.log('sendHTML content')
    //console.log(sendHTML)
    //console.log('criticalQuantity (before): ', criticalQuantity)
    //if (sendHTML != '') {
    if (criticalQuantity == true) {
        //sendMailDataCopy(sendTextRequired, sendHTML, templateTime);
        //console.log('ez biz teli minta a deli bus')
        sendMailData(sendTextRequired, sendHTML, templateTime);
        criticalQuantity = false
    }
    //console.log('criticalQuantity (after): ', criticalQuantity)
});
/* =========================================================================== */
/* ================= mined hetfo 9-kor INFO: HETI JELENTES INFO: ================= */
cron.schedule("0 8 * * 1", () => {
    //VERSION-2:INFO:TODO:INFO:VERSION-2:
    getdata()
});
//cron.schedule("*/5 * * * * *", () => {
cron.schedule("0 9 * * 1", () => {
    //VERSION-2:INFO:TODO:INFO:VERSION-2:
    getdata()
    console.log("runs in on Monday at 9 o'clock SendMailData");
    let sendTextRequired = "required";
    let templateText = "pultosTerminal C2022 Test data !!!";
    let templateTime = "heti jelentés"
    let sendHTML = weeklySalesCalculation()
    /* let sendHTML = `<strong>madeIn SusuSoft with Node.js C2022</strong><br>emilsender is OK😊${templateText}😊<br>valid remote SENDER <br><strong>remote --> RaspberryPi 🚀 BAF</strong>` */
    sendMailData(sendTextRequired, sendHTML, templateTime);
    //sendMailDataCopy(sendTextRequired, sendHTML, templateTime);
});
/* =========================================================================== */
/* ================= minden hónap 1. napja 09 órakor INFO: HAVI INFO: ================= */
cron.schedule("5 8 1 * *", () => {
    //VERSION-2:INFO:TODO:INFO:VERSION-2:
    getdata()
});
//cron.schedule("*/5 * * * * *", () => {
cron.schedule("5 9 1 * *", () => {
    //console.log("runs in on Month 01 at 9 o'clock SendMailData 🥇🥇🥇");
    let datum = new Date()
    var ev = datum.getFullYear()
    var honap = ''
    honap = datum.getMonth() == 0 ? month[11] : month[datum.getMonth() - 1]
    let sendTextRequired = "required";
    let templateText = "sususoft C2023 🚀🚀🚀🚀🚀";
    let templateTime = "havi jelentés"
    let sendHTMLarray = ['', '']
    let sendHTML = `${ev}. ${honap}<br>`
    sendHTMLarray = monthlySalesCalculation()
    sendHTML += sendHTMLarray[0] + sendHTMLarray[1]
    /* let sendHTML = `<strong>madeIn SUSUSOFT with Node.js C2023</strong><br>emilsender is OK😊${templateText}😊` */
    //console.log(sendHTML)
    sendMailData(sendTextRequired, sendHTML, templateTime);
    //sendMailDataCopy(sendTextRequired, sendHTML, templateTime);
});
/* =========================================================================== */
/* ==================================template================================= */
/* cron.schedule("* * * * *", () => {
    console.log("SendMailData 🥇🥇🥇");
    let sendTextRequired = "required";
    let templateText = "sususoft C2022";
    let templateTime = "jelentés"
    let sendHTML = `<strong>madeIn SUSUSOFT with Node.js C2022</strong><br>emilsender is OK😊${templateText}😊`
    sendMailData(sendTextRequired, sendHTML, templateTime);
}); */
/* =========================================================================== */

function sendMailData(sendTextRequired, sendHTML, templateTime) {
    //var sendTextRequired = "required";
    const msg = {
        to: "vorosbarat@gmail.com",
        from: "fotovegh@gmail.com",
        subject: `Pultos terminal ${templateTime} ...`,
        text: sendTextRequired,
        html: sendHTML,
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log("Email sent");
        })
        .catch((error) => {
            console.error(error);
        });
}
function sendMailDataCopy(sendTextRequired, sendHTML, templateTime) {
    //var sendTextRequired = "required";
    const msg = {
        to: "photovegh@gmail.com",
        from: "fotovegh@gmail.com",
        subject: `Pultos terminal ${templateTime} ...`,
        text: sendTextRequired,
        html: sendHTML,
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log("Email copy sent");
        })
        .catch((error) => {
            console.error(error);
        });
}

//VERSION-2:
function setupWeekQuery() {
    Date.prototype.getWeek = function () {
        var date = new Date(this.getTime());
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return (
            1 +
            Math.round(
                ((date.getTime() - week1.getTime()) / 86400000 -
                    3 +
                    ((week1.getDay() + 6) % 7)) /
                7
            )
        );
    };
}

//VERSION-2:INFO:VERSION-2:
function weeklySalesCalculation() {
    //VERSION-2:INFO:TODO:INFO:VERSION-2:
    getdata()

    var weekNumber = (new Date()).getWeek() - 1 //eloozoo heet
    var weekDay = 1
    var checkMondayTime = ''
    var salesWeek = 0

    var summaAlapagyagWeek_db = []
    var summaAlapagyagWeek_felhasznalt = []
    var lastIndex = 0
    for (alapanyag of state.alapanyagok) {
        lastIndex = alapanyag.id
    }
    for (index = 0; index <= lastIndex; index++) {
        summaAlapagyagWeek_db[index] = 0
        summaAlapagyagWeek_felhasznalt[index] = 0
    }

    createAlapanyagARRAY()
    state.weekReportJSON = []
    for (weekReport of state.forgalomReport) {
        salesWeek = new Date(weekReport.eladottdate)

        if (salesWeek.getWeek() >= weekNumber && salesWeek.getWeek() <= weekNumber + 5) {

            stringMount = salesWeek.getMonth() < 9 ? `0${salesWeek.getMonth() + 1}` : salesWeek.getMonth() + 1
            stringDay = salesWeek.getDate() < 10 ? `0${salesWeek.getDate()}` : salesWeek.getDate()
            checkMondayTime = new Date(`${salesWeek.getFullYear()}-${stringMount}-${stringDay}T03:30:00.000Z`)
            //INFO:TODO:INFO:
            /* console.log('salesWeek.getWeek(): ', salesWeek.getWeek())
            console.log('weekNumber: ', weekNumber)
            console.log('salesWeek.getDay(): ', salesWeek.getDay())
            console.log('weekDay: ', weekDay)
            console.log('salesWeek: ', salesWeek)
            console.log('checkMondayTime: ', checkMondayTime) */
            //INFO:TODO:INFO:
            if (salesWeek.getWeek() == weekNumber && salesWeek.getDay() == weekDay && salesWeek >= checkMondayTime) {
                state.weekReportJSON.push({ termekid: weekReport.termekid, db: weekReport.db })

            }
            if (salesWeek.getDay() != weekDay) {
                state.weekReportJSON.push({ termekid: weekReport.termekid, db: weekReport.db })

            }
            if (salesWeek.getWeek() == weekNumber + 1 && salesWeek.getDay() == weekDay && salesWeek < checkMondayTime) {
                state.weekReportJSON.push({ termekid: weekReport.termekid, db: weekReport.db })
            }

        }
    }
    //INFO:TODO:INFO:
    //console.log(state.weekReportJSON)
    //INFO:TODO:INFO:
    for (weekTermek of state.weekReportJSON) {
        for (termekToAlapanyag of state.fromTermekToAlapanyag) {
            if (termekToAlapanyag.termek_id == weekTermek.termekid) {
                summaAlapagyagWeek_db[termekToAlapanyag.alapanyag_id] += weekTermek.db
                summaAlapagyagWeek_felhasznalt[termekToAlapanyag.alapanyag_id] += weekTermek.db * termekToAlapanyag.felhasznaltmennyiseg

            }
        }
    }
    let testDatum = new Date()
    //sendMessageHTML = ""
    sendMessageHTML = "<table>"

    for (alapanyag of state.alapanyagok) {
        index = alapanyag.id
        if (summaAlapagyagWeek_db[index] > 0 && alapanyag.leltarozando > 0) {
            if (alapanyag.keszletsum - summaAlapagyagWeek_felhasznalt[index] < 0) {

                let kiszereles = alapanyag.gyujto > 1 ? 'gyűjtő' : 'darab'
                let hetiFogyas = Math.round(summaAlapagyagWeek_felhasznalt[index] / alapanyag.kiszereles * 100) / 100
                let aktualisKeszlet = Math.round(alapanyag.keszletsum / alapanyag.kiszereles)
                let rendelniKell = hetiFogyas
                if (alapanyag.gyujto > 1) {
                    rendelniKell = Math.trunc(rendelniKell / alapanyag.gyujto) + 1

                }
                sendMessageHTML += `
                <tr>
                <td style="font-weight: bold;">${rendelniKell} ${kiszereles} ${alapanyag.nev} </td>
                <td> ( </td>
                <td style="text-align: right;font-weight: bold;"> ${aktualisKeszlet}</td>
                <td> ,</td>
                <td style="text-align: right;font-weight: bold;"> ${hetiFogyas} </td>
                <td> )</td>
                </tr>
                `
                /* sendMessageHTML += `
                <h3>${rendelniKell} ${kiszereles} ${alapanyag.nev} (${aktualisKeszlet}, ${hetiFogyas})</h3>
                <br><br>
                ` */
            }
        }
    }
    sendMessageHTML += "</table>"

    /* 
    sendMessageHTML = "Ezek csak a teszteleeshez kell...<br>******************************<br>"
//VERSION-2: for()
                Alapag neve: ${alapanyag.nev}<br> Heti fogyas: ${hetiFogyas}<br>
                Aktualis keszlet: ${aktualisKeszlet}<br>
                Rendelni kell : ${Math.abs(rendelniKell)} ${kiszereles}<br>
                Uj keszlet GYUJTO / LITER: ${(aktualisKeszlet + hetiFogyas)} db<br>
                Van-e gyujtooo: ${alapanyag.gyujto}<br>
                ******************************
                <br>
                ***** sendMessage DATA *****
    */
    //VERSION-2://VERSION-2://VERSION-2://VERSION-2://VERSION-2:

    //sendMessageHTML = 'sendMessageHTML is OK 😊'
    return sendMessageHTML
}
//VERSION-2:INFO:VERSION-2:
function createAlapanyagARRAY() {
    for (alapanyag of state.alapanyagok) {
        alapanyagARRAYnev[alapanyag.id] = alapanyag.nev
        alapanyagARRAYmertekegyseg[alapanyag.id] = alapanyag.mertekegyseg
        alapanyagARRAYkiszereles[alapanyag.id] = alapanyag.kiszereles
        alapanyagARRAYgyujto[alapanyag.id] = alapanyag.gyujto
        alapanyagARRAYkeszletsum[alapanyag.id] = alapanyag.keszletsum
    }
}
//VERSION-2:VERSION-2:VERSION-2:

testSection()
function testSection() {
    datum = new Date()
    console.log('datum.getWeek()')
    console.log(datum.getWeek())
}

/* =========================================================================== */
function setupCRON() {
    cron.schedule("*/5 * * * * *", () => {
        console.log("runs in every 5 second SendMailData 🥇🥇🥇🥇🥇🥇🥇");
        console.log("state.temp[1].nev");
        console.log(state.alapanyagReport[1].nev);
    });
}

//VERSION-2:INFO:TODO:INFO:VERSION-2:
//cron.schedule("*/10 * * * * *", () => {
//    getdata()
//    weeklySalesCalculation()
//});
//cron.schedule("*/2 * * * * *", () => {
//    getdata()
//weeklySalesCalculation()
//console.log('hmm test GETDATATEST')
//});
//VERSION-2:INFO:TODO:INFO:VERSION-2:

/* =========================================================================== */
//'2022. 08. 02. 15:02:52'
/* sendHTMLweek = `
    < p > ---------------</p >
    <p>9 gyujto borsodi uveges (3, 7)</p>
    <p>2 db UNICUM (2, 4)</p>
    <p>10 db ${state.alapanyagReport[2].nev} (55, 77)</p>
` */
/* console.log("runs in every 5 second SendMailData 🥇🥇🥇🥇🥇🥇🥇");
    console.log('state.forgalomReport[5].eladottdate');
    console.log(state.forgalomReport[5].eladottdate);
    datum = new Date(state.forgalomReport[5].eladottdate)
    console.log('datum');
    console.log(datum);
    console.log(datum.getWeek());
    let vizsgal = false
    if (state.forgalomReport[5].eladottdate >= '2022. 08. 02. 15:02:52') {
        vizsgal = true
    }
    console.log('vizsgal')
    console.log(vizsgal) */
/* console.log("state.forgalomReport[5].termekid");
console.log(state.forgalomReport[5].termekid); */
//console.log(sendHTMLweek);

function dailyCriticCalculation() {
    let sendDailyHTML = `<div class="container">
    <table class="table">
    <thead>
        <tr>
            <th>Név</th>
            <th>Készlet</th>
            <th>Kritikus</th>
        </tr>
    </thead>
    <tbody>
    `
    let validDB = 0
    for (alapanyag of state.alapanyagok) {
        validDB = Math.round(alapanyag.keszletsum / alapanyag.kiszereles * 100) / 100
        if (alapanyag.leltarozando == 1 && validDB < alapanyag.kritikus) {
            console.log(alapanyag.nev, validDB, alapanyag.kritikus)
            criticalQuantity = true
            sendDailyHTML += `
            <tr>
                    <td style = "text-align: left;">${alapanyag.nev}</td>
                    <td style = "text-align: right;">${validDB}</td>
                    <td style = "text-align: right;">${alapanyag.kritikus}</td>
                </tr>
            `
        }
    }
    sendDailyHTML += `</tbody>
    </table>
    </div>`
    return sendDailyHTML
}

function monthlySalesCalculation() {
    let sendMonthlyHTML = beforeMonthSales()
    return sendMonthlyHTML
}

function beforeMonthSales() {
    var fullWorkTimeARRAY = []
    var pultosHTML = ''
    var transactionsHTML = ``
    var beforeYear = datum.getMonth() == 0 ? datum.getFullYear() - 1 : datum.getFullYear()
    var beforeMonth = datum.getMonth() == 0 ? 11 : datum.getMonth() - 1
    var pultosElozoHaviMindosszesen = []
    var elozoHaviKp1, elozoHaviKp2, elozoHaviCard, elozoHaviKivet, elozoHaviHaszon, elozoHaviMindosszesen, elozoHaviNetto, elozoHaviZseb;
    zeroValue()
    for (let transaction of state.transactions) {
        if (
            new Date(transaction.trdate).getMonth() == beforeMonth &&
            new Date(transaction.trdate).getFullYear() == beforeYear
        ) {
            if (transaction.trfizetesmod == "k") {
                elozoHaviKp1 += transaction.kibeosszeg;
                elozoHaviHaszon += transaction.kibeosszegbeszar;
                pultosElozoHaviMindosszesen[transaction.pultos] += transaction.kibeosszeg
            }
            if (transaction.trfizetesmod == "m") {
                elozoHaviKp2 += transaction.kibeosszeg;
                elozoHaviHaszon += transaction.kibeosszegbeszar;
                pultosElozoHaviMindosszesen[transaction.pultos] += transaction.kibeosszeg
            }
            if (transaction.trfizetesmod == "c") {
                elozoHaviCard += transaction.kibeosszeg;
                elozoHaviHaszon += transaction.kibeosszegbeszar;
                pultosElozoHaviMindosszesen[transaction.pultos] += transaction.kibeosszeg
            }
            if (transaction.trfizetesmod == "b") {
                elozoHaviKivet += transaction.kibeosszeg;
            }
        }

    }
    elozoHaviMindosszesen = (elozoHaviKp1 + elozoHaviKp2 + elozoHaviCard)
    ////VERSION-2:
    transactionsHTML = `<table>`
    transactionsHTML += `
    <tr>
    <td>Bevétel mindösszesen: </td><td style="text-align: right;padding-left: 21px;" >${elozoHaviMindosszesen.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}</td>
    </tr>
    <tr>
    <td>Bevétel1: </td><td style="text-align: right;padding-left: 21px;">${elozoHaviKp1.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}</td>
    </tr>
    <tr>
    <td>Bevétel2: </td><td style="text-align: right;padding-left: 21px;">${elozoHaviKp2.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}</td>
    </tr>
    <tr>
    <td>Bevétel card: </td><td style="text-align: right;padding-left: 21px;">${elozoHaviCard.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}</td>
    </tr>
    <tr>
    <td>Kivét: </td><td style="text-align: right;padding-left: 21px;">${elozoHaviKivet.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}</td>
    </tr>
    <tr>
    <td>Haszon: </td><td style="text-align: right;padding-left: 21px;">${(elozoHaviMindosszesen - elozoHaviHaszon).toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}</td>
    </tr>
    `
    transactionsHTML += `</table><br><br><br>`
    ////VERSION-2:
    /* transactionsHTML += `
    Bevétel mindösszesen: ${elozoHaviMindosszesen.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}<br>
    Bevétel1: ${elozoHaviKp1.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}<br>
    Bevétel2: ${elozoHaviKp2.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}<br>
    Bevétel card: ${elozoHaviCard.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}<br>
    Kivét: ${elozoHaviKivet.toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}<br>
    Haszon: ${(elozoHaviMindosszesen - elozoHaviHaszon).toLocaleString("hu-HU", {
        maximumFractionDigits: 0,
    })}<br>`; */

    fullWorkTimeARRAY = fullWorkTimeCalculation(beforeYear, beforeMonth)
    pultosHTML = `<table>
    <tr>
      <th>Pultos</th>
      <th>Bevétel</th>
      <th>Órák</th>
      <th>Bevétel/óra</th>
    </tr>`
    for (index = 0; index < 4; index++) {
        let fullWorkTimeHour = Math.round(fullWorkTimeARRAY[index] / 60 * 100) / 100
        /* let fullWorkMindosszesenPerTimeHour = pultosElozoHaviMindosszesen[index] / fullWorkTimeHour */

        let fullWorkMindosszesenPerTimeHour = fullWorkTimeHour > 0 ? Math.round((
            pultosElozoHaviMindosszesen[index] / fullWorkTimeHour
        )).toLocaleString("hu-HU", {
            maximumFractionDigits: 0,
        }) : 0

        pultosHTML += `
        <tr>
            <td>${state.pultosokPSW[index].name}
            </td>
            <td style="text-align: right;padding-left: 21px;">${pultosElozoHaviMindosszesen[index].toLocaleString("hu-HU", {
            maximumFractionDigits: 0,
        })}</td>
            <td style="text-align: right;padding-left: 21px;">${fullWorkTimeHour}</td>
            <td style="text-align: right;padding-left: 21px;">${fullWorkMindosszesenPerTimeHour}
            </td>
        </tr>
        `
        /* pultosHTML += `
        Pultos ${index}. ${state.pultosokPSW[index].name} bevétel: ${pultosElozoHaviMindosszesen[index].toLocaleString("hu-HU", {
            maximumFractionDigits: 0,
        })}<br>
        Ledolgozott órák: ${fullWorkTimeHour}<br>
        ` */
    }
    pultosHTML += `</table>`
    //INFO:TODO:INFO:console.log(fullWorkTimeARRAY)
    return [transactionsHTML, pultosHTML]

    function zeroValue() {
        elozoHaviKp1 = elozoHaviKp2 = elozoHaviCard = elozoHaviKivet = elozoHaviHaszon = elozoHaviMindosszesen = elozoHaviNetto = elozoHaviZseb = 0;
        pultosElozoHaviMindosszesen[0] = 0
        pultosElozoHaviMindosszesen[1] = 0
        pultosElozoHaviMindosszesen[2] = 0
        pultosElozoHaviMindosszesen[3] = 0
    }
}

function fullWorkTimeCalculation(beforeYear, beforeMonth) {
    var fullBeforeWorkTimeHTML = "";
    let startTime = 0
    let endTime = 0
    let workTime = 0
    let fullWorkTime = []
    fullWorkTime[0] = 0
    fullWorkTime[1] = 0
    fullWorkTime[2] = 0
    fullWorkTime[3] = 0
    for (let transaction of state.transactions) {
        if (
            new Date(transaction.trdate).getMonth() == beforeMonth &&
            new Date(transaction.trdate).getFullYear() == beforeYear
        ) {

            if (transaction.megjegyzes == 'workTime' && transaction.trfizetesmod == 'o') {
                startTime = new Date(transaction.trdate).getTime()
            }
            if (transaction.megjegyzes == 'workTime' && transaction.trfizetesmod == 'f') {
                if (startTime == 0) {
                    startTime = new Date(transaction.trdate).getTime()
                }
                endTime = new Date(transaction.trdate).getTime()
                workTime = parseInt((endTime - startTime) / 1000 / 60)
                fullWorkTime[transaction.pultos] += workTime
                //INFO:TODO:INFO:console.log(startTime, endTime)
            }
        }

    }
    /* for (index = 0; index < 4; index++) {
        fullBeforeWorkTimeHTML += `<tr><td>${index}</td><td>${state.pultosokPSW[index].name}</td><td>${fullWorkTime[index]}</td><td>${parseInt(fullWorkTime[index] / 60)}</td><td>${month[beforeMonth]}</td></tr>`
    }
    console.log('fullBeforeWorkTimeHTML')
    console.log(fullBeforeWorkTimeHTML) */
    return fullWorkTime
}