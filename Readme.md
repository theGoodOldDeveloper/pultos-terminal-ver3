pult.js 488
admin.js 9
pultosok-admin.js 64
termekek.js 266

NOTE: megjegyzes
INFO: FONTOS
TODO:
HACK:
BUG:
FIXME:
VERSION-2:

// lastTransaction: [],
// NOTE: Ezek kellenek a forgalom adatokhoz
/\*
q======================================================================
termék (transaction) :HACK:

-   id
-   transaction number FIXME:FIXME:
-   date
-   pultos
-   fizetés: kp, kártya, hitel, leltár, beszállító kifizetés FIXME:
    --- k: kp
    --- m: kp2
    --- c: bank card
    --- h: hitel (info: kie a hitel) NOTE:
    --- l: leltar (info: ???) NOTE:
    --- b: beszállító kifizetés (info: kinek let kifizetve) NOTE:
    --- o: pultos beléptetése
    --- f: pultos kiléptetése
-   info FIXME:
    q======================================================================
    termék (transaction item) :HACK:
-   -   transaction number_id FIXME:FIXME:
-   termék id FIXME:
-   db FIXME:
-   adott eladási kiszereles beszar FIXME:
-   adott eladási kiszereles elar FIXME:
-   xkimeresnev id FIXME:
    q======================================================================
-   cl: azonnali FIXME:
-   sumcl: azonnali FIXME:
    q======================================================================
    INFO: ha a kiszereles_id i
-   _1_ adalek (termek) id x
-   _1_ xkimeresnev id x
-   _2_ adalek (termek) id y
-   _2_ xkimeresnev id y
    INFO: ha a kiszereles_id i

-   kevert ital osszetevo
-   xkimeresnev urtartalom || 0 HACK: keszlet \* cl-ból vonódik ez a mennyiség
-   termek cl || 0 HACK: keszlet \* cl-ból vonódik ez a mennyiség

...NOTE: átgondolni még, hogy mi kell
...NOTE: cl vagy darab készletcsökkentése !!! ha 2 vagy 1 vonja a cl-t
2-nél nagyobb csökkentse a db
NEM és NEM ha 2-nél nagyobb a urtartalom = urtartalom _ 1
INFO: a keszlet az összkészlet legyen INFO:
INFO: az urtartalom => db vagy urtartalom INFO:
INFO: cl => ha 2 urtartalom / 10;;; 3-tól urtartalom _ 1 INFO: OKK
INFO: cl => ha 1 ott 0, ugyanis az összetevők űrtartalma INFO: OKK
INFO: cl => ha 1 vonódik le összetevőnként küln-külön 😋 INFO:
INFO: A termékekhez kell egy jelenlegi készlet mező 😎🦉😎 INFO:
...NOTE: osszesen elar \* db => mindösszesen sor

...NOTE: készletfelvitelnél az adatbázisba küldöm a "valtoztatas"-t és =>
...NOTE: növelem a "keszletet" darabra és a "sumcl"-t ill. ha "csoport_id" = 2 =>
...NOTE: akkor a "sumcl" = "valtozas" \* 100 - zal növelem
