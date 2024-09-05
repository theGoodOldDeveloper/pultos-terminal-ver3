const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const conf = dotenv.config();
const fs = require("fs");

var port = conf.parsed.ADMINPORT;
var mysql = require("mysql");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));

/* INFO:INFO: DATABESE connection INFO:INFO: */
/* ***************************************** */
var con = mysql.createConnection({
  host: "localhost",
  user: "pultos",
  password: "Terminal-2022",
  database: "pultosterminal",
});
con.connect(function (err) {
  if (err) throw err;
});
/* ***************************************** */
/* INFO:INFO: DATABESE connection INFO:INFO: */

/* INFO: induló login képernyő */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/app-admin.html");
});

/* INFO: admin képernyő */
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/views/admin.html");
});

/* INFO: isinstock képernyő */
app.get("/isinstock", (req, res) => {
  res.sendFile(__dirname + "/views/isInStock.html");
});

/* INFO: laststock képernyő */
app.get("/laststock", (req, res) => {
  res.sendFile(__dirname + "/views/laststock.html");
});

/* INFO: laststockdata */
app.get("/laststockdata", (req, res) => {
  res.sendFile(__dirname + "/lastLeltar.txt");
});

/* INFO: kosarak */
app.get("/getStoreDataKosarak", (req, res) => {
  try {
    fs.readFile("storeDataKosarak.json", "utf8", async (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to read data" });
      } else {
        const jsonDataKosarak = await JSON.parse(data);
        res.json(jsonDataKosarak);
      }
    });
  } catch (error) {
    console.error(err);
  }
});
app.get("/getStoreDataKosarNevek", async (req, res) => {
  fs.readFile("storeDataKosarNevek.json", "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to read data" });
    } else {
      const jsonDataNevek = await JSON.parse(data);
      res.json(jsonDataNevek);
    }
  });
});

/* INFO: refreshpultbanvan */
app.post("/refreshpultbanvan", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("pultbanvan.txt", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.sendFile(__dirname + "/views/alapanyagok.html");
});
/* INFO: updatepultosok */
app.post("/updatepultosok", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("psw.txt", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.sendFile(__dirname + "/views/pultosok-admin.html");
});
/* INFO: updatetodolist */
app.post("/updatetodolist", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("todolist.txt", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.end();
});

/* INFO: visibleOrder */
app.get("/visibleOrder", (req, res) => {
  res.sendFile(__dirname + "/views/visibleOrder.html");
});
/* INFO: pultosokadmin */
app.get("/pultosokadmin", (req, res) => {
  res.sendFile(__dirname + "/views/pultosok-admin.html");
});
/* INFO: pultosokadminpsw */
app.get("/pultosokadminpsw", (req, res) => {
  res.sendFile(__dirname + "/psw.txt");
});
/* INFO: pultbanvan */
app.get("/pultbanvan", (req, res) => {
  res.sendFile(__dirname + "/pultbanvan.txt");
});

/* INFO: kategoriák  categori array send */
app.get("/categories", (req, res) => {
  res.sendFile(__dirname + "/categories.txt");
});
/* INFO: teendők  todoList array send */
app.get("/todolist", (req, res) => {
  res.sendFile(__dirname + "/todolist.txt");
});
/* INFO: other */
app.get("/otherdata", (req, res) => {
  res.sendFile(__dirname + "/other.json");
});

/* INFO: lasttransaction  TOROLNI ??? NEM KELL??? */
app.get("/lasttransaction", (req, res) => {
  res.sendFile(__dirname + "/last-transaction.json");
});

/* INFO: termek nev lekeres */
con.query("SELECT * FROM termekek", (err, data) => {
  if (err) throw err;
  termekeks = data;
});

