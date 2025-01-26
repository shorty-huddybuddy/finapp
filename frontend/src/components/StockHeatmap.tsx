import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export function StockHeatmap() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
      });

      const areaSeries = chart.addAreaSeries({
        topColor: 'rgba(33, 150, 243, 0.56)',
        bottomColor: 'rgba(33, 150, 243, 0.04)',
        lineColor: 'rgba(33, 150, 243, 1)',
        lineWidth: 2,
      });

      // Sample data - replace with actual API data
      const data = [
        { time: '2024-01-01', value: 32.51 },
        { time: '2024-01-02', value: 31.11 },
        { time: '2024-01-03', value: 27.02 },
        { time: '2024-01-04', value: 27.32 },
        { time: '2024-01-05', value: 25.17 },
        { time: '2024-01-06', value: 28.89 },
        { time: '2024-01-07', value: 30.24 },
        { time: '2024-01-08', value: 32.51 },
        { time: '2024-01-09', value: 31.11 },
        { time: '2024-01-10', value: 27.02 },
      ];

      areaSeries.setData(data);

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Market Trends</h3>
      <div ref={chartContainerRef} />
    </div>
  );
}