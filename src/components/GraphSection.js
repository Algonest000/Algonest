import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);
const GraphSection = () => {
  const [chartData, setChartData] = useState(null); // State to store chart data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("User not authenticated. Please log in.");
          setIsLoading(false);
          return;
        }

        // Fetch the chart data from the backend
        const response = await axios.get(" https://7b62714cd9f9.ngrok-free.app/AlgonestDigitals/dashboard.php", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          const { labels, datasets } = response.data.data.chart_data;

          // Transform datasets object into an array format required by Chart.js
          const formattedDatasets = [
            {
              label: "Sample Dataset", // Provide a label for the dataset
              data: datasets.data, // Data points for the chart
              borderColor: "#5A67D8", // Line color
              borderWidth: 2,
              tension: 0.4, // Smooth curves
              pointRadius: 0, // No points
            },
          ];

          // Update the state with transformed data
          setChartData({ labels, datasets: formattedDatasets });
        } else {
          setError(response.data.error);
        }
      } catch (error) {
        setError(error.response?.data?.error || "Failed to fetch chart data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          color: "#A0AEC0",
          font: {
            size: 10,
          },
        },
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (isLoading) return <p>Loading chart data...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!chartData) return <p>No data available to display the chart.</p>;

  return (
    <div className="bg-gray-900 p-4 rounded-lg" style={{ height: "200px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default GraphSection;
