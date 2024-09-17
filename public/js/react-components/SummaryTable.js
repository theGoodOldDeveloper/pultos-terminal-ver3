import React, { useState, useEffect } from "react";

const SummaryTable = () => {
  const [summaryData, setSummaryData] = useState({
    daily: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
    weekly: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
    monthly: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
    previousMonth: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
  });

  useEffect(() => {
    fetchTransactionData();
  }, []);

  const fetchTransactionData = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      processTransactionData(data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
    }
  };

  const processTransactionData = (transactions) => {
    const now = new Date();
    const today6_30 = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      6,
      30
    );
    const oneDay = 24 * 60 * 60 * 1000;

    const summary = {
      daily: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
      weekly: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
      monthly: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
      previousMonth: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
    };

    const startOfDay = new Date(today6_30.getTime() - oneDay);
    const startOfWeek = new Date(today6_30.getTime() - 6 * oneDay);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 6, 30);
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
      6,
      30
    );
    const endOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      6,
      29,
      59,
      999
    );

    transactions.forEach((transaction) => {
      const trDate = new Date(transaction.trdate);

      const isToday = trDate >= startOfDay && trDate < today6_30;
      const isThisWeek = trDate >= startOfWeek && trDate < today6_30;
      const isThisMonth = trDate >= startOfMonth && trDate < today6_30;
      const isPreviousMonth =
        trDate >= startOfPreviousMonth && trDate < endOfPreviousMonth;

      const amount = parseFloat(transaction.kibeosszeg);
      const profit =
        parseFloat(transaction.kibeosszeg) -
        parseFloat(transaction.kibeosszegbeszar);

      const updateSummary = (period) => {
        if (transaction.trfizetesmod === "k") summary[period].kp1 += amount;
        else if (transaction.trfizetesmod === "m")
          summary[period].kp2 += amount;
        else if (transaction.trfizetesmod === "c")
          summary[period].card += amount;
        else if (transaction.trfizetesmod === "b")
          summary[period].kivet += amount;

        if (["k", "m", "c"].includes(transaction.trfizetesmod)) {
          summary[period].haszon += profit;
        }
      };

      if (isToday) updateSummary("daily");
      if (isThisWeek) updateSummary("weekly");
      if (isThisMonth) updateSummary("monthly");
      if (isPreviousMonth) updateSummary("previousMonth");
    });

    setSummaryData(summary);
  };

  const formatNumber = (num) =>
    new Intl.NumberFormat("hu-HU").format(Math.round(num));

  const renderRow = (label, data) => {
    const total = data.kp1 + data.kp2 + data.card;
    const netto = total + data.kivet;
    return (
      <tr key={label}>
        <td>{label}</td>
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
      <tbody>
        {renderRow("Napi", summaryData.daily)}
        {renderRow("Heti", summaryData.weekly)}
        {renderRow("Havi", summaryData.monthly)}
        {renderRow("Előző havi", summaryData.previousMonth)}
      </tbody>
    </table>
  );
};

export default SummaryTable;
