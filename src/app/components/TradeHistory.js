"use client";

import { useEffect, useState } from "react";

export default function TradeHistory({ recentTrades }) {
  const [trades, setTrades] = useState([]);

  // 더미 거래 데이터 생성 (실제 데이터가 없을 경우)
  useEffect(() => {
    if (recentTrades.length === 0) {
      const dummyTrades = Array.from({ length: 50 }, (_, i) => ({
        price: 122 + (Math.random() - 0.5) * 4,
        quantity: Math.random() * 10 + 0.1,
        time: Date.now() - i * 1000 * Math.random() * 60,
        isBuyerMaker: Math.random() > 0.5,
      }));
      setTrades(dummyTrades);
    } else {
      setTrades(recentTrades);
    }
  }, [recentTrades]);

  return (
    <div
      style={{
        background: "#111",
        borderRadius: "8px",
        border: "1px solid #333",
        padding: "15px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          margin: "0 0 15px 0",
          fontSize: "1.1em",
          color: "#fff",
        }}
      >
        최근 거래
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "10px",
          fontSize: "0.75em",
          color: "#666",
          marginBottom: "10px",
          paddingBottom: "5px",
          borderBottom: "1px solid #333",
        }}
      >
        <div>가격</div>
        <div style={{ textAlign: "right" }}>수량</div>
        <div style={{ textAlign: "right" }}>시간</div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {trades.map((trade, index) => (
          <div
            key={`trade-${index}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              fontSize: "0.8em",
              padding: "3px 0",
              borderBottom:
                index < trades.length - 1 ? "1px solid #1a1a1a" : "none",
            }}
          >
            <div
              style={{
                color: trade.isBuyerMaker ? "#ff4444" : "#00ff88",
              }}
            >
              {trade.price?.toFixed(2)}
            </div>
            <div
              style={{
                textAlign: "right",
                color: "#ccc",
              }}
            >
              {trade.quantity?.toFixed(3)}
            </div>
            <div
              style={{
                textAlign: "right",
                color: "#999",
                fontSize: "0.7em",
              }}
            >
              {new Date(trade.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