/* INFO: /datareadtermekek */
app.get("/datareadtermekek", (req, res) => {
  con.query("SELECT * FROM termekek", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

// INFO: alapanyagok HTML
app.get("/alapanyagok", (req, res) => {
  res.sendFile(__dirname + "/views/alapanyagok.html");
});
// INFO: TODO HTML
app.get("/todo", (req, res) => {
  res.sendFile(__dirname + "/views/todo.html");
});
// INFO: STATISTICS HTML
app.get("/statistics", (req, res) => {
  res.sendFile(__dirname + "/views/statistics.html");
});
// INFO: /datareadalapanyagok DATA
app.get("/datareadalapanyagok", (req, res) => {
  con.query("SELECT * FROM alapanyagok", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});
// INFO: /deleteosszetevo DATA
app.delete("/deleteosszetevo/:id", bodyParser.json(), (req, res) => {
  const id = req.params.id;
  con.query(
    "DELETE FROM termekek_has_alapanyagok WHERE id = ?",
    id,
    (err, data) => {
      if (err) throw err;
      res.send(data);
    }
  );
});
// INFO: /osszetevok DATA
app.get("/datareadosszetevok", (req, res) => {
  con.query("SELECT * FROM termekek_has_alapanyagok", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});
// INFO: /alapanyagok DATA insert
app.post("/insertalapanyagok", bodyParser.json(), (req, res) => {
  var insertData = [
    req.body.nev,
    req.body.mertekegyseg,
    req.body.kiszereles,
    req.body.leltarozando,
    req.body.kritikus,
    req.body.gyujto,
    req.body.keszlet,
    req.body.beszar,
    req.body.keszletsum,
  ];
  con.query(
    "INSERT INTO alapanyagok (nev, mertekegyseg, kiszereles, leltarozando, kritikus, gyujto, keszlet,  beszar, keszletsum) VALUES (?)",
    [insertData],
    (err, data) => {
      if (err) throw err;
      insertData = [""];
      try {
        res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );
  res.sendFile(__dirname + "/views/alapanyagok.html");
});
// INFO: //inserttermek DATA insert
app.post("/inserttermek", bodyParser.json(), (req, res) => {
  var insertData = [
    req.body.nev,
    req.body.elar,
    req.body.urtartalom,
    req.body.btncolor,
    req.body.visiblesequence,
  ];
  con.query(
    "INSERT INTO termekek (nev, elar, urtartalom, btncolor, visiblesequence) VALUES (?)",
    [insertData],
    (err, data) => {
      if (err) throw err;
      insertData = [""];
      try {
        res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );
  res.sendFile(__dirname + "/views/termekek-adatlap.html");
});
// INFO: /insertosszetevok DATA insert
app.post("/insertosszetevok", bodyParser.json(), (req, res) => {
  var insertData = [
    req.body.termek_id,
    req.body.alapanyag_id,
    req.body.felhasznaltmennyiseg,
  ];
  con.query(
    "INSERT INTO termekek_has_alapanyagok (termek_id, alapanyag_id, felhasznaltmennyiseg) VALUES (?)",
    [insertData],
    (err, data) => {
      if (err) throw err;
      insertData = [""];
      try {
        res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );
  res.sendFile(__dirname + "/views/termekek-adatlap.html");
});
// INFO: /alapanyagok DATA update
app.patch("/updatealapanyagok", bodyParser.json(), (req, res) => {
  var nev = [req.body.nev];
  var mertekegyseg = [req.body.mertekegyseg];
  var kiszereles = [req.body.kiszereles];
  var leltarozando = [req.body.leltarozando];
  var kritikus = [req.body.kritikus];
  var gyujto = [req.body.gyujto];
  var keszlet = [req.body.keszlet];
  var beszar = [req.body.beszar];
  var keszletsum = [req.body.keszletsum];

  var id = req.body.id;
  con.query(
    "UPDATE alapanyagok SET nev = ?, mertekegyseg = ?, kiszereles = ?, leltarozando = ?, kritikus = ?, gyujto = ?, keszlet = ?, beszar = ?, keszletsum = ? WHERE id = ?",
    [
      nev,
      mertekegyseg,
      kiszereles,
      leltarozando,
      kritikus,
      gyujto,
      keszlet,
      beszar,
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
// INFO: /updatealapanyagbeszerzes DATA update
app.patch("/updatealapanyagbeszerzes", bodyParser.json(), (req, res) => {
  var id = req.body.id;
  var keszlet = [req.body.keszlet];
  var keszletsum = [req.body.keszletsum];
  con.query(
    "UPDATE alapanyagok SET keszlet = ?, keszletsum = ? WHERE id = ?",
    [keszlet, keszletsum, id],
    (err, data) => {
      try {
        res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );
});

/* INFO: /datareadforgalom datareadtransactions */
app.get("/datareadforgalom", (req, res) => {
  con.query("SELECT * FROM forgalom", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});
app.get("/datareadforgalomtwoday", (req, res) => {
  let datumToday = new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000);
  todayDayIntervallum(datumToday);
  let datumBefore = new Date(Date.parse(new Date()) - 48 * 60 * 60 * 1000);
  beforeDayIntervallum(datumBefore);
  con.query(
    `SELECT * FROM forgalom WHERE eladottdate BETWEEN ? AND ?;`,
    [beforeDayIntervallum(datumBefore), todayDayIntervallum(datumToday)],
    (err, data) => {
      if (err) throw err;
      res.send(data);
    }
  );
});
app.get("/datareadtransactiontwoday", (req, res) => {
  let datumToday = new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000);
  todayDayIntervallum(datumToday);
  let datumBefore = new Date(Date.parse(new Date()) - 48 * 60 * 60 * 1000);
  beforeDayIntervallum(datumBefore);
  con.query(
    `SELECT * FROM transactions WHERE trdate BETWEEN ? AND ?;`,
    [beforeDayIntervallum(datumBefore), todayDayIntervallum(datumToday)],
    (err, data) => {
      if (err) throw err;
      res.send(data);
    }
  );
});

app.get("/datareadforgalomtwodayintervall/:startFilterDate", (req, res) => {
  const paramsData = req.params.startFilterDate;
  const sendStartDatum = req.headers.sendstartdatum;
  const sendEndDatum = req.headers.sendenddatum;
  /* console.log('paramsData😁', paramsData, 'paramsData😁')
    console.log('sendStartDatum😁😁😁😁', sendStartDatum)
    console.log('sendEndDatum😁', sendEndDatum) */
  let datumBefore = new Date(Date.parse(sendStartDatum) - 24 * 60 * 60 * 1000);
  let datumToday = new Date(Date.parse(sendEndDatum) + 48 * 60 * 60 * 1000);

  /* console.log('=======================================')
    console.log('datumToday / datumBefore', datumToday, datumBefore)
    console.log(beforeDayIntervallum(datumBefore), todayDayIntervallum(datumToday))
    console.log('=======================================') */

  con.query(
    `SELECT * FROM forgalom WHERE eladottdate BETWEEN ? AND ?;`,
    [beforeDayIntervallum(datumBefore), todayDayIntervallum(datumToday)],
    (err, data) => {
      if (err) throw err;
      res.send(data);
    }
  );
});

app.get("/datareadtransactions", (req, res) => {
  con.query("SELECT * FROM transactions", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});
//HACK:                                                new forgalom OK
app.get("/datareadtransactionssevenday", (req, res) => {
  let datumToday = new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000);
  todayDayIntervallum(datumToday);
  let datumBefore = new Date(Date.parse(new Date()) - 70 * 24 * 60 * 60 * 1000);
  beforeDayIntervallum(datumBefore);

  con.query(
    `SELECT * FROM transactions WHERE trdate BETWEEN ? AND ?;`,
    [beforeDayIntervallum(datumBefore), todayDayIntervallum(datumToday)],
    (err, data) => {
      if (err) throw err;
      res.send(data);
    }
  );
});
app.get("/datareadforgalomsevenday", (req, res) => {
  let datumToday = new Date(Date.parse(new Date()) + 24 * 60 * 60 * 1000);
  todayDayIntervallum(datumToday);
  let datumBefore = new Date(Date.parse(new Date()) - 70 * 24 * 60 * 60 * 1000);
  beforeDayIntervallum(datumBefore);

  con.query(
    `SELECT * FROM forgalom WHERE eladottdate BETWEEN ? AND ?;`,
    [beforeDayIntervallum(datumBefore), todayDayIntervallum(datumToday)],
    (err, data) => {
      if (err) throw err;
      res.send(data);
    }
  );
});
//HACK:                                                new forgalom OK
app.get("/datareadtransactionssevenday/:startFilterDate", (req, res) => {
  const paramsData = req.params.startFilterDate;
  const sendStartDatum = req.headers.sendstartdatum;
  const sendEndDatum = req.headers.sendenddatum;
  /* console.log('paramsData😁', paramsData, 'paramsData😁')
    console.log('sendStartDatum😁😁😁😁', sendStartDatum)
    console.log('sendEndDatum😁', sendEndDatum) */

  let datumBefore = new Date(Date.parse(sendStartDatum) - 24 * 60 * 60 * 1000);
  let datumToday = new Date(Date.parse(sendEndDatum) + 48 * 60 * 60 * 1000);

  /* console.log('=======================================')
    console.log('datumToday / datumBefore', datumBefore, datumToday)
    console.log(beforeDayIntervallum(datumBefore), todayDayIntervallum(datumToday))
    console.log('=======================================') */

  con.query(
    `SELECT * FROM transactions WHERE trdate BETWEEN ? AND ?;`,
    [beforeDayIntervallum(datumBefore), todayDayIntervallum(datumToday)],
    (err, data) => {
      if (err) throw err;
      res.send(data);
    }
  );
});

/* INFO: todayDayIntervallum */
function todayDayIntervallum(datum) {
  //console.log(datum, '*******************meeee*********************')
  //let datum = new Date(Date.parse(new Date()) + (24 * 60 * 60 * 1000))
  let ev = datum.getFullYear();
  let honap = datum.getMonth() + 1;
  honap = honap < 10 ? "0" + honap : honap;
  let nap = datum.getDate();
  nap = nap < 10 ? "0" + nap : nap;

  let maiNap = `${ev}. ${honap}. ${nap}.`;
  //console.log('maiNap', maiNap)
  return maiNap;
}
function beforeDayIntervallum(datum) {
  //console.log(datum, '-------------------------------------')
  //let datum = new Date(Date.parse(new Date()) - (48 * 60 * 60 * 1000))
  let ev = datum.getFullYear();
  let honap = datum.getMonth() + 1;
  honap = honap < 10 ? "0" + honap : honap;
  let nap = datum.getDate();
  nap = nap <= 9 ? "0" + nap : nap;
  let tegnapiNap = `${ev}. ${honap}. ${nap}.`;
  //console.log('tegnapiNap', tegnapiNap)
  return tegnapiNap;
}

/* INFO: config */
app.get("/config", (req, res) => {
  res.sendFile(__dirname + "/views/config.html");
});

/* INFO: forgalom */
app.get("/forgalom", (req, res) => {
  res.sendFile(__dirname + "/views/forgalom.html");
});

/* INFO: termekek */
app.get("/termekek", (req, res) => {
  res.sendFile(__dirname + "/views/termekek.html");
});
/* INFO: termekek-adatlap */
app.get("/termekek-adatlap", (req, res) => {
  res.sendFile(__dirname + "/views/termekek-adatlap.html");
});

app.patch("/updatetermekekbeszerzes", bodyParser.json(), (req, res) => {
  var id = req.body.id;
  var insertKeszlet = [req.body.keszlet];
  var insertCl = [req.body.cl];
  var insertSumcl = [req.body.sumcl];
  con.query(
    "UPDATE termekek SET keszlet = ?, cl = ?, sumcl = ? WHERE id = ?",
    [insertKeszlet, insertCl, insertSumcl, id],
    (err, data) => {
      try {
        res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );
});

app.patch("/updatetermekek", bodyParser.json(), (req, res) => {
  var insertNev = [req.body.nev];
  var insertElar = [req.body.elar];
  var insertBtncolor = [req.body.btncolor];

  var id = req.body.id;
  con.query(
    "UPDATE termekek SET nev = ?,  elar = ?, btncolor = ? WHERE id = ?",
    [insertNev, insertElar, insertBtncolor, id],
    (err, data) => {
      try {
        res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );
});

app.patch("/updatetermekeksequence", bodyParser.json(), (req, res) => {
  //VERSION-2:BUG:VERSION-2:
  /* var id = req.body.id;
    var visiblesequence = [req.body.visiblesequence]; */
  var id = req.body.id;
  var visiblesequence = req.body.visiblesequence;
  //VERSION-2:BUG:VERSION-2:
  console.log("id BE");
  console.log(id);
  console.log("visiblesequence BE");
  console.log(visiblesequence);
  console.log(visiblesequence.length);
  for (let index = 0; index < visiblesequence.length; index++) {
    con.query(
      "UPDATE termekek SET visiblesequence = ? WHERE id = ?",
      [visiblesequence[index], id[index]],
      (err, data) => {
        try {
          res.send(data);
        } catch {
          if (err) throw err;
        }
      }
    );
    /*     con.query(
                "UPDATE termekek SET visiblesequence = ? WHERE id = ?",
                [visiblesequence, id],
                (err, data) => {
                    try {
                        res.send(data);
                    } catch {
                        if (err) throw err;
                    }
                }
            ); */
  }
});

/* INFO: password authentication */
function loggerMiddleWare(req, res, next) {
  const pin = true;
  if (pin) {
    //console.log("loggerMiddleWare is OK 😋 ");
    next();
  } else {
    //console.log(body);
    /* res.status(401).send("Authentical error is NEMOK 🤔 "); */
    res.status(200).sendFile(__dirname + "/views/index.html");
    /* console.log("loggerMiddleWare is NEMOK 🤔 ");
        return; */
  }
}

app.get("/pult", loggerMiddleWare, (req, res) => {
  res.sendFile(__dirname + "/views/pult.html");
});
app.listen(port, () => console.log("server is OK 😋 ADMINPORT: " + port));

/* TODO:TODO:TODO:TODO:TODO:TODO:TODO: */
/* BUG: inserttermekek  BUG:BUG:BUG:BUG:BUG:BUG:BUG: */
app.post("/inserttermekek", bodyParser.json(), (req, res) => {
  //const nev = req.body.nev;
  //const beszar = req.body.beszar;
  /* NOTE:NOTE:NOTE:NOTE:NOTE: */
  /* var insertData = [
        req.body.nev,
        req.body.beszar,
        req.body.elar,
        req.body.leltarozando,
        req.body.kritikus,
        req.body.gyujto,
        req.body.urtartalom,
        req.body.jelenlegiKeszlet,
        req.body.cl,
        req.body.sumcl,
        req.body.kiszerelesId,
        req.body.csoportId,
    ]; */
  /* NOTE:NOTE:NOTE:NOTE:NOTE: */
  /* FIXME:FIXME:FIXME: */
  /* con.query(
        "INSERT INTO termekek (nev, beszar, elar, leltarozando, kritikus, gyujto, urtartalom, keszlet,  cl, sumcl, kiszereles_id, csoport_id) VALUES (?)",
        [insertData],
        (err, data) => {
            if (err) throw err;
            insertData = [""];
            try {
                res.send(data);
            } catch {
                if (err) throw err;
            }
        }
    ); */
  /* FIXME:FIXME:FIXME: */
  //res.sendFile(__dirname + "/views/termekek.html");
});
