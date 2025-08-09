"use client";

import { useEffect, useRef } from "react";

export default function Chart({ currentPrice, priceHistory, priceChange24h }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || priceHistory.length < 2) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 400;

    const minPrice = Math.min(...priceHistory.map((d) => d.price));
    const maxPrice = Math.max(...priceHistory.map((d) => d.price));
    const priceRange = maxPrice - minPrice || 1;

    let pathData = "";
    let areaData = "";

    priceHistory.forEach((point, index) => {
      const x = (index / (priceHistory.length - 1)) * width;
      const y = height - ((point.price - minPrice) / priceRange) * height;

      if (index === 0) {
        pathData += `M ${x} ${y}`;
        areaData += `M ${x} ${height} L ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
        areaData += ` L ${x} ${y}`;
      }
    });

    areaData += ` L ${width} ${height} Z`;

    svg.innerHTML = `
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${
            priceChange24h >= 0 ? "#00d4ff" : "#ff4444"
          };stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:${
            priceChange24h >= 0 ? "#00d4ff" : "#ff4444"
          };stop-opacity:0" />
        </linearGradient>
      </defs>
      <path d="${areaData}" fill="url(#gradient)" opacity="0.3"/>
      <path d="${pathData}" stroke="${
      priceChange24h >= 0 ? "#00d4ff" : "#ff4444"
    }" strokeWidth="2" fill="none"/>
    `;
  }, [priceHistory, priceChange24h]);

  return (
    <div
      style={{
        background: "#1a1a3a",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #333",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <div style={{ fontSize: "1.4em" }}>라이트코인 (LTC/USD) - 실시간</div>
          <div style={{ fontSize: "0.8em", color: "#666", marginTop: "5px" }}>
            마지막 업데이트: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: "1.8em",
              fontWeight: "bold",
              color: priceChange24h >= 0 ? "#00ff88" : "#ff4444",
            }}
          >
            ${currentPrice?.toFixed(2)}
          </div>
          <div
            style={{
              fontSize: "0.9em",
              color: priceChange24h >= 0 ? "#00ff88" : "#ff4444",
            }}
          >
            {priceChange24h >= 0 ? "+" : ""}
            {priceChange24h.toFixed(2)}% (24h)
          </div>
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: "400px",
          background: "#0a0a1a",
          borderRadius: "8px",
          border: "1px solid #444",
        }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
