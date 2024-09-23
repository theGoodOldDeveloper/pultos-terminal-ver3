###########
# psw.txt #
# env     #
###########

## (BAF) SSH pultos terminal

# database: alapanyagok.emailsend -> betétdíjas-e 😊

# kosarak database: transactionnumber -> tId 😊 (termek id)

visszavalthato = 0,1

### 1366x768-as felbontás

# betetdij

a transactionba benne van a +50 Ft
a forgalomban NINCS a beteetdij
a forgalom a termékekre lebontott fogyás
a tranaction a személyekre lebontott fizetés, workTime, kasszából kivét

- trnumber: "2024.9.14.17.32.45.373"
- trdate: "2024. 09. 14. 17:23:57"

# FIRST 😎😎😎 repair (copy 12 file)

TO LEAVE:
eslint.config.mjs
storeDataKosarak.json
storeDataKosarNevek.json

REMOVE:

- other.txt
- psw.json

HAND REPAIRE:
psw.txt ,{"pin":50,"name":"BD"}

# pm2 restart app_name

# pm2 status

# SQLite 👑

npm install sqlite3

# SECOND 😎😎😎 repair (summ 8 file)

TO LEAVE:
counters.db

REMOVE:
other.json

### Kosarak databases struktura

"id": number,
"nev": string,
"db": number,
"eladottbeszar": number,
"eladottelar": number,
"fizetesmod": string,
"transactionnumber": number,
"megjegyzes": string,
"datum": dátum,
"aId": number,
"sumcl": number,
"cl": boolean

"kosarMegnevezes": string,
"kosarMegnevezesIndex": number,
"kosarMegnevezesPultosNeve": string,
"kosarMegnevezesPultosKod": string
