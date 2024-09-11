/* eslint-disable no-undef */
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv"); /* NOTE: környezeti változó */
const conf = dotenv.config();
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
//BUG: VERSION1:const db = new sqlite3.Database("./counters.db");
const util = require("util");

var port = conf.parsed.PORT;
var mysql = require("mysql");
const app = express();

app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));
app.use(express.json());

/* INFO: MySQL connection */
const dbConfig = {
  host: "localhost",
  user: "pultos",
  password: "Terminal-2022",
  database: "pultosterminal",
};
var con = mysql.createConnection(dbConfig);
/* INFO: MySQL connection */

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected! 😎");
});

/* BUG:FIXME betétdíj */
/* FIXME:FIXME MySQL termekek table extend */
// Ellenőrző fájl neve
const MIGRATION_CHECK_FILE = "migration_completed.txt";
// Promise wrapper a mysql kapcsolathoz
function makeDb(config) {
  const connection = mysql.createConnection(config);
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
    connect() {
      return util.promisify(connection.connect).call(connection);
    },
  };
}
async function runMigration() {
  // Ellenőrizzük, hogy a migráció már megtörtént-e
  if (fs.existsSync(MIGRATION_CHECK_FILE)) {
    console.log("A migráció már egyszer lefutott. Kihagyjuk.");
    return;
  }

  const db = makeDb(dbConfig);

  try {
    await db.connect();

    // Ellenőrizzük, hogy az 'emailsend' oszlop létezik-e már
    const columns = await db.query(
      "SHOW COLUMNS FROM termekek LIKE 'emailsend'"
    );

    if (columns.length === 0) {
      // Ha az oszlop nem létezik, hozzáadjuk
      await db.query(
        "ALTER TABLE termekek ADD COLUMN emailsend TINYINT(1) DEFAULT 0"
      );
      console.log(
        "Az 'emailsend' oszlop sikeresen hozzáadva a 'termekek' táblához."
      );

      // Létrehozzuk az ellenőrző fájlt
      fs.writeFileSync(MIGRATION_CHECK_FILE, "Migration completed");
      console.log("Migráció sikeresen befejezve.");
    } else {
      console.log("Az 'emailsend' oszlop már létezik a 'termekek' táblában.");
    }
  } catch (error) {
    console.error("Hiba történt a migráció során:", error);
  } finally {
    await db.close();
  }
}

// A migrációs szkript futtatása a szerver indításakor
runMigration().catch(console.error);

/* FIXME:FIXME MySQL termekek table extend */

/* INFO:FIXME SQLITE */
/* FIXME:FIXME SQLITE counters.db */
const dbPath = path.resolve(__dirname, "counters.db");
let db;

const kosarakDb = new sqlite3.Database("./kosarak.db");
const kosarNevekDb = new sqlite3.Database("./kosarnevek.db");

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
          console.log("Kapcsolódva a counters.db adatbázishoz.");
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
          console.log("A counters tábla ellenőrizve/létrehozva.");

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
              console.log("A counters tábla inicializálva.");
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
/* FIXME:FIXME SQLITE create tables */
// Táblák létrehozása
kosarakDb.run(`CREATE TABLE IF NOT EXISTS kosarak (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nev TEXT,
  db INTEGER,
  eladottbeszar REAL,
  eladottelar REAL,
  fizetesmod TEXT,
  transactionnumber INTEGER,
  megjegyzes TEXT,
  datum TEXT,
  aId INTEGER,
  sumcl REAL,
  cl BOOLEAN
)`);

