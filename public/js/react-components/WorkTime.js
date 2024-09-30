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

  const getWorkDayEntries = (entries, startDate) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const dayEntries = entries.filter(
      (entry) => entry.newDate >= startDate && entry.newDate < endDate
    );

    const firstEntry = dayEntries.find((entry) => entry.trfizetesmod === "o");
    const lastExit = [...dayEntries]
      .reverse()
      .find((entry) => entry.trfizetesmod === "f");

    return { firstEntry, lastExit };
  };

  const calculateWorkHours = (firstEntry, lastExit) => {
    if (!firstEntry) return 0;

    const startTime = new Date(firstEntry.newDate);
    let endTime;

    if (lastExit) {
      endTime = new Date(lastExit.newDate);
    } else {
      endTime = new Date(startTime);
      endTime.setHours(23, 0, 0, 0);
    }

    const diffMinutes = (endTime - startTime) / (1000 * 60);
    return diffMinutes / 60; // Convert to hours
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

            return (
              <tr key={day}>
                <td>{day}</td>
                {pultosok.map((pultos) => {
                  const pultosEntries = workTimeData.filter(
                    (item) => parseInt(item.pultos) === pultos
                  );
                  const { firstEntry, lastExit } = getWorkDayEntries(
                    pultosEntries,
                    currentDay
                  );
                  const hours = calculateWorkHours(firstEntry, lastExit);
                  totalHours[pultos] += hours;

                  return (
                    <td key={`${day}-${pultos}`}>
                      {firstEntry && (
                        <div>
                          Belépés: {formatTime(new Date(firstEntry.newDate))}
                        </div>
                      )}
                      {lastExit && (
                        <div>
                          Kilépés: {formatTime(new Date(lastExit.newDate))}
                        </div>
                      )}
                      {hours > 0 && (
                        <div>
                          <strong>Munkaidő: {hours.toFixed(2)} óra</strong>
                        </div>
                      )}
                    </td>
                  );
                })}
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
