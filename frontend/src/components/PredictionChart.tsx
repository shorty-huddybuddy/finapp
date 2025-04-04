// components/PredictionChart.js

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";
import React from "react"

interface PredictionChartProps {
  ticker: string;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ ticker }) => {
  const chartRef = useRef<HTMLCanvasElement>(null); // Reference for the chart instance
  interface ChartData {
    linear_regression: { Date: string; Prediction: number }[];
    lstm: { Prediction: number[] }[];
    gru: { Prediction: number[] }[];
  }

  const [chartData, setChartData] = useState<ChartData | null>(null); // State to store API data

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/predict?ticker=${ticker}&number_of_days=10`);
         console.log(response)
        setChartData(response.data); // Store the API response in state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [ticker]);

  // Render the chart when chartData is available
  useEffect(() => {
    if (chartData && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Extract data from the API response
      const dates = chartData.linear_regression.map((entry) =>
        entry.Date.split(" ")[0]
      );
      const linearRegressionPredictions = chartData.linear_regression.map(
        (entry) => entry.Prediction
      );
      const lstmPredictions = chartData.lstm.map((entry) => entry.Prediction[0]);
      const gruPredictions = chartData.gru.map((entry) => entry.Prediction[0]);

      // Destroy the previous chart instance if it exists
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      // Create a new chart instance
      chartRef.current.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Linear Regression",
              data: linearRegressionPredictions,
              borderColor: "rgba(75, 192, 192, 1)",
              fill: false,
            },
            {
              label: "LSTM",
              data: lstmPredictions,
              borderColor: "rgba(153, 102, 255, 1)",
              fill: false,
            },
            {
              label: "GRU",
              data: gruPredictions,
              borderColor: "rgba(255, 159, 64, 1)",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Date",
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Prediction",
              },
            },
          },
        },
      });
    }
  }, [chartData]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Prediction Chart</h2>
      <canvas ref={chartRef} width="800" height="400"></canvas>
    </div>
  );
};

export default PredictionChart;