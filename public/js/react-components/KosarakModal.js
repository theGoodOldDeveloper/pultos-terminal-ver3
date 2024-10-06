import React, { useState } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import KosaradatokModal from "./KosaradatokModal";

function KosarakModal({ show, onHide, kosarNevek, kosarak, dailySales }) {
  const [showKosaradatokModal, setShowKosaradatokModal] = useState(false);
  const [selectedKosarNev, setSelectedKosarNev] = useState(null);

  const handleKosaradatokShow = (kosarNev) => {
    setSelectedKosarNev(kosarNev);
    setShowKosaradatokModal(true);
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
                  </tr>
                );
              })}
            </tbody>
          </Table>

          {/* Új rész: Napi összesítések */}
          <h5 className="mt-4">Napi összesítések:</h5>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Dátum</th>
                <th>Összeg</th>
              </tr>
            </thead>
            <tbody>
              {dailySales.map(({ date, amount }) => (
                <tr key={date}>
                  <td>{date}</td>
                  <td className="text-right">{amount.toFixed(0)} Ft</td>
                </tr>
              ))}
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
