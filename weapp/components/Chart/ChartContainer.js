import { getGraph } from "@/flow/scripts";
import dynamic from "next/dynamic"
import React, { useEffect } from "react";


const ChartContainer = ({ questionId }) => {

  const Plotly = null 

  const fetchGraphData = async () => {
    if(Plotly === null) return
    var data = await getGraph(questionId);
    console.log(data)
    var yesData = {
      time: [],
      amount: [],
    };
    var noData = {
      time: [],
      amount: [],
    };
    data["yesCount"].forEach((item) => {
      var sum = yesData.amount.reduce((a, b) => a + b, 0);
      yesData.amount.push(
        sum + parseFloat(item["amount"])
      );
      yesData.time.push(new Date(parseInt(item["timestamp"])*1000));
    });
    data["noCount"].forEach((item) => {
      var sum = noData.amount.reduce((a, b) => a + b, 0);
      noData.amount.push(
        sum + parseFloat(item["amount"])
      );
      noData.time.push(new Date(parseInt(item["timestamp"])*1000));
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
    import("plotly.js-dist-min").then((obj) => {Plotly = obj; fetchGraphData();})
    
  }, []);

  return (
    <>
      <div id="myDiv"></div>
    </>
  );
};

export default ChartContainer;
