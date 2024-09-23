import React, { useState } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import KosaradatokModal from "./KosaradatokModal";

function KosarakModal({ show, onHide, kosarNevek, kosarak }) {
  const [showKosaradatokModal, setShowKosaradatokModal] = useState(false);
  const [selectedKosarNev, setSelectedKosarNev] = useState(null);

  const handleKosaradatokShow = (kosarNev) => {
    setSelectedKosarNev(kosarNev);
    setShowKosaradatokModal(true);
  };

  const handlePultraClick = (kosarMegnevezes) => {
    // Implement the PULTRA functionality here
    console.log("PULTRA clicked for:", kosarMegnevezes);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header className="text-center bg-danger text-white" closeButton>
          <Modal.Title>Kosarak forgalom (Betétdíj nélkül!)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Kosáradatok</th>
                <th>Kosár megnevezés</th>
                <th>Index</th>
                <th>Pultos neve</th>
                <th>Pultos kód</th>
                <th>Összes eladási ár</th>
                {/* <th>Művelet</th> */}
              </tr>
            </thead>
            <tbody>
              {kosarNevek.map((kosarNev) => {
                const kosarKosarak = kosarak.filter(
                  (k) => k.kosarMegnevezes === kosarNev.kosarMegnevezes
                );
                const osszesEladasiAr = kosarKosarak.reduce(
                  (sum, kosar) => sum + kosar.eladottelar * kosar.db,
                  0
                );

                return (
                  <tr key={kosarNev.id}>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleKosaradatokShow(kosarNev)}
                      >
                        Kosáradatok
                      </Button>
                    </td>
                    <td>{kosarNev.kosarMegnevezes}</td>
                    <td>{kosarNev.kosarMegnevezesIndex}</td>
                    <td>{kosarNev.kosarMegnevezesPultosNeve}</td>
                    <td className="text-center">
                      {kosarNev.kosarMegnevezesPultosKod}
                    </td>
                    <td className="text-right">
                      {osszesEladasiAr.toFixed(0)} Ft
                    </td>
                    {/* <td>
                      <Button
                        variant="primary"
                        onClick={() =>
                          handlePultraClick(kosarNev.kosarMegnevezes)
                        }
                      >
                        PULTRA
                      </Button>
                    </td> */}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <KosaradatokModal
        show={showKosaradatokModal}
        onHide={() => setShowKosaradatokModal(false)}
        kosarNev={selectedKosarNev}
        kosarak={kosarak.filter(
          (k) => k.kosarMegnevezes === selectedKosarNev?.kosarMegnevezes
        )}
      />
    </>
  );
}

export default KosarakModal;
