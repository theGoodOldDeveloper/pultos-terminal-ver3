import React from "react";
import Navbar from "./Navbar";
import SummaryTable from "./SummaryTable";

const Statistics = () => {
  return (
    <div className="container-fluid">
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <div className="text-center">
        <div className="card bg-danger text-white">
          <h4 className="card-body">S T A T I S Z T I K Á K</h4>
        </div>
        <br />
      </div>
      <SummaryTable />
    </div>
  );
};

export default Statistics;
