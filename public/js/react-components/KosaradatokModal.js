import React from "react";
import { Modal, Table } from "react-bootstrap";

function KosaradatokModal({ show, onHide, kosarNev, kosarak }) {
  const osszesEladasiAr = kosarak.reduce(
    (sum, kosar) => sum + kosar.eladottelar * kosar.db,
    0
  );

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header className="text-center bg-warning" closeButton>
        <Modal.Title>Kosár adatai - {kosarNev?.kosarMegnevezes}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Név</th>
              <th>Darab</th>
              <th>Eladási ár</th>
              <th>Teljes ár</th>
              <th>Fizetési mód</th>
              <th>Dátum</th>
            </tr>
          </thead>
          <tbody>
            {kosarak.map((kosar) => {
              const teljesAr = kosar.eladottelar * kosar.db;
              return (
                <tr key={kosar.id}>
                  <td>{kosar.nev}</td>
                  <td>{kosar.db}</td>
                  <td>{kosar.eladottelar.toFixed(2)} Ft</td>
                  <td>{teljesAr.toFixed(2)} Ft</td>
                  <td>{kosar.fizetesmod}</td>
                  <td>{kosar.datum}</td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={3} className="text-right">
                <strong>Összesen:</strong>
              </td>
              <td>
                <strong>{osszesEladasiAr.toFixed(2)} Ft</strong>
              </td>
              <td colSpan={2}></td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

export default KosaradatokModal;
