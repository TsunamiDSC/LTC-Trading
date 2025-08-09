"use client";

import { useEffect, useRef, useState } from "react";

export default function TradingChart({
  candleData,
  currentPrice,
  priceChange24h,
}) {
  const canvasRef = useRef(null);
  const [chartType, setChartType] = useState("candle"); // candle, line, area
  const [timeframe, setTimeframe] = useState("1m"); // 1m, 5m, 15m, 1h

  useEffect(() => {
    if (!canvasRef.current || candleData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    // 고해상도 디스플레이 지원
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // 배경 초기화
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);

    if (candleData.length < 2) return;

    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // 가격 범위 계산
    const prices = candleData.flatMap((d) => [d.high, d.low]);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // 볼륨 최대값
    const maxVolume = Math.max(...candleData.map((d) => d.volume));

    // 그리드 그리기
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;

    // 수평 그리드 (가격)
    for (let i = 0; i <= 10; i++) {
      const y = padding + (i / 10) * chartHeight;
      const price = maxPrice - (i / 10) * priceRange;

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      // 가격 레이블
      ctx.fillStyle = "#666";
      ctx.font = "10px monospace";
      ctx.textAlign = "right";
      ctx.fillText(price.toFixed(2), padding - 5, y + 3);
    }

    // 수직 그리드 (시간)
    for (
      let i = 0;
      i < candleData.length;
      i += Math.max(1, Math.floor(candleData.length / 10))
    ) {
      const x = padding + (i / (candleData.length - 1)) * chartWidth;

      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      // 시간 레이블
      const time = new Date(candleData[i].time);
      ctx.fillStyle = "#666";
      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        x,
        height - 5
      );
    }

    if (chartType === "candle") {
      // 캔들스틱 그리기
      const candleWidth = Math.max(2, chartWidth / candleData.length - 2);

      candleData.forEach((candle, index) => {
        const x = padding + (index / (candleData.length - 1)) * chartWidth;
        const openY =
          padding + ((maxPrice - candle.open) / priceRange) * chartHeight;
        const closeY =
          padding + ((maxPrice - candle.close) / priceRange) * chartHeight;
        const highY =
          padding + ((maxPrice - candle.high) / priceRange) * chartHeight;
        const lowY =
          padding + ((maxPrice - candle.low) / priceRange) * chartHeight;

        const isGreen = candle.close >= candle.open;
        ctx.strokeStyle = isGreen ? "#00ff88" : "#ff4444";
        ctx.fillStyle = isGreen ? "#00ff88" : "#ff4444";

        // 심지 그리기
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();

        // 봉 그리기
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.abs(closeY - openY);

        if (isGreen) {
          ctx.strokeRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        } else {
          ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
        }

        // 볼륨 표시 (하단)
        const volumeHeight = (candle.volume / maxVolume) * 50;
        ctx.fillStyle = isGreen
          ? "rgba(0, 255, 136, 0.3)"
          : "rgba(255, 68, 68, 0.3)";
        ctx.fillRect(
          x - candleWidth / 2,
          height - padding,
          candleWidth,
          -volumeHeight
        );
      });
    } else if (chartType === "line") {
      // 라인 차트
      ctx.strokeStyle = priceChange24h >= 0 ? "#00ff88" : "#ff4444";
      ctx.lineWidth = 2;
      ctx.beginPath();

      candleData.forEach((candle, index) => {
        const x = padding + (index / (candleData.length - 1)) * chartWidth;
        const y =
          padding + ((maxPrice - candle.close) / priceRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    } else if (chartType === "area") {
      // 영역 차트
      const gradient = ctx.createLinearGradient(
        0,
        padding,
        0,
        height - padding
      );
      gradient.addColorStop(
        0,
        priceChange24h >= 0
          ? "rgba(0, 255, 136, 0.3)"
          : "rgba(255, 68, 68, 0.3)"
      );
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();

      candleData.forEach((candle, index) => {
        const x = padding + (index / (candleData.length - 1)) * chartWidth;
        const y =
          padding + ((maxPrice - candle.close) / priceRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, height - padding);
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.lineTo(padding + chartWidth, height - padding);
      ctx.closePath();
      ctx.fill();

      // 라인 추가
      ctx.strokeStyle = priceChange24h >= 0 ? "#00ff88" : "#ff4444";
      ctx.lineWidth = 2;
      ctx.beginPath();

      candleData.forEach((candle, index) => {
        const x = padding + (index / (candleData.length - 1)) * chartWidth;
        const y =
          padding + ((maxPrice - candle.close) / priceRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // 현재 가격 라인
    if (currentPrice) {
      const currentPriceY =
        padding + ((maxPrice - currentPrice) / priceRange) * chartHeight;
      ctx.strokeStyle = "#00d4ff";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(padding, currentPriceY);
      ctx.lineTo(width - padding, currentPriceY);
      ctx.stroke();

      ctx.setLineDash([]);

      // 현재 가격 레이블
      ctx.fillStyle = "#00d4ff";
      ctx.fillRect(width - padding, currentPriceY - 10, 80, 20);
      ctx.fillStyle = "#000";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(
        currentPrice.toFixed(2),
        width - padding + 40,
        currentPriceY + 4
      );
    }
  }, [candleData, chartType, currentPrice, priceChange24h]);

  return (
    <div
      style={{
        background: "#111",
        borderRadius: "8px",
        border: "1px solid #333",
        position: "relative",
      }}
    >
      {/* 차트 컨트롤 */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 10,
          display: "flex",
          gap: "10px",
        }}
      >
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          style={{
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            padding: "5px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          <option value="candle">캔들</option>
          <option value="line">라인</option>
          <option value="area">영역</option>
        </select>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={{
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            padding: "5px",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        >
          <option value="1m">1분</option>
          <option value="5m">5분</option>
          <option value="15m">15분</option>
          <option value="1h">1시간</option>
        </select>
      </div>

      {/* 차트 캔버스 */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "500px",
          display: "block",
        }}
      />
    </div>
  );
}