kosarNevekDb.run(`CREATE TABLE IF NOT EXISTS kosarnevek (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kosarMegnevezes TEXT,
  kosarMegnevezesIndex INTEGER,
  kosarMegnevezesPultosNeve TEXT,
  kosarMegnevezesPultosKod TEXT
)`);
/* FIXME:FIXME SQLITE kosarak.db */
// Kosarak API végpontok
app.get("/api/kosarak", (req, res) => {
  kosarakDb.all("SELECT * FROM kosarak", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/kosarak", (req, res) => {
  const {
    nev,
    db,
    eladottbeszar,
    eladottelar,
    fizetesmod,
    transactionnumber,
    megjegyzes,
    datum,
    aId,
    sumcl,
    cl,
  } = req.body;
  kosarakDb.run(
    `INSERT INTO kosarak (nev, db, eladottbeszar, eladottelar, fizetesmod, transactionnumber, megjegyzes, datum, aId, sumcl, cl) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nev,
      db,
      eladottbeszar,
      eladottelar,
      fizetesmod,
      transactionnumber,
      megjegyzes,
      datum,
      aId,
      sumcl,
      cl,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.delete("/api/kosarak/:id", (req, res) => {
  kosarakDb.run(
    `DELETE FROM kosarak WHERE id = ?`,
    req.params.id,
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});
/* FIXME:FIXME SQLITE kosarnevek.db */
// Kosárnevek API végpontok
app.get("/api/kosarnevek", (req, res) => {
  kosarNevekDb.all("SELECT * FROM kosarnevek", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/kosarnevek", (req, res) => {
  const {
    kosarMegnevezes,
    kosarMegnevezesIndex,
    kosarMegnevezesPultosNeve,
    kosarMegnevezesPultosKod,
  } = req.body;
  kosarNevekDb.run(
    `INSERT INTO kosarnevek (kosarMegnevezes, kosarMegnevezesIndex, kosarMegnevezesPultosNeve, kosarMegnevezesPultosKod) 
                    VALUES (?, ?, ?, ?)`,
    [
      kosarMegnevezes,
      kosarMegnevezesIndex,
      kosarMegnevezesPultosNeve,
      kosarMegnevezesPultosKod,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

app.delete("/api/kosarnevek/:id", (req, res) => {
  kosarNevekDb.run(
    `DELETE FROM kosarnevek WHERE id = ?`,
    req.params.id,
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});
/* FIXME:FIXME SQLITE */
/* INFO: SQLITE */

/* NOTE: inserttransactions */
app.post("/inserttransactions", bodyParser.json(), (req, res) => {
  const insertData = [
    req.body.trnumber,
    req.body.trdate,
    req.body.trfizetesmod,
    req.body.megjegyzes,
    req.body.pultos,
    req.body.kibeosszeg,
    req.body.kibeosszegbeszar,
  ];
  con.query(
    "INSERT INTO transactions (trnumber, trdate, trfizetesmod, megjegyzes, pultos, kibeosszeg, kibeosszegbeszar) VALUES (?)",
    [insertData],
    (err, data) => {
      try {
        res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );
});

//BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:
/* NOTE:
INFO:INFO: storeDataKosarak */
app.post("/storeDataKosarak", (req, res) => {
  const dataKosarak = req.body;
  //console.log(dataKosarak);

  fs.writeFile("storeDataKosarak.json", JSON.stringify(dataKosarak), (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to store dataKosarak" });
    } else {
      res.json({ message: "DataKosarak stored successfully" });
    }
  });
});
app.get("/getStoreDataKosarak", (req, res) => {
  // Read JSON data from file
  fs.readFile("storeDataKosarak.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to read data" });
    } else {
      //const jsonDataKosarak = data;
      const jsonDataKosarak = JSON.parse(data);
      /* console.log("jsonDataKosarak:", jsonDataKosarak); */
      res.json(jsonDataKosarak);
    }
  });
});
/* NOTE:
INFO:INFO: backupkosarak */
app.post("/backupkosarak", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("backupkosarak.txt", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.end();
});
/* BUG:
INFO:INFO: storeDataKosarNevek */

app.post("/storeDataKosarNevek", (req, res) => {
  const dataNevek = req.body;
  /* console.log(dataNevek); */
  fs.writeFile("storeDataKosarNevek.json", JSON.stringify(dataNevek), (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to store dataNevek" });
    } else {
      console.log("DataNevek stored successfully");
      res.json({ message: "DataNevek stored successfully" });
    }
  });
});
app.get("/getStoreDataKosarNevek", (req, res) => {
  // Read JSON data from file
  fs.readFile("storeDataKosarNevek.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to read data" });
    } else {
      //const jsonDataNevek = data;
      const jsonDataNevek = JSON.parse(data);
      //console.log("jsonDataNevek:", jsonDataNevek);
      res.json(jsonDataNevek);
    }
  });
});
/* BUG:
INFO:INFO: backupkosarnevek */
app.post("/backupkosarnevek", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("backupkosarnevek.txt", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.end();
});
/* BUG: refreshpultbanvan */
/* app.post("/othersave", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("other.json", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.end();
}); */
/* INFO:INFO:INFO: readbackupkosarak */
app.get("/readbackupkosarak", (req, res) => {
  res.sendFile(__dirname + "/backupkosarak.txt");
});
/* INFO:INFO:INFO: readbackupkosarnevek */
app.get("/readbackupkosarnevek", (req, res) => {
  res.sendFile(__dirname + "/backupkosarnevek.txt");
});
//BUG:BUG:BUG:BUG:BUG:BUG:BUG:BUG:

/* NOTE: modifytransactions   */
app.patch("/modifytransactions", bodyParser.json(), (req, res) => {
  const insertDataMod = [req.body.trfizetesmod];
  const insertDataMegjegyzes = [req.body.megjegyzes];
  const id = req.body.id;
  con.query(
    "UPDATE transactions SET trfizetesmod = ?, megjegyzes = ? WHERE id = ?",
    [insertDataMod, insertDataMegjegyzes, id],
    (err, data) => {
      try {
        res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );
});

/* NOTE: insertforgalom  */
app.post("/insertforgalom", bodyParser.json(), (req, res) => {
  const insertData = [
    req.body.transaction_id,
    req.body.termekid,
    req.body.db,
    req.body.eladottbeszar,
    req.body.eladottelar,
    req.body.eladottdate,
    req.body.xkimeresnevid,
  ];

  con.query(
    "INSERT INTO forgalom (transaction_id, termekid, db, eladottbeszar, eladottelar, eladottdate, xkimeresnevid) VALUES (?)",
    [insertData],
    (err, data) => {
      try {
        res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );
});

app.patch("/keszletmodositas", bodyParser.json(), (req, res) => {
  //var insertData = [req.body.sumcl];
  var insertData = [];
  var id = req.body.id;
  //VERSION-2:
  var cl = req.body.cl;
  //var lekertdata = ''
  //console.log('insertData, id, cl, db')
  //console.log(insertData, id, cl, db)
  con.query(
    `SELECT keszletsum  FROM alapanyagok WHERE id=${id}`,
    (err, data) => {
      try {
        //console.log('data ***********************')
        //console.log(data[0].keszletsum)
        //lekertdata = data
        lekertdata = data[0].keszletsum;
        //console.log('lekertdata ------------------------')
        //console.log(lekertdata)

        //console.log('ATVITT DATA/*/*/*/*/*/*/*/*/*/*/*/**/')
        //console.log(lekertdata)
        //let insertData = []
        insertData = Math.round((lekertdata + cl) * 100) / 100;
        //console.log('insertData *-*-*-*-*-*-*-*-*-*-*-*-*-*')
        //console.log(insertData)

        con.query(
          `UPDATE alapanyagok SET keszletsum = ${insertData} WHERE id = ${id}`,
          //[insertData, id],
          (err, data) => {
            try {
              res.send(data);
            } catch {
              if (err) throw err;
            }
          }
        );

        //res.send(data);
      } catch {
        if (err) throw err;
      }
    }
  );

  //VERSION-2:
});

/* INFO: lasttransactionread */
app.get("/lasttransactionread", (req, res) => {
  con.query("SELECT * FROM transaction", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});
/* TODO: //lasttransactionid 😋😋😋😋😋😋*/
app.get("/lasttransactionid", (req, res) => {
  con.query("SELECT max(id) FROM transactions", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});
app.get("/gettransactions", (req, res) => {
  con.query("SELECT * FROM transactions", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});
app.get("/gettransactionshitel/:id", (req, res) => {
  var sendParameter = req.params.id;
  con.query(
    /* "SELECT * FROM transactions WHERE trfizetesmod = 'h'", */
    `SELECT * FROM transactions WHERE trfizetesmod = "${sendParameter}"`,
    (err, data) => {
      if (err) throw err;
      res.send(data);
    }
  );
});
//INFO:VERSION-2:INFO: napi KP2 lekerdezes
app.get("/gettransactionssaldo", (req, res) => {
  let datum = new Date().toLocaleString();
  datum = datum.substring(0, 13);
  //let datumNow = new Date()
  //let datum = `${datumNow.getFullYear()}. ${datumNow.getMonth()} ${datumNow.getDate()}.`
  //let datum = datumNow.getDate() datumNow.getFullYear() datumNow.getMonth
  //console.log("A mai datum: kp2 -> ", datum);
  //BUG: - con.query(`SELECT SUM(kibeosszeg) FROM transactions WHERE trfizetesmod = 'm' AND trdate LIKE '%${datum}%'`, (err, data) => {
  con.query(
    `SELECT SUM(kibeosszeg) FROM transactions WHERE (trfizetesmod = 'm' OR trfizetesmod = 'c') AND trdate LIKE '%${datum}%'`,
    (err, data) => {
      if (err) throw err;
      //console.log('data', data)
      //console.log('data', data[0]["SUM(kibeosszeg)"])
      if (data[0]["SUM(kibeosszeg)"] == null) {
        //console.log('itt a bibi 11111')
        data[0]["SUM(kibeosszeg)"] = 0;
      }
      res.send(data);
    }
  );
  /* con.query("SELECT * FROM transactions WHERE trfizetesmod = 'm' AND GETDATE() = ''", (err, data) => {
        if (err) throw err;
        res.send(data);
    }); */
});
//INFO:VERSION-2:INFO: napi CARD lekerdezes
app.get("/gettransactionssaldocard", (req, res) => {
  let datum = new Date().toLocaleString();
  datum = datum.substring(0, 13);
  //console.log('A mai datum:  card -> ', datum)
  con.query(
    `SELECT SUM(kibeosszeg) FROM transactions WHERE trfizetesmod = 'c' AND trdate LIKE '%${datum}%'`,
    (err, data) => {
      if (err) throw err;
      if (data[0]["SUM(kibeosszeg)"] == null) {
        //console.log('itt a bibi 2222')
        data[0]["SUM(kibeosszeg)"] = 0;
      }
      res.send(data);
    }
  );
});

/* INFO: TESZT 😎😎😎😎😎 termek nev lekeres */
app.get("/datareadtermekektest", (req, res) => {
  con.query("SELECT * FROM termekek ORDER BY visiblesequence", (err, data) => {
    if (err) throw err;
    termekeks = data;
    res.send(data);
  });
});

// INFO: /datareadalapanyagok DATA
app.get("/datareadalapanyagok", (req, res) => {
  con.query("SELECT * FROM alapanyagok", (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

/* INFO: /datareadtermekek */
app.get("/datareadtermekek", (req, res) => {
  con.query(
    //"SELECT * FROM termekek ORDER BY visiblesequence",
    "SELECT * FROM termekek WHERE visible=1 ORDER BY visiblesequence",
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

//VERSION-2:

/* INFO: induló képernyő */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

/* INFO: password authentication */
function loggerMiddleWare(req, res, next) {
  const pin = true;
  if (pin) {
    //console.log("loggerMiddleWare is OK 😋 ");
    next();
  } else {
    /* res.status(401).send("Authentical error is NEMOK 🤔 "); */
    //res.status(200).sendFile(__dirname + "/views/index.html");
    console.log("loggerMiddleWare is NEMOK 🤔 ");
    return;
  }
}

/* INFO: pultosokadminpsw BUG:BUG: password JSON send 😁 BUG:BUG:*/
app.get("/pultosokadminpsw", (req, res) => {
  res.sendFile(__dirname + "/psw.txt");
});
/* BUG: pultosokadminpsw BUG:BUG: password JSON send 😁 BUG:BUG:*/
/* app.get("/otherdata", (req, res) => {
  res.sendFile(__dirname + "/other.json");
}); */

/* INFO: teendők  todoList array send */
app.get("/todolist", (req, res) => {
  res.sendFile(__dirname + "/todolist.txt");
});

app.get("/pult", loggerMiddleWare, (req, res) => {
  res.sendFile(__dirname + "/views/pult.html");
});

/* INFO: server listen */
//BUG: VERSION2: Adatbázis-kapcsolat létrehozása
async function startServer() {
  try {
    await openDatabase();
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Szerver fut a http://localhost:${port} címen`);
    });
  } catch (error) {
    console.error("Nem sikerült elindítani a szervert:", error);
    process.exit(1);
  }
}

