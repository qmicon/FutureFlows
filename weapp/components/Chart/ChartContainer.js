// import Plotly from "plotly.js-dist-min";
import { getGraph } from "@/flow/scripts";
import dynamic from "next/dynamic"
import React, { useEffect } from "react";

const Plotly = dynamic(() => import("plotly.js-dist-min"), { ssr: false, })


const ChartContainer = ({ questionId }) => {

  const fetchGraphData = async () => {
    var data = await getGraph(questionId);
    var yesData = {
      time: [],
      amount: [],
    };
    var noData = {
      time: [],
      amount: [],
    };
    data["0"].forEach((item) => {
      var sum = yesData.amount.reduce((a, b) => a + b, 0);
      yesData.amount.push(
        sum + parseFloat(item[1])
      );
      yesData.time.push(new Date(parseInt(item[2] + "000")));
    });
    data["1"].forEach((item) => {
      var sum = noData.amount.reduce((a, b) => a + b, 0);
      noData.amount.push(
        sum + parseFloat(item[1])
      );
      noData.time.push(new Date(parseInt(item[2] + "000")));
    });

    var yes = {
      x: [...yesData.time],
      y: [...yesData.amount],
      mode: "lines+markers",
      name: "Yes",
    };

    var no = {
      x: [...noData.time],
      y: [...noData.amount],
      mode: "lines+markers",
      name: "No",
    };
    var chartData = [yes, no];

    var layout = {
      title: "YES / NO Graph",
    };

    Plotly.newPlot("myDiv", chartData, layout, { displayModeBar: false });
  };

  useEffect(() => {
    fetchGraphData();
  });

  return (
    <>
      <div id="myDiv"></div>
    </>
  );
};

export default ChartContainer;
