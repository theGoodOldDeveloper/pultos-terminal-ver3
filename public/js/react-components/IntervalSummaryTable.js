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

  const calculateCreditRepayments = (transactions) => {
    return transactions.reduce((total, transaction) => {
      if (!transaction || !transaction.trnumber) {
        console.warn("Invalid transaction:", transaction);
        return total;
      }

      const [trYear, trMonth, trDay, trHour, trMinute, trSecond] =
        transaction.trnumber.split(".").map(Number);
      const trNumberDate = new Date(trYear, trMonth - 1, trDay, 6, 30, 0);

      let trDate;
      if (transaction.trdate) {
        const [trDateYear, trDateMonth, trDateDay, trDateTime] =
          transaction.trdate.split(". ");
        const [trDateHour, trDateMinute, trDateSecond] = trDateTime
          .split(":")
          .map(Number);
        trDate = new Date(
          trDateYear,
          parseInt(trDateMonth) - 1,
          parseInt(trDateDay),
          trDateHour,
          trDateMinute,
          trDateSecond
        );
      } else {
        trDate = new Date(
          trYear,
          trMonth - 1,
          trDay,
          trHour,
          trMinute,
          trSecond
        );
      }

      const nextDay = new Date(trNumberDate);
      nextDay.setDate(nextDay.getDate() + 1);

      if (trDate < trNumberDate || trDate >= nextDay) {
        return total + parseFloat(transaction.kibeosszeg || 0);
      }
      return total;
    }, 0);
  };

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
      // Dátumformátum ellenőrzése és konvertálása
      const convertedTransactions = transactions.map((transaction) => {
        if (transaction.trdate && !isHungarianDateFormat(transaction.trdate)) {
          return {
            ...transaction,
            trdate: convertToHungarianFormat(transaction.trdate),
          };
        }
        return transaction;
      });

      processTransactionData(convertedTransactions);
    } catch (error) {
      console.error("Error fetching interval data:", error);
      alert("Hiba történt az adatok lekérése során");
    }
  };
  // Segédfüggvények a dátumformátum ellenőrzéséhez és konvertálásához
  const isHungarianDateFormat = (dateString) => {
    const regex = /^\d{4}\. \d{2}\. \d{2}\. \d{1,2}:\d{2}:\d{2}$/;
    return regex.test(dateString);
  };

  const convertToHungarianFormat = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}. ${String(date.getDate()).padStart(2, "0")}. ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
      date.getSeconds()
    ).padStart(2, "0")}`;
  };
  const processTransactionData = (transactions) => {
    const summary = {
      kp1: 0,
      kp2: 0,
      card: 0,
      kivet: 0,
      haszon: 0,
      transactions: transactions,
    };

    transactions.forEach((transaction) => {
      if (!transaction || !transaction.trnumber) {
        console.warn("Invalid transaction:", transaction);
        return;
      }

      const amount = parseFloat(transaction.kibeosszeg) || 0;
      let profit = 0;
      const beszar = parseFloat(transaction.kibeosszegbeszar) || 0;

      if (beszar < 1) {
        profit = amount - amount / 2;
      } else {
        profit = amount - beszar;
      }

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
    const creditRepayments = calculateCreditRepayments(data.transactions || []);

    return (
      <>
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
        <tr>
          <td colSpan="7" className="text-right">
            Ebből hitel visszafizetés:
          </td>
          <td className="text-right">{formatNumber(creditRepayments)}</td>
        </tr>
      </>
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
