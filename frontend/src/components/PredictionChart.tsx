// components/PredictionChart.js

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Chart, ChartConfiguration } from "chart.js/auto";
import React from "react";
import { ML_API_URL as baseUrl } from "@/lib/config";
interface PredictionChartProps {
  ticker: string;
}

interface EnsembleModelData {
  Date: string;
  Prediction: string;
}

interface ApiResponse {
  ensemble_model: EnsembleModelData[];
}

interface ChartRef extends HTMLCanvasElement {
  chart?: Chart;
}

const PredictionChart: React.FC<PredictionChartProps> = ({ ticker }) => {
  const chartRef = useRef<ChartRef>(null);
  const [chartData, setChartData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setChartData(null);

        const response = await axios.get(`${baseUrl}/predict?ticker=${ticker}&number_of_days=10`);
        console.log(response);
        setChartData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  // Render the chart when chartData is available
  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy the previous chart instance if it exists
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartData) {
      // Extract data from the API response
      const dates = chartData.ensemble_model.map((entry) =>
        entry.Date.split(" ")[0]
      );

      const predictions = chartData.ensemble_model.map((entry) =>
        parseFloat(entry.Prediction)
      );

      // Create a new chart instance
      chartRef.current.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: `${ticker} Ensemble Model Prediction`,
              data: predictions,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              fill: true,
              tension: 0.1,
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
                text: "Price Prediction ($)",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: `${ticker} Stock Price Prediction`,
              font: {
                size: 16,
                weight: "bold",
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `Price: $${context.parsed.y.toFixed(2)}`;
                },
              },
            },
          },
        },
      } as ChartConfiguration);
    }

    // Cleanup on unmount
    return () => {
      if (chartRef.current?.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, [chartData, ticker]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading data for {ticker}...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <canvas ref={chartRef} width="800" height="400"></canvas>
    </div>
  );
};

export default PredictionChart;