import React, { useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import KosarakModal from "./KosarakModal";
import KosaradatokModal from "./KosaradatokModal";

function KosarakForgalom() {
  const [showKosarakModal, setShowKosarakModal] = useState(false);
  const [kosarNevek, setKosarNevek] = useState([]);
  const [kosarak, setKosarak] = useState([]);

  const handleKosarakForgalom = () => {
    fetch("/api/kosarnevek")
      .then((response) => response.json())
      .then((data) => {
        const kosarNevekMap = new Map();
        const kosarakArray = [];

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

          kosarakArray.push(
            ...item.kosarak.map((kosar) => ({
              ...kosar,
              kosarMegnevezes: item.kosarMegnevezes,
              oldKosar: true,
            }))
          );
        });

        setKosarNevek(Array.from(kosarNevekMap.values()));
        setKosarak(kosarakArray);
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
      />
      {/* KosaradatokModal komponenst itt kell majd hozzáadni */}
    </div>
  );
}

export default KosarakForgalom;
