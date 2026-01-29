// src/api/finnhub.js
const API_KEY = import.meta.env.VITE_FINNHUB_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

// Hent quote for en bestemt aktie
export async function getQuote(symbol) {
  try {
    const response = await fetch(
      `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return {
      symbol: symbol,
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc
    };
    
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
}

// Hent company profile
export async function getCompanyProfile(symbol) {
  try {
    const response = await fetch(
      `${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      name: data.name,
      description: data.description,
      logo: data.logo,
      industry: data.finnhubIndustry,
      marketCap: data.marketCapitalization,
      website: data.weburl,
      country: data.country,
      exchange: data.exchange
    };
    
  } catch (error) {
    console.error(`Error fetching profile for ${symbol}:`, error);
    return null;
  }
}

// Hent seneste nyheder om en aktie
export async function getStockNews(symbol) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const response = await fetch(
      `${BASE_URL}/company-news?symbol=${symbol}&from=${weekAgo}&to=${today}&token=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.slice(0, 3).map(article => ({
      headline: article.headline,
      summary: article.summary,
      url: article.url,
      source: article.source
    }));
    
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    return [];
  }
}

// Find den bedste tech-aktie
export async function getBestTechStock() {
  try {
    // Liste over populære tech stocks at checke
    // Du kan udvide denne liste med flere
    const techSymbols = [
      'AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA', 
      'TSLA', 'AMD', 'NFLX', 'ADBE', 'CRM',
      'ORCL', 'INTC', 'CSCO', 'AVGO', 'QCOM',
      'TXN', 'AMAT', 'MU', 'LRCX', 'KLAC',
      'SNPS', 'CDNS', 'MRVL', 'FTNT', 'PANW',
      'CRWD', 'ZS', 'DDOG', 'NET', 'SNOW'
    ];
    
    console.log('Fetching quotes for', techSymbols.length, 'tech stocks...');
    
    // Hent quotes for alle aktier
    const quotePromises = techSymbols.map(symbol => getQuote(symbol));
    const quotes = await Promise.all(quotePromises);
    
    // Filtrer null values og sorter efter changePercent
    const validQuotes = quotes
      .filter(q => q !== null && q.changePercent !== undefined)
      .sort((a, b) => b.changePercent - a.changePercent);
    
    if (validQuotes.length === 0) {
      throw new Error('Ingen data tilgængelig');
    }
    
    // Tag den bedste performer
    const winner = validQuotes[0];
    
    console.log('Winner:', winner.symbol, 'with', winner.changePercent, '% change');
    
    // Hent ekstra info om vinderen
    const [profile, news] = await Promise.all([
      getCompanyProfile(winner.symbol),
      getStockNews(winner.symbol)
    ]);
    
    return {
      ...winner,
      ...profile,
      news: news
    };
    
  } catch (error) {
    console.error('Error finding best tech stock:', error);
    throw error;
  }
}