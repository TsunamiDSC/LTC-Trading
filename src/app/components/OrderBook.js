"use client";

export default function OrderBook({ orderBook, currentPrice }) {
  const { bids = [], asks = [] } = orderBook;

  // 더미 오더북 데이터 (실제 데이터가 없을 경우)
  const dummyBids =
    bids.length > 0
      ? bids.slice(0, 15)
      : Array.from({ length: 15 }, (_, i) => ({
          price: currentPrice - (i + 1) * 0.1,
          quantity: Math.random() * 1000 + 100,
        }));

  const dummyAsks =
    asks.length > 0
      ? asks.slice(0, 15)
      : Array.from({ length: 15 }, (_, i) => ({
          price: currentPrice + (i + 1) * 0.1,
          quantity: Math.random() * 1000 + 100,
        }));

  const maxQuantity = Math.max(
    ...dummyBids.map((b) => b.quantity),
    ...dummyAsks.map((a) => a.quantity)
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
      <h3
        style={{
          margin: "0 0 15px 0",
          fontSize: "1.1em",
          color: "#fff",
        }}
      >
        오더북
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
        <div>가격(USD)</div>
        <div style={{ textAlign: "right" }}>수량</div>
        <div style={{ textAlign: "right" }}>총합</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* 매도 주문 (Ask) */}
        <div style={{ marginBottom: "10px" }}>
          {dummyAsks.reverse().map((ask, index) => (
            <div
              key={`ask-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
                fontSize: "0.8em",
                padding: "2px 0",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: "100%",
                  background: "rgba(255, 68, 68, 0.1)",
                  width: `${(ask.quantity / maxQuantity) * 100}%`,
                  borderRadius: "2px",
                }}
              />
              <div style={{ color: "#ff4444", zIndex: 1 }}>
                {ask.price?.toFixed(2)}
              </div>
              <div style={{ textAlign: "right", color: "#ccc", zIndex: 1 }}>
                {ask.quantity?.toFixed(2)}
              </div>
              <div style={{ textAlign: "right", color: "#999", zIndex: 1 }}>
                {(ask.price * ask.quantity)?.toFixed(0)}
              </div>
            </div>
          ))}
        </div>

        {/* 현재 가격 */}
        <div
          style={{
            textAlign: "center",
            padding: "10px",
            background: "#222",
            margin: "10px 0",
            borderRadius: "4px",
            fontSize: "1.1em",
            fontWeight: "bold",
            color: "#00d4ff",
          }}
        >
          ${currentPrice?.toFixed(2)}
        </div>

        {/* 매수 주문 (Bid) */}
        <div>
          {dummyBids.map((bid, index) => (
            <div
              key={`bid-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
                fontSize: "0.8em",
                padding: "2px 0",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  height: "100%",
                  background: "rgba(0, 255, 136, 0.1)",
                  width: `${(bid.quantity / maxQuantity) * 100}%`,
                  borderRadius: "2px",
                }}
              />
              <div style={{ color: "#00ff88", zIndex: 1 }}>
                {bid.price?.toFixed(2)}
              </div>
              <div style={{ textAlign: "right", color: "#ccc", zIndex: 1 }}>
                {bid.quantity?.toFixed(2)}
              </div>
              <div style={{ textAlign: "right", color: "#999", zIndex: 1 }}>
                {(bid.price * bid.quantity)?.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
