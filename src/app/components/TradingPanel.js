"use client";

import { useState, useEffect } from "react";

export default function TradingPanel({
  currentPrice,
  balance,
  onOpenPosition,
  high24h,
  low24h,
}) {
  const [amount, setAmount] = useState(1000);
  const [leverage, setLeverage] = useState(1);
  const [direction, setDirection] = useState("long");
  const [orderType, setOrderType] = useState("market"); // market, limit
  const [limitPrice, setLimitPrice] = useState(currentPrice);

  useEffect(() => {
    if (currentPrice && orderType === "limit") {
      setLimitPrice(currentPrice);
    }
  }, [currentPrice, orderType]);

  const handleTrade = () => {
    if (!amount || amount <= 0) {
      alert("올바른 투자금액을 입력하세요.");
      return;
    }

    const success = onOpenPosition(amount, leverage, direction);
    if (success) {
      alert(
        `${direction === "long" ? "🚀 롱" : "📉 숏"} 포지션이 개설되었습니다!`
      );
    }
  };

  const calculateLiquidationPrice = () => {
    if (!currentPrice || !leverage) return 0;
    const liquidationDistance = currentPrice / leverage;
    return direction === "long"
      ? currentPrice - liquidationDistance
      : currentPrice + liquidationDistance;
  };

  const potentialPnL = () => {
    const coins = (amount * leverage) / currentPrice;
    const priceChange = direction === "long" ? 1 : -1; // 1달러 변동 기준
    return coins * priceChange;
  };

  return (
    <div
      style={{
        background: "#111",
        borderRadius: "8px",
        border: "1px solid #333",
        padding: "20px",
        height: "280px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "15px",
          height: "100%",
        }}
      >
        {/* 좌측: 주문 입력 */}
        <div>
          <h3
            style={{
              margin: "0 0 15px 0",
              fontSize: "1.1em",
              color: "#fff",
            }}
          >
            주문하기
          </h3>

          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                color: "#ccc",
                fontSize: "0.85em",
              }}
            >
              주문 유형
            </label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                background: "#222",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "#fff",
                fontSize: "0.9em",
              }}
            >
              <option value="market">시장가</option>
              <option value="limit">지정가</option>
            </select>
          </div>

          {orderType === "limit" && (
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#ccc",
                  fontSize: "0.85em",
                }}
              >
                지정가 ($)
              </label>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                step="0.01"
                style={{
                  width: "100%",
                  padding: "8px",
                  background: "#222",
                  border: "1px solid #444",
                  borderRadius: "4px",
                  color: "#fff",
                  fontSize: "0.9em",
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                color: "#ccc",
                fontSize: "0.85em",
              }}
            >
              투자금액 ($)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="투자할 금액"
              min="1"
              style={{
                width: "100%",
                padding: "8px",
                background: "#222",
                border: "1px solid #444",
                borderRadius: "4px",
                color: "#fff",
                fontSize: "0.9em",
              }}
            />
            <div
              style={{
                fontSize: "0.7em",
                color: "#666",
                marginTop: "3px",
              }}
            >
              사용가능: ${balance.toFixed(2)}
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                color: "#ccc",
                fontSize: "0.85em",
              }}
            >
              레버리지: {leverage}x
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={leverage}
              onChange={(e) => setLeverage(parseFloat(e.target.value))}
              style={{
                width: "100%",
                marginBottom: "5px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.7em",
                color: "#666",
              }}
            >
              <span>1x</span>
              <span>10x</span>
              <span>50x</span>
              <span>100x</span>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            <button
              onClick={() => setDirection("long")}
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.9em",
                fontWeight: "bold",
                cursor: "pointer",
                background: direction === "long" ? "#00aa44" : "#00ff88",
                color: "#000",
              }}
            >
              🚀 롱
            </button>
            <button
              onClick={() => setDirection("short")}
              style={{
                padding: "10px",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.9em",
                fontWeight: "bold",
                cursor: "pointer",
                background: direction === "short" ? "#aa2222" : "#ff4444",
                color: "#fff",
              }}
            >
              📉 숏
            </button>
          </div>
        </div>

        {/* 우측: 거래 정보 */}
        <div>
          <h3
            style={{
              margin: "0 0 15px 0",
              fontSize: "1.1em",
              color: "#fff",
            }}
          >
            거래 정보
          </h3>

          <div
            style={{
              background: "#222",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "10px",
              fontSize: "0.85em",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span style={{ color: "#ccc" }}>현재가:</span>
              <span style={{ color: "#00d4ff", fontWeight: "bold" }}>
                ${currentPrice?.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span style={{ color: "#ccc" }}>24h 고가:</span>
              <span style={{ color: "#00ff88" }}>${high24h?.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#ccc" }}>24h 저가:</span>
              <span style={{ color: "#ff4444" }}>${low24h?.toFixed(2)}</span>
            </div>
          </div>

          <div
            style={{
              background: "#222",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              fontSize: "0.85em",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span style={{ color: "#ccc" }}>예상 청산가:</span>
              <span style={{ color: "#ff4444", fontWeight: "bold" }}>
                ${calculateLiquidationPrice().toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#ccc" }}>$1 변동시 손익:</span>
              <span
                style={{
                  color: direction === "long" ? "#00ff88" : "#ff4444",
                  fontWeight: "bold",
                }}
              >
                ${potentialPnL().toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleTrade}
            disabled={amount > balance || !currentPrice}
            style={{
              width: "100%",
              background:
                amount > balance || !currentPrice
                  ? "#333"
                  : direction === "long"
                  ? "#00ff88"
                  : "#ff4444",
              color: direction === "long" ? "#000" : "#fff",
              padding: "12px",
              fontSize: "1em",
              border: "none",
              borderRadius: "4px",
              cursor:
                amount > balance || !currentPrice ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {!currentPrice
              ? "가격 로딩중..."
              : `${direction === "long" ? "🚀 롱" : "📉 숏"} 포지션 열기`}
          </button>

          {leverage > 20 && (
            <div
              style={{
                marginTop: "8px",
                padding: "6px",
                background: "#ff4444",
                color: "#fff",
                borderRadius: "4px",
                fontSize: "0.7em",
                textAlign: "center",
              }}
            >
              ⚠️ 고레버리지 위험
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
