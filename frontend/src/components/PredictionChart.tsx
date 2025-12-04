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
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setChartData(null);
        setError(null);

        const response = await axios.get(`${baseUrl}/predict?ticker=${ticker}&number_of_days=10`, {
          timeout: 10000 // 10 second timeout
        });
        console.log(response);
        setChartData(response.data);
        setIsLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        
        let errorMessage = "Unable to fetch prediction data. ";
        if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
          errorMessage += "The ML prediction service is not running. Please start the recommendations_model service on port 8000.";
        } else if (error.response) {
          errorMessage += `Server error: ${error.response.status}`;
        } else {
          errorMessage += "Please check your network connection.";
        }
        
        setError(errorMessage);
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

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center h-80 text-center">
          <svg className="w-16 h-16 text-yellow-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Prediction Service Unavailable</h3>
          <p className="text-gray-600 max-w-md">{error}</p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left max-w-lg">
            <p className="text-sm text-gray-700 font-semibold mb-2">To enable predictions:</p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Navigate to: <code className="bg-gray-200 px-1 rounded">recommendations_model/</code></li>
              <li>Install dependencies: <code className="bg-gray-200 px-1 rounded">pip install -r requirements.txt</code></li>
              <li>Start the service: <code className="bg-gray-200 px-1 rounded">python app.py</code></li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-80 text-gray-500">
          No prediction data available for {ticker}
        </div>
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