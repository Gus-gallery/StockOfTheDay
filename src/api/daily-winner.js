const API_KEY = import.meta.env.VITE_FINNHUB_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export async function getAppleStock() {
  try {
    const response = await fetch(
      `${BASE_URL}/quote?symbol=AAPL&token=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return {
      symbol: 'AAPL',
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc
    };
    
  } catch (error) {
    console.error('Finnhub API error:', error);
    throw error;
  }
}