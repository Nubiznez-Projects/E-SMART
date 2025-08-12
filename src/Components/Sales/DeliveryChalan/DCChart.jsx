import React from "react";
import ReactApexChart from "react-apexcharts";

export default function DCChart() {
  const [state, setState] = React.useState({
    series: [44],
    options: {
      chart: {
        type: "donut",
      },
      legend: {
        show: false, // hides the legend
      },
      dataLabels: {
        enabled: false,
      },
      title: {
       // text: "Credit Days", // chart title
        align: "center",
        style: {
          fontSize: "0.7vw",
          fontWeight: "bold",
          color: "#333",
        },
      },
      colors: ["#ff4560"],
      responsive: [
        {
          options: {
            chart: {
              width: "70%",
            },
            legend: false,
          },
        },
      ],
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: {
              show: true,
              value: {
                show: true,
                fontSize: "0.7vw",
                color: "#333",
                offsetY: 0,
                formatter: function (val) {
                  return `${val}%`;
                },
              },
              name: {
                show: false,
              },
              total: {
                show: false,
              },
            },
          },
        },
      },
    },
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="donut"
        height={"50%"}
      />
    </div>
  );
}
