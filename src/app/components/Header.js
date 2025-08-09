"use client";

export default function Header({
  balance,
  currentPrice,
  priceChange24h,
  volume24h,
  high24h,
  low24h,
}) {
  const initialBalance = 100000;
  const totalReturn = (
    ((balance - initialBalance) / initialBalance) *
    100
  ).toFixed(2);

  return (
    <header
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "15px 20px",
        background: "#111",
        borderRadius: "8px",
        marginBottom: "10px",
        border: "1px solid #333",
      }}
    >
      {/* 로고 및 제품명 */}
      <div>
        <h1
          style={{
            fontSize: "1.5em",
            margin: 0,
            background: "linear-gradient(45deg, #f7931a, #00d4ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          ⚡ LTC Pro Trading
        </h1>
        <div style={{ fontSize: "0.7em", color: "#666", marginTop: "2px" }}>
          실시간 WebSocket • 전문 트레이더용
        </div>
      </div>

      {/* 가격 정보 */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
          fontSize: "0.9em",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#666", fontSize: "0.8em" }}>현재가</div>
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
              color: priceChange24h >= 0 ? "#00ff88" : "#ff4444",
              fontSize: "0.9em",
            }}
          >
            {priceChange24h >= 0 ? "+" : ""}
            {priceChange24h?.toFixed(2)}%
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#666", fontSize: "0.8em" }}>24h 고가</div>
          <div style={{ color: "#00ff88", fontWeight: "bold" }}>
            ${high24h?.toFixed(2)}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#666", fontSize: "0.8em" }}>24h 저가</div>
          <div style={{ color: "#ff4444", fontWeight: "bold" }}>
            ${low24h?.toFixed(2)}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#666", fontSize: "0.8em" }}>24h 거래량</div>
          <div style={{ color: "#fff", fontWeight: "bold" }}>
            {volume24h?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* 잔고 정보 */}
      <div style={{ textAlign: "right" }}>
        <div
          style={{
            fontSize: "1.2em",
            color: "#00ff88",
            fontWeight: "bold",
          }}
        >
          ${balance.toFixed(2)}
        </div>
        <div
          style={{
            fontSize: "0.8em",
            color: totalReturn >= 0 ? "#00ff88" : "#ff4444",
          }}
        >
          수익률: {totalReturn}%
        </div>
      </div>
    </header>
  );
}
