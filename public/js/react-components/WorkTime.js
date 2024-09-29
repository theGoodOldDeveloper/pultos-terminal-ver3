import React, { useState, useEffect } from "react";
import axios from "axios";

const WorkTime = () => {
  const [workTimeData, setWorkTimeData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [pultosNames, setPultosNames] = useState([]);

  useEffect(() => {
    fetchWorkTimeData();
    fetchPultosNames();
  }, []);

  const fetchWorkTimeData = async () => {
    try {
      const response = await axios.get("/api/worktime");
      const processedData = response.data.map((item) => ({
        ...item,
        newDate: new Date(item.trdate.replace(/\./g, "-")),
      }));
      setWorkTimeData(processedData);
    } catch (error) {
      console.error("Error fetching work time data:", error);
    }
  };

  const fetchPultosNames = async () => {
    try {
      const response = await axios.get("/pultosokadminpsw");
      let pultosData;

      // Ellenőrizzük, hogy a válasz már objektum-e vagy string
      if (typeof response.data === "string") {
        pultosData = JSON.parse(response.data);
      } else {
        pultosData = response.data;
      }

      // Csak az első négy pultos nevét vesszük figyelembe
      const names = pultosData.slice(0, 4).map((pultos) => pultos.name);
      setPultosNames(names);
    } catch (error) {
      console.error("Error fetching pultos names:", error);
      // Hiba esetén állítsunk be alapértelmezett neveket
      setPultosNames(["Pultos 0", "Pultos 1", "Pultos 2", "Pultos 3"]);
    }
  };

  const getWorkDay = (date) => {
    const workDayStart = new Date(date);
    workDayStart.setHours(6, 30, 0, 0);
    if (date < workDayStart) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "o":
        return "belépett";
      case "f":
        return "kilépett";
      default:
        return status;
    }
  };

  const calculateWorkHours = (entries) => {
    let totalMinutes = 0;
    let lastEntry = null;

    for (let i = 0; i < entries.length; i++) {
      if (entries[i].trfizetesmod === "o") {
        lastEntry = new Date(entries[i].newDate);
      } else if (entries[i].trfizetesmod === "f" && lastEntry) {
        const exitTime = new Date(entries[i].newDate);
        const diff = exitTime - lastEntry;
        totalMinutes += diff / (1000 * 60);
        lastEntry = null;
      }
    }

    if (lastEntry) {
      // Ha nincs kilépés, számoljunk 23:00-ig
      const endOfDay = new Date(lastEntry);
      endOfDay.setHours(23, 0, 0, 0);
      const diff = endOfDay - lastEntry;
      totalMinutes += diff / (1000 * 60);
    }

    return totalMinutes / 60; // Convert to hours
  };

  const renderTable = (year, month) => {
    const daysInMonth = getDaysInMonth(month, year);
    const pultosok = [0, 1, 2, 3];
    const totalHours = [0, 0, 0, 0];

    const table = (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nap</th>
            {pultosok.map((pultos) => (
              <th key={pultos}>{pultosNames[pultos] || `Pultos ${pultos}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const currentDay = new Date(year, month, day, 6, 30);
            const nextDay = new Date(year, month, day + 1, 6, 30);

            const dayData = workTimeData.filter((item) => {
              const itemDate = new Date(item.newDate);
              return itemDate >= currentDay && itemDate < nextDay;
            });

            const dailyHours = pultosok.map((pultos) => {
              const pultosEntries = dayData.filter(
                (item) => parseInt(item.pultos) === pultos
              );
              const hours = calculateWorkHours(pultosEntries);
              totalHours[pultos] += hours;
              return hours;
            });

            return (
              <tr key={day}>
                <td>{day}</td>
                {pultosok.map((pultos, index) => (
                  <td key={`${day}-${pultos}`}>
                    {dayData
                      .filter((item) => parseInt(item.pultos) === pultos)
                      .map((item) => (
                        <div key={item.id}>
                          {getStatusText(item.trfizetesmod)} -{" "}
                          {formatTime(new Date(item.newDate))}
                        </div>
                      ))}
                    {dailyHours[index] > 0 && (
                      <div>
                        <strong>
                          Munkaidő: {dailyHours[index].toFixed(2)} óra
                        </strong>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
          <tr>
            <td>
              <strong>Összesen</strong>
            </td>
            {totalHours.map((hours, index) => (
              <td key={index}>
                <strong>{hours > 0 ? hours.toFixed(2) + " óra" : ""}</strong>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );

    return table;
  };

  return (
    <div>
      <h2 className="text-center mb-4 bg-info p-2">
        Munkaidő Táblázat - {currentDate.getFullYear()}.{" "}
        {currentDate.getMonth() + 1}. hónap
      </h2>
      {renderTable(currentDate.getFullYear(), currentDate.getMonth())}

      <h2 className="text-center mb-4 bg-info p-2">
        Munkaidő Táblázat - Előző hónap ({currentDate.getFullYear()}.{" "}
        {currentDate.getMonth()}. hónap)
      </h2>
      {renderTable(
        currentDate.getMonth() === 0
          ? currentDate.getFullYear() - 1
          : currentDate.getFullYear(),
        currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1
      )}
    </div>
  );
};

export default WorkTime;
