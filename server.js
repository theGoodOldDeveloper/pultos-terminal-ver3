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
const kosarakDb = new sqlite3.Database("./kosarakdb.sqlite");

app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  //console.log(`${req.method} kérés érkezett a ${req.url} útvonalra`);
  next();
});

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
/* FIXME:FIXME SQLITE create tables */
// INFO:FIXME SQLITE KosarTáblák létrehozása
// Módosított a kosarak tábla relációs kapcsolathoz
kosarakDb.serialize(() => {
  kosarakDb.run(`CREATE TABLE IF NOT EXISTS kosarnevek (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kosarMegnevezes TEXT,
    kosarMegnevezesIndex INTEGER,
    kosarMegnevezesPultosNeve TEXT,
    kosarMegnevezesPultosKod TEXT
  )`);

  kosarakDb.run(`CREATE TABLE IF NOT EXISTS kosarak (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kosarnev_id INTEGER,
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
    cl BOOLEAN,
    termekId INTEGER,
    FOREIGN KEY (kosarnev_id) REFERENCES kosarnevek(id)
  )`);
});
/* FIXME:FIXME SQLITE kosarak.db */

// POST: Kosárnév létrehozása kosarakkal együtt
app.post("/api/kosarnevek", (req, res) => {
  //console.log("Beérkező teljes request body:");
  //console.log(JSON.stringify(req.body, null, 2));

  const { kosarNevek, kosarak } = req.body;

  if (!kosarNevek || !kosarak || kosarNevek.length !== kosarak.length) {
    return res.status(400).json({
      error: "Hiányzó vagy érvénytelen adatok: kosarNevek vagy kosarak",
    });
  }

  //console.log("Érkező kosárnév adatok:");
  //console.log(JSON.stringify(kosarNevek, null, 2));

  //console.log("Érkező kosarak adatok:");
  //console.log(JSON.stringify(kosarak, null, 2));

  kosarakDb.serialize(() => {
    kosarakDb.run("BEGIN TRANSACTION");

    const insertKosarAndItems = (kosarnevData, kosarItems) => {
      return new Promise((resolve, reject) => {
        kosarakDb.run(
          `INSERT INTO kosarnevek (kosarMegnevezes, kosarMegnevezesIndex, kosarMegnevezesPultosNeve, kosarMegnevezesPultosKod) 
          VALUES (?, ?, ?, ?)`,
          [
            kosarnevData.kosarMegnevezes,
            kosarnevData.kosarMegnevezesIndex,
            kosarnevData.kosarMegnevezesPultosNeve,
            kosarnevData.kosarMegnevezesPultosKod,
          ],
          function (err) {
            if (err) {
              console.error("Hiba a kosárnév beszúrásakor:", err.message);
              return reject(err);
            }

            const kosarnevId = this.lastID;
            //console.log(`Beszúrt kosárnév ID: ${kosarnevId}`);

            const stmt = kosarakDb.prepare(`
              INSERT INTO kosarak (kosarnev_id, nev, db, eladottbeszar, eladottelar, fizetesmod, transactionnumber, megjegyzes, datum, aId, sumcl, cl, termekId) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const insertPromises = kosarItems.map((kosar, itemIndex) => {
              return new Promise((resolveItem, rejectItem) => {
                stmt.run(
                  [
                    kosarnevId,
                    kosar.nev,
                    kosar.db,
                    kosar.eladottbeszar,
                    kosar.eladottelar,
                    kosar.fizetesmod,
                    kosar.transactionnumber,
                    kosar.megjegyzes,
                    kosar.datum,
                    kosar.aId,
                    kosar.sumcl,
                    kosar.cl,
                    kosar.termekId,
                  ],
                  (err) => {
                    if (err) {
                      console.error(
                        `Hiba a(z) ${itemIndex}. kosár beszúrásakor:`,
                        err.message
                      );
                      rejectItem(err);
                    } else {
                      /* console.log(
                        `A(z) ${itemIndex}. kosár sikeresen beszúrva a ${kosarnevId}. kosárnévhez.`
                      ); */
                      resolveItem();
                    }
                  }
                );
              });
            });

            Promise.all(insertPromises)
              .then(() => {
                stmt.finalize();
                resolve(kosarnevId);
              })
              .catch((error) => {
                stmt.finalize();
                reject(error);
              });
          }
        );
      });
    };

    Promise.all(
      kosarNevek.map((kosarnevData, index) =>
        insertKosarAndItems(kosarnevData, kosarak[index])
      )
    )
      .then((kosarnevIds) => {
        kosarakDb.run("COMMIT");
        //console.log("Tranzakció sikeresen végrehajtva.");
        res.json({
          message: "Kosárnév és kosarak sikeresen mentve",
          kosarnevIds: kosarnevIds,
          insertedKosarCount: kosarak.flat().length,
        });
      })
      .catch((error) => {
        console.error("Hiba a kosarak mentése során:", error);
        kosarakDb.run("ROLLBACK");
        res.status(500).json({ error: error.message });
      });
  });
});
// Kosarak lekérése kosárnév ID alapján
app.get("/api/kosarak/:id", (req, res) => {
  const kosarnevId = req.params.id;
  kosarakDb.all(
    "SELECT * FROM kosarak WHERE kosarnev_id = ?",
    [kosarnevId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});
//BUG-----------------------------------------------------
// GET: Kosárnevek lekérése a hozzájuk tartozó kosarakkal
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

// PUT: Kosárnév és kosarak frissítése
aktualKosarThisIdGlobal = [56];
aktualKosarNevThisIdGlobal = 28;

app.post("/api/updateKosarak", (req, res) => {
  const { state, aktualKosarThisIdGlobal, aktualKosarNevThisIdGlobal } =
    req.body;

  kosarakDb.serialize(() => {
    kosarakDb.run("BEGIN TRANSACTION");

    // Módosított UPDATE statement
    const updateStmt = kosarakDb.prepare(`
      UPDATE kosarak 
      SET db = ?, eladottbeszar = ?, eladottelar = ?, fizetesmod = ?, 
          transactionnumber = ?, megjegyzes = ?, datum = ?, aId = ?, sumcl = ?, cl = ?, termekId = ?
      WHERE kosarnev_id = (SELECT id FROM kosarnevek WHERE kosarMegnevezes = ?) AND nev = ?
    `);

    const insertStmt = kosarakDb.prepare(`
      INSERT INTO kosarak (kosarnev_id, nev, db, eladottbeszar, eladottelar, fizetesmod, 
                           transactionnumber, megjegyzes, datum, aId, sumcl, cl, termekId)
      VALUES ((SELECT id FROM kosarnevek WHERE kosarMegnevezes = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    kosarakDb.get(
      "SELECT kosarMegnevezes FROM kosarnevek WHERE id = ?",
      [aktualKosarNevThisIdGlobal],
      (err, row) => {
        if (err) {
          console.error("Hiba a kosárnév lekérdezésekor:", err);
          kosarakDb.run("ROLLBACK");
          return res
            .status(500)
            .json({ error: "Hiba történt a kosárnév lekérdezésekor." });
        }

        const kosarMegnevezes = row ? row.kosarMegnevezes : null;

        if (!kosarMegnevezes) {
          console.error("Nem található kosárnév az adott ID-val.");
          kosarakDb.run("ROLLBACK");
          return res.status(404).json({ error: "Nem található kosárnév." });
        }

        let updateCount = 0;
        let insertCount = 0;

        state.pult.forEach((item, index) => {
          //console.log(`Feldolgozás alatt álló item:`, item); // Debugging

          if (item.kosarMegnevezes) {
            // Frissítés (UPDATE)

            updateStmt.run(
              item.db,
              item.eladottbeszar,
              item.eladottelar,
              item.fizetesmod,
              item.transactionnumber,
              item.megjegyzes,
              item.datum,
              item.aId,
              item.sumcl,
              item.cl,
              item.termekId,
              item.kosarMegnevezes,
              item.nev,
              function (err) {
                if (err) {
                  console.error("Hiba a kosár frissítésekor:", err);
                } else {
                  updateCount++;
                  console.log(`Frissítve: ${this.changes} sor`);
                }
              }
            );
          } else {
            // Beszúrás (INSERT)
            insertStmt.run(
              kosarMegnevezes,
              item.nev,
              item.db,
              item.eladottbeszar,
              item.eladottelar,
              item.fizetesmod,
              item.transactionnumber,
              item.megjegyzes,
              item.datum,
              item.aId,
              item.sumcl,
              item.cl,
              item.termekId,
              function (err) {
                if (err) {
                  console.error("Hiba az új kosár beszúrásakor:", err);
                } else {
                  insertCount++;
                  //console.log(`Beszúrva: ${this.changes} sor`); // Debugging
                }
              }
            );
          }
        });

        updateStmt.finalize();
        insertStmt.finalize();

        kosarakDb.run("COMMIT", (err) => {
          if (err) {
            console.error("Hiba a tranzakció véglegesítésekor:", err);
            kosarakDb.run("ROLLBACK");
            res.status(500).json({ error: "Hiba történt a művelet során." });
          } else {
            res.json({
              success: true,
              message: `Kosarak sikeresen frissítve és hozzáadva. ${updateCount} frissítés, ${insertCount} új beszúrás.`,
              kosarMegnevezes: kosarMegnevezes,
            });
          }
        });
      }
    );
  });
});

// DELETE: Kosárnév és hozzá tartozó kosarak törlése
app.delete("/api/kosarnevek/:id", (req, res) => {
  const kosarId = req.params.id;
  //console.log("Feldolgozott kosar törlése:😛😛😛😛😛😛😛😛😛😛😛😛 ", kosarId);
  kosarakDb.serialize(() => {
    kosarakDb.run("BEGIN TRANSACTION");

    // Töröljük a kapcsolódó kosarakat
    kosarakDb.run(
      "DELETE FROM kosarak WHERE kosarnev_id = ?",
      [kosarId],
      (err) => {
        if (err) {
          console.error("Hiba a kosarak törlésekor:", err.message);
          kosarakDb.run("ROLLBACK");
          return res.status(500).json({ success: false, error: err.message });
        }

        // Töröljük a kosárnevet
        kosarakDb.run(
          "DELETE FROM kosarnevek WHERE id = ?",
          [kosarId],
          (err) => {
            if (err) {
              console.error("Hiba a kosárnév törlésekor:", err.message);
              kosarakDb.run("ROLLBACK");
              return res
                .status(500)
                .json({ success: false, error: err.message });
            }

            kosarakDb.run("COMMIT", (err) => {
              if (err) {
                console.error(
                  "Hiba a tranzakció véglegesítésekor:",
                  err.message
                );
                return res
                  .status(500)
                  .json({ success: false, error: err.message });
              }
              res.json({
                success: true,
                message:
                  "A kosár és a hozzá tartozó tételek sikeresen törlődtek.",
              });
            });
          }
        );
      }
    );
  });
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

app.post("/backupkosarak", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("backupkosarak.txt", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.end();
});
app.post("/backupkosarnevek", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("backupkosarnevek.txt", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    }
  });
  res.end();
});
/* INFO:INFO:INFO: readbackupkosarak */
app.get("/readbackupkosarak", (req, res) => {
  res.sendFile(__dirname + "/backupkosarak.txt");
});
/* INFO:INFO:INFO: readbackupkosarnevek */
app.get("/readbackupkosarnevek", (req, res) => {
  res.sendFile(__dirname + "/backupkosarnevek.txt");
});

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
  var insertData = [];
  var id = req.body.id;
  var cl = req.body.cl;
  con.query(
    `SELECT keszletsum  FROM alapanyagok WHERE id=${id}`,
    (err, data) => {
      try {
        lekertdata = data[0].keszletsum;
        insertData = Math.round((lekertdata + cl) * 100) / 100;

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
  con.query(
    `SELECT SUM(kibeosszeg) FROM transactions WHERE (trfizetesmod = 'm' OR trfizetesmod = 'c') AND trdate LIKE '%${datum}%'`,
    (err, data) => {
      if (err) throw err;
      if (data[0]["SUM(kibeosszeg)"] == null) {
        data[0]["SUM(kibeosszeg)"] = 0;
      }
      res.send(data);
    }
  );
});
//INFO:VERSION-2:INFO: napi CARD lekerdezes
app.get("/gettransactionssaldocard", (req, res) => {
  let datum = new Date().toLocaleString();
  datum = datum.substring(0, 13);
  con.query(
    `SELECT SUM(kibeosszeg) FROM transactions WHERE trfizetesmod = 'c' AND trdate LIKE '%${datum}%'`,
    (err, data) => {
      if (err) throw err;
      if (data[0]["SUM(kibeosszeg)"] == null) {
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
