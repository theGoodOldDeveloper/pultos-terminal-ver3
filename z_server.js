// config.js
require("dotenv").config();
const path = require("path");

module.exports = {
  PORT: process.env.PORT,
  DB_PATH: path.resolve(__dirname, "counters.db"),
  KOSARAK_DB_PATH: path.resolve(__dirname, "kosarak.db"),
  KOSARNEVEK_DB_PATH: path.resolve(__dirname, "kosarnevek.db"),
  MYSQL_CONFIG: {
    host: "localhost",
    user: "pultos",
    password: "Terminal-2022",
    database: "pultosterminal",
  },
};

// db.js
const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql");
const config = require("./config");

const openSqliteDatabase = (dbPath) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      dbPath,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err) => {
        if (err) {
          console.error(`Error opening database ${dbPath}:`, err.message);
          reject(err);
        } else {
          console.log(`Connected to ${dbPath} database.`);
          resolve(db);
        }
      }
    );
  });
};

const initializeCountersDatabase = (db) => {
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
            console.error("Error creating table:", err.message);
            reject(err);
            return;
          }
          console.log("Counters table checked/created.");

          const types = ["KÁV", "JÁT", "CSO", "BIL", "SÖR"];
          const stmt = db.prepare(
            "INSERT OR IGNORE INTO counters (type, count, date) VALUES (?, ?, ?)"
          );

          types.forEach((type) => {
            stmt.run(type, 0, new Date().toISOString());
          });

          stmt.finalize((err) => {
            if (err) {
              console.error("Error initializing data:", err.message);
              reject(err);
            } else {
              console.log("Counters table initialized.");
              resolve();
            }
          });
        }
      );
    });
  });
};

const mysqlConnection = mysql.createConnection(config.MYSQL_CONFIG);

mysqlConnection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

module.exports = {
  openSqliteDatabase,
  initializeCountersDatabase,
  mysqlConnection,
};

// routes/counters.js
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", async (req, res) => {
    db.all("SELECT * FROM counters", [], (err, rows) => {
      if (err) {
        console.error("Error querying:", err.message);
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  router.post("/update", async (req, res) => {
    const { type, count } = req.body;
    db.run(
      "UPDATE counters SET count = ?, date = ? WHERE type = ?",
      [count, new Date().toISOString(), type],
      function (err) {
        if (err) {
          console.error("Error updating:", err.message);
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: "Counter updated successfully" });
      }
    );
  });

  return router;
};

// routes/kosarak.js
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.all("SELECT * FROM kosarak", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  router.post("/", (req, res) => {
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
    db.run(
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

  router.delete("/:id", (req, res) => {
    db.run(`DELETE FROM kosarak WHERE id = ?`, req.params.id, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    });
  });

  return router;
};

// routes/kosarnevek.js
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.all("SELECT * FROM kosarnevek", [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });

  router.post("/", (req, res) => {
    const {
      kosarMegnevezes,
      kosarMegnevezesIndex,
      kosarMegnevezesPultosNeve,
      kosarMegnevezesPultosKod,
    } = req.body;
    db.run(
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

  router.delete("/:id", (req, res) => {
    db.run(
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

  return router;
};

// routes/transactions.js
const express = require("express");
const router = express.Router();

module.exports = (mysqlConnection) => {
  router.post("/insert", (req, res) => {
    const insertData = [
      req.body.trnumber,
      req.body.trdate,
      req.body.trfizetesmod,
      req.body.megjegyzes,
      req.body.pultos,
      req.body.kibeosszeg,
      req.body.kibeosszegbeszar,
    ];
    mysqlConnection.query(
      "INSERT INTO transactions (trnumber, trdate, trfizetesmod, megjegyzes, pultos, kibeosszeg, kibeosszegbeszar) VALUES (?)",
      [insertData],
      (err, data) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.send(data);
      }
    );
  });

  router.patch("/modify", (req, res) => {
    const { trfizetesmod, megjegyzes, id } = req.body;
    mysqlConnection.query(
      "UPDATE transactions SET trfizetesmod = ?, megjegyzes = ? WHERE id = ?",
      [trfizetesmod, megjegyzes, id],
      (err, data) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.send(data);
      }
    );
  });

  // Add other transaction-related routes...

  return router;
};

// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const config = require("./config");
const {
  openSqliteDatabase,
  initializeCountersDatabase,
  mysqlConnection,
} = require("./db");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.json());

let countersDb, kosarakDb, kosarNevekDb;

async function initializeDatabases() {
  countersDb = await openSqliteDatabase(config.DB_PATH);
  await initializeCountersDatabase(countersDb);
  kosarakDb = await openSqliteDatabase(config.KOSARAK_DB_PATH);
  kosarNevekDb = await openSqliteDatabase(config.KOSARNEVEK_DB_PATH);
}

// Routes
app.use("/api/counters", require("./routes/counters")(countersDb));
app.use("/api/kosarak", require("./routes/kosarak")(kosarakDb));
app.use("/api/kosarnevek", require("./routes/kosarnevek")(kosarNevekDb));
app.use("/api/transactions", require("./routes/transactions")(mysqlConnection));

// Existing routes...
app.post("/storeDataKosarak", (req, res) => {
  fs.writeFile("storeDataKosarak.json", JSON.stringify(req.body), (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to store dataKosarak" });
    } else {
      res.json({ message: "DataKosarak stored successfully" });
    }
  });
});

app.get("/getStoreDataKosarak", (req, res) => {
  fs.readFile("storeDataKosarak.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to read data" });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// Add other routes...

async function startServer() {
  try {
    await initializeDatabases();
    app.listen(config.PORT, () => {
      console.log(`Server running at http://localhost:${config.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", () => {
  if (countersDb) countersDb.close();
  if (kosarakDb) kosarakDb.close();
  if (kosarNevekDb) kosarNevekDb.close();
  mysqlConnection.end();
  process.exit(0);
});
