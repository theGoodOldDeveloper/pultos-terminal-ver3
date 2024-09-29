const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const conf = dotenv.config();
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const util = require("util");

var port = conf.parsed.ADMINPORT;
var mysql = require("mysql");
const app = express();
const kosarakDb = new sqlite3.Database("./kosarakdb.sqlite");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));
app.use(express.urlencoded({ extended: true }));
/* app.use((req, res, next) => {
  console.log(`${req.method} kérés érkezett a ${req.url} útvonalra`);
  next();
}); */

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
/* ***************************************** */

async function startSQLiteServer() {
  try {
    await openDatabase();
    await initializeDatabase();
  } catch (error) {
    console.error("Nem sikerült elindítani a szervert:", error);
    process.exit(1);
  }
}
/* ***************************************** */
//BUG: Hordócsere
// Hordócsere API útvonal
app.get("/api/hordocsere", (req, res) => {
  const query = `
    SELECT * FROM transactions 
    WHERE trfizetesmod = 's'
    ORDER BY id DESC
    LIMIT 10
  `;

  con.query(query, (err, data) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(data);
    }
  });
});
// API útvonal a csapolt termékek lekérdezéséhez
app.get("/api/csapolttermekek", (req, res) => {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const query = `
    SELECT * FROM forgalom 
    WHERE termekid IN (1, 2, 3)
    AND STR_TO_DATE(eladottdate, '%Y. %m. %d. %H:%i:%s') >= ?
    ORDER BY eladottdate DESC
  `;

  con.query(query, [oneYearAgo], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(data);
    }
  });
});

