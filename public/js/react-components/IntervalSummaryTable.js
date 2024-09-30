import React, { useState } from "react";

const IntervalSummaryTable = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summaryData, setSummaryData] = useState({
    kp1: 0,
    kp2: 0,
    card: 0,
    kivet: 0,
    haszon: 0,
  });

  const fetchIntervalData = async () => {
    if (!startDate || !endDate) {
      alert("Kérjük, adja meg mind a kezdő, mind a végdátumot!");
      return;
    }

    console.log("Fetching data for interval:", startDate, "-", endDate);

    try {
      const response = await fetch("/api/transactions/interval", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Hiba történt az adatok lekérése során");
      }

      const transactions = await response.json();
      console.log("Received transactions:", transactions);
      processTransactionData(transactions);
    } catch (error) {
      console.error("Error fetching interval data:", error);
      alert("Hiba történt az adatok lekérése során");
    }
  };

  const processTransactionData = (transactions) => {
    const summary = {
      kp1: 0,
      kp2: 0,
      card: 0,
      kivet: 0,
      haszon: 0,
    };

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.kibeosszeg);
      /* BUG  */
      var profit = 0;
      if (parseFloat(transaction.kibeosszegbeszar) < 1) {
        profit =
          parseFloat(transaction.kibeosszeg) -
          parseFloat(transaction.kibeosszeg / 2);
      } else {
        profit =
          parseFloat(transaction.kibeosszeg) -
          parseFloat(transaction.kibeosszegbeszar);
      }
      /* const profit =
      parseFloat(transaction.kibeosszeg) -
      parseFloat(transaction.kibeosszegbeszar);
      */
      /* BUG  */
      if (transaction.trfizetesmod === "k") summary.kp1 += amount;
      else if (transaction.trfizetesmod === "m") summary.kp2 += amount;
      else if (transaction.trfizetesmod === "c") summary.card += amount;
      else if (transaction.trfizetesmod === "b") summary.kivet += amount;

      if (["k", "m", "c"].includes(transaction.trfizetesmod)) {
        summary.haszon += profit;
      }
    });

    setSummaryData(summary);
  };

  const formatNumber = (num) =>
    new Intl.NumberFormat("hu-HU").format(Math.round(num));

  const renderRow = (data) => {
    const total = data.kp1 + data.kp2 + data.card;
    const netto = total + data.kivet;
    return (
      <tr>
        <td>
          {startDate} - {endDate}
        </td>
        <td className="text-right">{formatNumber(data.kp1)}</td>
        <td className="text-right">{formatNumber(data.kp2)}</td>
        <td className="text-right">{formatNumber(data.card)}</td>
        <td className="text-right">{formatNumber(total)}</td>
        <td className="text-right">{formatNumber(data.kivet)}</td>
        <td className="text-right">{formatNumber(netto)}</td>
        <td className="text-right">{formatNumber(data.haszon)}</td>
      </tr>
    );
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4 bg-info p-2">
        Intervallum szerinti lekérdezés
      </h2>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-auto">
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex align-items-center">
                <label htmlFor="startDate" className="me-2 mb-0">
                  START:
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control form-control-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="d-flex align-items-center">
                <label htmlFor="endDate" className="me-2 mb-0">
                  END:
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control form-control-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={fetchIntervalData}
              >
                mehet
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row mb-3 g-3 align-items-end">
        <div className="col-md-4">
          <label htmlFor="startDate" className="form-label">
            Kezdő dátum:
          </label>
          <input
            type="date"
            id="startDate"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="endDate" className="form-label">
            Végdátum:
          </label>
          <input
            type="date"
            id="endDate"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={fetchIntervalData}>
            Lekérdezés
          </button>
        </div>
      </div> */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Időszak</th>
              <th className="text-right">Kp 1</th>
              <th className="text-right">Kp 2</th>
              <th className="text-right">Kártya</th>
              <th className="text-right">Mindösszesen</th>
              <th className="text-right">Kivét</th>
              <th className="text-right">Nettó</th>
              <th className="text-right">Haszon</th>
            </tr>
          </thead>
          <tbody>{renderRow(summaryData)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default IntervalSummaryTable;
