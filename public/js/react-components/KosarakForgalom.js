import React, { useState } from "react";
import { Button } from "react-bootstrap";
import KosarakModal from "./KosarakModal";

function KosarakForgalom() {
  const [showKosarakModal, setShowKosarakModal] = useState(false);
  const [kosarNevek, setKosarNevek] = useState([]);
  const [kosarak, setKosarak] = useState([]);
  const [dailySales, setDailySales] = useState([]);

  const handleKosarakForgalom = () => {
    fetch("/api/kosarnevek")
      .then((response) => response.json())
      .then((data) => {
        const kosarNevekMap = new Map();
        const kosarakArray = [];
        const dailySalesObj = {};

        Object.values(data).forEach((item) => {
          const kosarNev = {
            id: item.id,
            kosarMegnevezes: item.kosarMegnevezes,
            kosarMegnevezesIndex: item.kosarMegnevezesIndex,
            kosarMegnevezesPultosNeve: item.kosarMegnevezesPultosNeve,
            kosarMegnevezesPultosKod: item.kosarMegnevezesPultosKod,
            thisId: item.thisId,
          };

          if (!kosarNevekMap.has(item.kosarMegnevezes)) {
            kosarNevekMap.set(item.kosarMegnevezes, kosarNev);
          }

          item.kosarak.forEach((kosar) => {
            const kosarItem = {
              ...kosar,
              kosarMegnevezes: item.kosarMegnevezes,
              oldKosar: true,
            };
            kosarakArray.push(kosarItem);

            // Dátum formátum kezelése
            let kosarDate;
            if (kosar.datum.includes(".")) {
              // Magyar formátum: "2024. 09. 23. 15:32:05"
              const [year, month, day, time] = kosar.datum.split(". ");
              const [hour, minute] = time.split(":");
              kosarDate = new Date(
                year,
                month - 1,
                parseInt(day),
                parseInt(hour),
                parseInt(minute)
              );
            } else {
              // Angol formátum: "10/7/2024, 6:34:29 PM"
              kosarDate = new Date(kosar.datum);
            }

            // Ha az idő 6:30 előtt van, akkor az előző naphoz tartozik
            if (
              kosarDate.getHours() < 6 ||
              (kosarDate.getHours() === 6 && kosarDate.getMinutes() < 30)
            ) {
              kosarDate.setDate(kosarDate.getDate() - 1);
            }

            // Magyar formátumú dátum létrehozása a szervernek
            const magyarDatum = `${kosarDate.getFullYear()}. ${String(
              kosarDate.getMonth() + 1
            ).padStart(2, "0")}. ${String(kosarDate.getDate()).padStart(
              2,
              "0"
            )}. ${String(kosarDate.getHours()).padStart(2, "0")}:${String(
              kosarDate.getMinutes()
            ).padStart(2, "0")}:${String(kosarDate.getSeconds()).padStart(
              2,
              "0"
            )}`;

            kosarItem.datum = magyarDatum; // Frissítjük a kosár dátumát magyar formátumra

            const dateKey = kosarDate.toISOString().split("T")[0];
            if (!dailySalesObj[dateKey]) {
              dailySalesObj[dateKey] = 0;
            }
            dailySalesObj[dateKey] += kosar.db * kosar.eladottelar;
          });
        });

        const sortedDailySales = Object.entries(dailySalesObj)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, amount]) => ({
            date: date.split("-").reverse().join("."),
            amount: Math.round(amount),
          }));

        setKosarNevek(Array.from(kosarNevekMap.values()));
        setKosarak(kosarakArray);
        setDailySales(sortedDailySales);
        setShowKosarakModal(true);
      })
      .catch((error) => console.error("Hiba a kosarak lekérésekor:", error));
  };

  return (
    <div className="text-center m-4">
      <Button onClick={handleKosarakForgalom}>Kosarak forgalom</Button>
      <KosarakModal
        show={showKosarakModal}
        onHide={() => setShowKosarakModal(false)}
        kosarNevek={kosarNevek}
        kosarak={kosarak}
        dailySales={dailySales}
      />
    </div>
  );
}

export default KosarakForgalom;
