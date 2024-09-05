const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv"); /* NOTE: környezeti változó */
const conf = dotenv.config();
const fs = require("fs");
var port = conf.parsed.PORT;
var mysql = require("mysql");
const app = express();

app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/img"));
app.use(express.json());

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
      console.log("jsonDataNevek:", jsonDataNevek);
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
/* INFO: refreshpultbanvan */
app.post("/othersave", bodyParser.json(), (req, res) => {
  const content = req.body.data;
  fs.writeFile("other.json", JSON.stringify(content), (err) => {
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
  var db = req.body.db;
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
  console.log("A mai datum: kp2 -> ", datum);
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

/* INFO: MySQL connection */
var con = mysql.createConnection({
  host: "localhost",
  user: "pultos",
  password: "Terminal-2022",
  database: "pultosterminal",
});
/* INFO: MySQL connection */

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected! 😎");
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
    console.log("loggerMiddleWare is OK 😋 ");
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
app.get("/otherdata", (req, res) => {
  res.sendFile(__dirname + "/other.json");
});

/* INFO: teendők  todoList array send */
app.get("/todolist", (req, res) => {
  res.sendFile(__dirname + "/todolist.txt");
});

app.get("/pult", loggerMiddleWare, (req, res) => {
  res.sendFile(__dirname + "/views/pult.html");
});
app.listen(port, () => console.log("server is OK 😋 PORT: " + port));

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
