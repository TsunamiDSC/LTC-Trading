"use client";

import { useState, useEffect, useRef } from "react";
import TradingChart from "./components/TradingChart";
import TradingPanel from "./components/TradingPanel";
import PositionsList from "./components/PositionsList";
import Header from "./components/Header";
import OrderBook from "./components/OrderBook";
import TradeHistory from "./components/TradeHistory";

export default function Home() {
  const [balance, setBalance] = useState(100000);
  const [positions, setPositions] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [candleData, setCandleData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [priceChange24h, setPriceChange24h] = useState(0);
  const [loading, setLoading] = useState(true);
  const [volume24h, setVolume24h] = useState(0);
  const [high24h, setHigh24h] = useState(0);
  const [low24h, setLow24h] = useState(0);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState([]);

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // 쿠키 관련 함수들
  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const setCookie = (name, value, days = 365) => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
  };

  // WebSocket 연결 및 실시간 데이터
  const connectWebSocket = () => {
    try {
      // Binance WebSocket 사용 (라이트코인 실시간 데이터)
      wsRef.current = new WebSocket(
        "wss://stream.binance.com:9443/ws/ltcusdt@ticker/ltcusdt@trade/ltcusdt@depth10"
      );

      wsRef.current.onopen = () => {
        console.log("WebSocket Connected");
        setLoading(false);
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.e === "24hrTicker") {
          // 24시간 통계 데이터
          const price = parseFloat(data.c);
          const change = parseFloat(data.P);
          const volume = parseFloat(data.v);
          const high = parseFloat(data.h);
          const low = parseFloat(data.l);

          setCurrentPrice(price);
          setPriceChange24h(change);
          setVolume24h(volume);
          setHigh24h(high);
          setLow24h(low);

          // 1초마다 캔들 데이터 업데이트
          updateCandleData(price);
        } else if (data.e === "trade") {
          // 최근 거래 데이터
          const trade = {
            price: parseFloat(data.p),
            quantity: parseFloat(data.q),
            time: data.T,
            isBuyerMaker: data.m,
          };

          setRecentTrades((prev) => [trade, ...prev.slice(0, 49)]); // 최근 50개 거래
        } else if (data.e === "depthUpdate") {
          // 오더북 데이터
          const bids = data.b.map(([price, quantity]) => ({
            price: parseFloat(price),
            quantity: parseFloat(quantity),
          }));
          const asks = data.a.map(([price, quantity]) => ({
            price: parseFloat(price),
            quantity: parseFloat(quantity),
          }));

          setOrderBook({ bids, asks });
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket Disconnected");
        // 3초 후 재연결 시도
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };
    } catch (error) {
      console.error("WebSocket Connection Error:", error);
      // 실패시 HTTP API로 대체
      fallbackToHttpApi();
    }
  };

  // WebSocket 실패시 HTTP API 사용
  const fallbackToHttpApi = () => {
    const fetchPrice = async () => {
      try {
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/24hr?symbol=LTCUSDT"
        );
        const data = await response.json();

        setCurrentPrice(parseFloat(data.lastPrice));
        setPriceChange24h(parseFloat(data.priceChangePercent));
        setVolume24h(parseFloat(data.volume));
        setHigh24h(parseFloat(data.highPrice));
        setLow24h(parseFloat(data.lowPrice));

        updateCandleData(parseFloat(data.lastPrice));
      } catch (error) {
        console.error("Fallback API Error:", error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 1000);
    return () => clearInterval(interval);
  };

  // 캔들 데이터 업데이트 함수
  const updateCandleData = (newPrice) => {
    const now = Date.now();
    const currentMinute = Math.floor(now / 60000) * 60000; // 1분 단위로 정규화

    setCandleData((prev) => {
      const newData = [...prev];
      const lastCandle = newData[newData.length - 1];

      if (!lastCandle || lastCandle.time < currentMinute) {
        // 새로운 캔들 생성
        newData.push({
          time: currentMinute,
          open: newPrice,
          high: newPrice,
          low: newPrice,
          close: newPrice,
          volume: Math.random() * 1000 + 500, // 임시 볼륨
        });
      } else {
        // 기존 캔들 업데이트
        const updated = { ...lastCandle };
        updated.high = Math.max(updated.high, newPrice);
        updated.low = Math.min(updated.low, newPrice);
        updated.close = newPrice;
        updated.volume += Math.random() * 100; // 볼륨 증가
        newData[newData.length - 1] = updated;
      }

      // 최대 200개 캔들 유지
      return newData.slice(-200);
    });
  };

  // 초기 캔들 데이터 생성
  const initializeCandleData = () => {
    const candles = [];
    const now = Date.now();
    let price = 122.5; // 시작 가격

    for (let i = 199; i >= 0; i--) {
      const time = now - i * 60000; // 1분 간격
      const open = price;
      const change = (Math.random() - 0.5) * 2; // -1 ~ +1 변동
      const close = Math.max(100, Math.min(150, price + change));
      const high = Math.max(open, close) + Math.random() * 0.5;
      const low = Math.min(open, close) - Math.random() * 0.5;

      candles.push({
        time,
        open,
        high: Math.max(100, Math.min(150, high)),
        low: Math.max(100, Math.min(150, low)),
        close,
        volume: Math.random() * 1000 + 200,
      });

      price = close;
    }

    setCandleData(candles);
    setCurrentPrice(candles[candles.length - 1].close);
  };

  // 초기화
  useEffect(() => {
    const init = async () => {
      const savedBalance = getCookie("balance");
      const savedPositions = getCookie("positions");

      if (savedBalance) setBalance(parseFloat(savedBalance));
      if (savedPositions) {
        try {
          setPositions(JSON.parse(savedPositions));
        } catch (e) {
          console.error("Failed to parse positions:", e);
        }
      }

      // 초기 캔들 데이터 생성
      initializeCandleData();

      // WebSocket 연결
      connectWebSocket();

      setIsLoaded(true);
    };

    init();

    // 컴포넌트 언마운트시 WebSocket 정리
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // 포지션 실시간 업데이트
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      setPositions((prev) => [...prev]);
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(interval);
  }, [isLoaded]);

  // 데이터 저장
  const saveData = (newBalance, newPositions) => {
    setCookie("balance", newBalance);
    setCookie("positions", JSON.stringify(newPositions));
  };

  // 포지션 열기
  const openPosition = (amount, leverage, direction) => {
    if (amount > balance) {
      alert("잔고가 부족합니다.");
      return false;
    }

    if (!currentPrice) {
      alert("가격 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return false;
    }

    const newPosition = {
      id: Date.now(),
      type: direction,
      amount: amount,
      leverage: leverage,
      entryPrice: currentPrice,
      entryTime: new Date().toLocaleString(),
      size: (amount * leverage) / currentPrice,
    };

    const newBalance = balance - amount;
    const newPositions = [...positions, newPosition];

    setBalance(newBalance);
    setPositions(newPositions);
    saveData(newBalance, newPositions);

    return true;
  };

  // 포지션 청산
  const closePosition = (positionId) => {
    const positionIndex = positions.findIndex((p) => p.id === positionId);
    if (positionIndex === -1) return;

    const position = positions[positionIndex];
    const pnl = calculatePnL(position);

    const newBalance = balance + position.amount + pnl;
    const newPositions = positions.filter((p) => p.id !== positionId);

    setBalance(newBalance);
    setPositions(newPositions);
    saveData(newBalance, newPositions);

    const pnlText =
      pnl >= 0
        ? `+$${pnl.toFixed(2)} 수익`
        : `$${Math.abs(pnl).toFixed(2)} 손실`;
    alert(`포지션이 청산되었습니다. ${pnlText}`);
  };

  // 손익 계산
  const calculatePnL = (position) => {
    if (!currentPrice) return 0;
    const priceChange = currentPrice - position.entryPrice;
    const direction = position.type === "long" ? 1 : -1;
    return priceChange * direction * position.size;
  };

  if (loading || !currentPrice) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0a0a0a",
          color: "#fff",
          gap: "20px",
        }}
      >
        <div style={{ fontSize: "2em" }}>⚡ 실시간 연결중...</div>
        <div style={{ fontSize: "1em", color: "#666" }}>
          Binance WebSocket 연결 중입니다.
        </div>
        <div style={{ fontSize: "0.8em", color: "#444" }}>
          실시간 캔들스틱 차트와 오더북 데이터를 로드하고 있습니다.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#ffffff",
        fontFamily:
          '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "1800px",
          margin: "0 auto",
          padding: "10px",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          minHeight: "100vh",
        }}
      >
        <Header
          balance={balance}
          currentPrice={currentPrice}
          priceChange24h={priceChange24h}
          volume24h={volume24h}
          high24h={high24h}
          low24h={low24h}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px 300px",
            gap: "10px",
            height: "calc(100vh - 180px)",
          }}
        >
          {/* 메인 차트 영역 */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr auto",
              gap: "10px",
            }}
          >
            <TradingChart
              candleData={candleData}
              currentPrice={currentPrice}
              priceChange24h={priceChange24h}
            />
            <TradingPanel
              currentPrice={currentPrice}
              balance={balance}
              onOpenPosition={openPosition}
              high24h={high24h}
              low24h={low24h}
            />
          </div>

          {/* 오더북 */}
          <OrderBook orderBook={orderBook} currentPrice={currentPrice} />

          {/* 거래내역 및 포지션 */}
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr 1fr",
              gap: "10px",
            }}
          >
            <TradeHistory recentTrades={recentTrades} />
            <PositionsList
              positions={positions}
              currentPrice={currentPrice}
              onClosePosition={closePosition}
              calculatePnL={calculatePnL}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