startServer();
/* app.listen(port, async () => {
  try {
    await openDatabase();
    console.log(`Szerver fut a http://localhost:${port} címen`);
  } catch (error) {
    console.error("Nem sikerült elindítani a szervert:", error);
    process.exit(1);
  }
}); */
/* 
app.listen(port, () => console.log("server is OK 😋 PORT: " + port));
 */
/* NOTE: /dataread2 */
app.get("/dataread2", (req, res) => {
  con.query("SELECT * FROM termekek", (err, rows) => {
    if (err) throw err;
    var xxx = [];
    let i = 0;
    rows.forEach((row) => {
      xxx[i] += row.nev;
      i++;
    });
    res.send(JSON.stringify(xxx[2]));
  });
});
/* INFO: config */
app.get("/config", (req, res) => {
  res.sendFile(__dirname + "/views/config.html");
});

//BUG:BUG:BUG:BUG:BUG:BUG: torolni
app.get("/lasttransaction", (req, res) => {
  res.sendFile(__dirname + "/last-transaction.json");
});
//BUG:BUG:BUG:BUG:BUG:BUG: torolni

// Alkalmazás leállításakor zárjuk be az adatbázis-kapcsolatot
process.on("SIGINT", () => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error("Hiba az adatbázis bezárásakor:", err.message);
      } else {
        console.log("Adatbázis-kapcsolat lezárva.");
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
