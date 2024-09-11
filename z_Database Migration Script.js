const mysql = require("mysql");
const util = require("util");
const fs = require("fs");

// Adatbázis kapcsolódási adatok
const dbConfig = {
  host: "localhost",
  user: "pultos",
  password: "Terminal-2022",
  database: "pultosterminal",
};

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

  const con = makeDb(dbConfig);

  try {
    await con.connect();

    // Ellenőrizzük, hogy az 'emailsend' oszlop létezik-e már
    const columns = await con.query(
      "SHOW COLUMNS FROM termekek LIKE 'emailsend'"
    );

    if (columns.length === 0) {
      // Ha az oszlop nem létezik, hozzáadjuk
      await con.query(
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
    await con.close();
  }
}

// A migrációs szkript futtatása a szerver indításakor
runMigration().catch(console.error);

// Itt folytatódik a normál server.js kód...
const express = require("express");
const app = express();

// ... (többi Express.js beállítás és útvonal)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Szerver fut a következő porton: ${PORT}`);
});
