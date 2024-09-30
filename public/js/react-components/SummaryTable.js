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

    // Módosítás: Ellenőrizzük, hogy a jelenlegi idő 6:30 előtt vagy után van-e
    const isAfter6_30 =
      now.getHours() > 6 || (now.getHours() === 6 && now.getMinutes() >= 30);
    const startOfDay = isAfter6_30
      ? today6_30
      : new Date(today6_30.getTime() - oneDay);
    const endOfDay = isAfter6_30
      ? new Date(today6_30.getTime() + oneDay)
      : today6_30;

    const summary = {
      daily: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
      weekly: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
      monthly: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
      previousMonth: { kp1: 0, kp2: 0, card: 0, kivet: 0, haszon: 0 },
    };

    const startOfWeek = new Date(today6_30.getTime() - 6 * oneDay);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 6, 30);

    // Előző hónap kezelése, figyelembe véve az év váltását
    const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const previousYear =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const startOfPreviousMonth = new Date(
      previousYear,
      previousMonth,
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

      // Módosítás: A napi adatok ellenőrzése az új időintervallummal
      const isToday = trDate >= startOfDay && trDate < endOfDay;
      const isThisWeek = trDate >= startOfWeek && trDate < endOfDay;
      const isThisMonth = trDate >= startOfMonth && trDate < endOfDay;
      const isPreviousMonth =
        trDate >= startOfPreviousMonth && trDate < endOfPreviousMonth;

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
      /* BUG  */

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