//BUG: Hordócsere
/* ***************************************** */
// HACK: WorkTime
// Új útvonal a WorkTime adatok lekéréséhez
app.get("/api/worktime", (req, res) => {
  const currentDate = new Date();
  const firstDayOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const lastDayOfCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const query = `
    SELECT * FROM transactions 
    WHERE megjegyzes = 'workTime' 
    AND STR_TO_DATE(trdate, '%Y. %m. %d. %H:%i:%s') >= ?
    AND STR_TO_DATE(trdate, '%Y. %m. %d. %H:%i:%s') <= ?
    ORDER BY trdate ASC
  `;

  con.query(
    query,
    [firstDayOfLastMonth, lastDayOfCurrentMonth],
    (err, data) => {
      if (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database error" });
      } else {
        res.json(data);
      }
    }
  );
});
// HACK: WorkTime
/* ***************************************** */
/* HACK: SQLITE kosarakdb.sqlite */
// DELETE: Kosárnév és hozzá tartozó kosarak törlése
/* app.delete("/api/kosarnevek/:id", (req, res) => {
  const kosarId = req.params.id;

  kosarakDb.run("DELETE FROM kosarnevek WHERE id = ?", kosarId, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Ha vannak kapcsolódó rekordok a kosarak táblában, azokat is törölni kell
    kosarakDb.run(
      "DELETE FROM kosarak WHERE kosarnev_id = ?",
      kosarId,
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Kosár sikeresen törölve", changes: this.changes });
      }
    );
  });
}); */
/* HACK: SQLITE kosarakdb.sqlite */
app.get("/api/kosarnevek", (req, res) => {
  kosarakDb.all(
    `SELECT kn.*, k.* 
          FROM kosarnevek kn 
          LEFT JOIN kosarak k ON kn.id = k.kosarnev_id`,
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const result = rows.reduce((acc, row) => {
        if (!acc[row.id]) {
          acc[row.id] = {
            id: row.id,
            kosarMegnevezes: row.kosarMegnevezes,
            kosarMegnevezesIndex: row.kosarMegnevezesIndex,
            kosarMegnevezesPultosNeve: row.kosarMegnevezesPultosNeve,
            kosarMegnevezesPultosKod: row.kosarMegnevezesPultosKod,
            thisId: row.kosarnev_id,
            kosarak: [],
          };
        }
        if (row.kosarnev_id) {
          acc[row.id].kosarak.push({
            id: row.kosarnev_id, // Ez a kosár egyedi azonosítója
            nev: row.nev,
            db: row.db,
            eladottbeszar: row.eladottbeszar,
            eladottelar: row.eladottelar,
            fizetesmod: row.fizetesmod,
            transactionnumber: row.transactionnumber,
            megjegyzes: row.megjegyzes,
            datum: row.datum,
            aId: row.aId,
            sumcl: row.sumcl,
            cl: row.cl,
            thisId: row.id,
            termekId: row.termekId,
          });
        }
        return acc;
      }, {});

      res.json(Object.values(result));
    }
  );
});
/* HACK: SQLITE kosarakdb.sqlite */
/* FIXME:FIXME SQLITE counters.db */
const dbPath = path.resolve(__dirname, "counters.db");
let db;
startSQLiteServer();
function openDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(
      dbPath,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error("Hiba az adatbázis megnyitásakor:", err.message);
          reject(err);
        } else {
          //console.log("Kapcsolódva a counters.db adatbázishoz.");
          resolve(db);
        }
      }
    );
  });
}

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS counters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT UNIQUE,
        count INTEGER,
        date TEXT
      )`,
        (err) => {
          if (err) {
            console.error("Hiba a tábla létrehozásakor:", err.message);
            reject(err);
            return;
          }
          //console.log("A counters tábla ellenőrizve/létrehozva.");

          const types = ["KÁV", "JÁT", "CSO", "BIL", "SÖR"];
          const stmt = db.prepare(
            "INSERT OR IGNORE INTO counters (type, count, date) VALUES (?, ?, ?)"
          );

          types.forEach((type) => {
            stmt.run(type, 0, new Date().toISOString());
          });

          stmt.finalize((err) => {
            if (err) {
              console.error("Hiba az adatok inicializálásakor:", err.message);
              reject(err);
            } else {
              //console.log("A counters tábla inicializálva.");
              resolve();
            }
          });
        }
      );
    });
  });
}

app.get("/api/counters", async (req, res) => {
  db.all("SELECT * FROM counters", [], (err, rows) => {
    if (err) {
      console.error("Hiba a lekérdezés során:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    //console.log("Lekért adatok:", rows);
    res.json(rows);
  });
});

app.post("/api/update", async (req, res) => {
  const { type, count } = req.body;
  db.run(
    "UPDATE counters SET count = ?, date = ? WHERE type = ?",
    [count, new Date().toISOString(), type],
    function (err) {
      if (err) {
        console.error("Hiba a frissítés során:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Számláló sikeresen frissítve" });
    }
  );
});
/* INFO:INFO: DATABESE connection INFO:INFO: */

/* INFO: induló login képernyő */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/app-admin.html"));
});

/* INFO: admin képernyő */
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/admin.html"));
});

/* INFO: isinstock képernyő */
app.get("/isinstock", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/isInStock.html"));
});

/* INFO: laststock képernyő */
app.get("/laststock", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/laststock.html"));
});

/* INFO: laststockdata */
app.get("/laststockdata", (req, res) => {
  res.sendFile(path.join(__dirname, "/lastLeltar.txt"));
});

/* INFO: számlálók */
app.get("/api/counters", async (req, res) => {
  db.all("SELECT * FROM counters", [], (err, rows) => {
    if (err) {
      console.error("Hiba a lekérdezés során:", err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    //console.log("Lekért adatok:", rows);
    res.json(rows);
  });
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
  res.sendFile(path.join(__dirname, "/views/alapanyagok.html"));
});
/* INFO: updatepultosok */
app.post("/updatepultosok", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("psw.txt", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.sendFile(path.join(__dirname, "/views/pultosok-admin.html"));
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
  res.sendFile(path.join(__dirname, "/views/visibleOrder.html"));
});
/* INFO: pultosokadmin */
app.get("/pultosokadmin", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/pultosok-admin.html"));
});
/* INFO: pultosokadminpsw */
app.get("/pultosokadminpsw", (req, res) => {
  res.sendFile(path.join(__dirname, "/psw.txt"));
});
/* INFO: pultbanvan */
app.get("/pultbanvan", (req, res) => {
  res.sendFile(path.join(__dirname, "/pultbanvan.txt"));
});

/* INFO: kategoriák  categori array send */
app.get("/categories", (req, res) => {
  res.sendFile(path.join(__dirname, "/categories.txt"));
});
/* INFO: teendők  todoList array send */
app.get("/todolist", (req, res) => {
  res.sendFile(path.join(__dirname, "/todolist.txt"));
});
/* INFO: other */
app.get("/otherdata", (req, res) => {
  res.sendFile(path.join(__dirname, "/other.json"));
});

/* INFO: lasttransaction  TOROLNI ??? NEM KELL??? */
app.get("/lasttransaction", (req, res) => {
  res.sendFile(path.join(__dirname, "/last-transaction.json"));
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
  res.sendFile(path.join(__dirname, "/views/alapanyagok.html"));
});
// INFO: TODO HTML
app.get("/todo", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/todo.html"));
});
// INFO: STATISTICS HTML
app.get("/statistics", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/statistics.html"));
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
    req.body.emailsend,
  ];
  con.query(
    "INSERT INTO alapanyagok (nev, mertekegyseg, kiszereles, leltarozando, kritikus, gyujto, keszlet,  beszar, keszletsum, emailsend) VALUES (?)",
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
  res.sendFile(path.join(__dirname, "/views/alapanyagok.html"));
});
// INFO: //inserttermek DATA insert
app.post("/inserttermek", bodyParser.json(), (req, res) => {
  var insertData = [
    req.body.nev,
    req.body.elar,
    req.body.urtartalom,
    req.body.btncolor,
    req.body.visiblesequence,
    req.body.emailsend,
  ];
  con.query(
    "INSERT INTO termekek (nev, elar, urtartalom, btncolor, visiblesequence, emailsend) VALUES (?)",
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
  res.sendFile(path.join(__dirname, "/views/termekek-adatlap.html"));
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
  res.sendFile(path.join(__dirname, "/views/termekek-adatlap.html"));
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
  var emailsend = [req.body.emailsend];

  var id = req.body.id;
  con.query(
    "UPDATE alapanyagok SET nev = ?, mertekegyseg = ?, kiszereles = ?, leltarozando = ?, kritikus = ?, gyujto = ?, keszlet = ?, beszar = ?, keszletsum = ?, emailsend = ? WHERE id = ?",
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
      emailsend,
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
  res.sendFile(path.join(__dirname, "/views/config.html"));
});

/* INFO: forgalom */
app.get("/forgalom", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/forgalom.html"));
});

/* INFO: termekek */
app.get("/termekek", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/termekek.html"));
});
/* INFO: termekek-adatlap */
app.get("/termekek-adatlap", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/termekek-adatlap.html"));
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
  var insertEmailsend = [req.body.emailsend];

  //console.log(insertNev, insertElar, insertBtncolor, insertEmailsend);

  var id = req.body.id;
  con.query(
    "UPDATE termekek SET nev = ?,  elar = ?, btncolor = ?, emailsend = ? WHERE id = ?",
    [insertNev, insertElar, insertBtncolor, insertEmailsend, id],
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
    res.status(200).sendFile(path.join(__dirname, "/views/index.html"));
    /* console.log("loggerMiddleWare is NEMOK 🤔 ");
        return; */
  }
}

app.get("/pult", loggerMiddleWare, (req, res) => {
  res.sendFile(path.join(__dirname, "/views/pult.html"));
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
  //res.sendFile(path.join(__dirname,   "/views/termekek.html"));
});

app.get("/api/transactions", (req, res) => {
  con.query("SELECT * FROM transactions", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(data);
    }
  });
});

app.post("/api/transactions/interval", (req, res) => {
  const { startDate, endDate } = req.body;
  console.log("Received request for interval:", startDate, "-", endDate);

  const query = `
    SELECT * FROM transactions 
    WHERE STR_TO_DATE(trdate, '%Y. %m. %d. %H:%i:%s') >= ? AND STR_TO_DATE(trdate, '%Y. %m. %d. %H:%i:%s') < ?
  `;

  const adjustedStartDate = new Date(startDate);
  adjustedStartDate.setUTCHours(6, 30, 0, 0);

  const adjustedEndDate = new Date(endDate);
  adjustedEndDate.setUTCDate(adjustedEndDate.getUTCDate() + 1);
  adjustedEndDate.setUTCHours(6, 30, 0, 0);

  console.log("Adjusted dates:", adjustedStartDate, "-", adjustedEndDate);

  con.query(query, [adjustedStartDate, adjustedEndDate], (err, data) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      console.log("Found transactions:", data.length);
      res.json(data);
    }
  });
});
