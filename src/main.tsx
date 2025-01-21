import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { createChart, CrosshairMode } from "lightweight-charts";
import { io } from "socket.io-client";
import "./styles.css";

function App() {
  const chartContainerRef: any = useRef();
  const chart: any = useRef();
  const resizeObserver: any = useRef();
  const candleSeries: any = useRef();

  // Hold the state of the data
  const [priceData, setPriceData] = useState<any>([]);

  useEffect(() => {
    // Create the chart instance
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: "#253248",
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      grid: {
        vertLines: {
          color: "#334158",
        },
        horzLines: {
          color: "#334158",
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: "#485c7b",
      },
      timeScale: {
        borderColor: "#485c7b",
      },
    });

    // Add candlestick series to the chart
    candleSeries.current = chart.current.addCandlestickSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1",
    });

    // Set initial data (empty or initial data)
    candleSeries.current.setData(priceData);

    // Resize chart on container resizes.
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  // WebSocket connection
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      console.log(data);

      // Assuming data contains the new OHLC data in the format
      // { time: timestamp, open: number, high: number, low: number, close: number }

      if (data.event === "newBlock" && data.ohlc) {
        const newCandle = {
          time: data.ohlc.timestamp,
          open: data.ohlc.open,
          high: data.ohlc.high,
          low: data.ohlc.low,
          close: data.ohlc.close,
        };

        // Update chart data with new candlestick

        setPriceData((prevData: any) => {
          // Ensure the new candle is inserted in the correct order
          let updatedData = [...prevData, newCandle];

          // Sort the data by time (ascending)
          updatedData = updatedData.sort((a, b) => a.time - b.time);

          // Optional: Remove duplicates if any time values are the same
          updatedData = updatedData.filter((v, i, arr) => {
            return i === 0 || arr[i - 1].time !== v.time;
          });

          // Limit data to a maximum size if needed (e.g., 100 points)
          if (updatedData.length > 100) {
            updatedData.shift();
          }

          // Update the chart with the sorted data
          return updatedData;
        });
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []); // Ensure WebSocket reconnects if priceData changes

  useEffect(() => {
    candleSeries.current.setData(priceData);
  }, [priceData]);
  return (
    <div className="App">
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
