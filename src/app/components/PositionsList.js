"use client";

export default function PositionsList({
  positions,
  currentPrice,
  onClosePosition,
  calculatePnL,
}) {
  if (positions.length === 0) {
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
          justifyContent: "center",
          alignItems: "center",
          color: "#666",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "2em", marginBottom: "10px" }}>📊</div>
        <div style={{ marginBottom: "5px" }}>보유 포지션 없음</div>
        <div style={{ fontSize: "0.8em" }}>
          실시간 거래로 포지션을 열어보세요
        </div>
      </div>
    );
  }

  const totalPnL = positions.reduce(
    (sum, position) => sum + calculatePnL(position),
    0
  );
  const totalInvestment = positions.reduce(
    (sum, position) => sum + position.amount,
    0
  );

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.1em",
            color: "#fff",
          }}
        >
          포지션 ({positions.length})
        </h3>
        <div
          style={{
            fontSize: "0.9em",
            fontWeight: "bold",
            color: totalPnL >= 0 ? "#00ff88" : "#ff4444",
          }}
        >
          {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
        </div>
      </div>

      <div
        style={{
          fontSize: "0.75em",
          color: "#666",
          marginBottom: "8px",
          display: "grid",
          gridTemplateColumns: "60px 50px 1fr 60px",
          gap: "5px",
        }}
      >
        <div>방향</div>
        <div>배수</div>
        <div>손익</div>
        <div></div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {positions.map((position) => {
          const pnl = calculatePnL(position);
          const pnlPercent = ((pnl / position.amount) * 100).toFixed(1);
          const isProfit = pnl >= 0;

          return (
            <div
              key={position.id}
              style={{
                background: "#1a1a1a",
                padding: "8px",
                marginBottom: "6px",
                borderRadius: "4px",
                border: `1px solid ${isProfit ? "#00ff88" : "#ff4444"}`,
                fontSize: "0.8em",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 50px 1fr 60px",
                  gap: "5px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: position.type === "long" ? "#00ff88" : "#ff4444",
                    fontWeight: "bold",
                  }}
                >
                  {position.type === "long" ? "🚀 롱" : "📉 숏"}
                </div>

                <div
                  style={{
                    color: "#ccc",
                    fontWeight: "bold",
                  }}
                >
                  {position.leverage}x
                </div>

                <div>
                  <div
                    style={{
                      color: isProfit ? "#00ff88" : "#ff4444",
                      fontWeight: "bold",
                    }}
                  >
                    {isProfit ? "+" : ""}${pnl.toFixed(2)}
                  </div>
                  <div
                    style={{
                      color: "#999",
                      fontSize: "0.85em",
                    }}
                  >
                    ({pnlPercent}%) • ${position.amount}
                  </div>
                  <div
                    style={{
                      color: "#666",
                      fontSize: "0.8em",
                    }}
                  >
                    진입: ${position.entryPrice.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => onClosePosition(position.id)}
                  style={{
                    background: "#666",
                    color: "#fff",
                    padding: "4px 8px",
                    fontSize: "0.8em",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  청산
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "10px",
          padding: "8px",
          background: "#1a1a1a",
          borderRadius: "4px",
          fontSize: "0.8em",
          display: "flex",
          justifyContent: "space-between",
          color: "#999",
        }}
      >
        <span>총 투자: ${totalInvestment.toFixed(2)}</span>
        <span
          style={{
            color: totalPnL >= 0 ? "#00ff88" : "#ff4444",
            fontWeight: "bold",
          }}
        >
          수익률: {((totalPnL / totalInvestment) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
