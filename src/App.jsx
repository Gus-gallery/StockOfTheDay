import { useState, useEffect } from 'react';
import { getBestTechStock } from './api/daily-winner';

function App() {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBestStock();
  }, []);

  const fetchBestStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBestTechStock();
      setStock(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container loading-container">
        <div className="spinner"></div>
        <p>Finder dagens bedste tech-aktie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container error-container">
        <h2>Error at fetching stock</h2>
        <p>{error}</p>
        <button onClick={fetchBestStock}>Try again</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <header>
        <h2 className="text-center text-gray-400 text-xl font-classic">Today's</h2>
        <h1 className="text-center text-gray-200 text-4xl font-classicBold">Stock of the day</h1>
        <p className="text-center text-gray-500 font-classic pb-4">{new Date().toLocaleDateString('en-EN', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </header>

      <div className='flex flex-row justify-center bg-backgroundsecondary rounded-lg shadow-lg p-4 mb-8'>
        <div className="container flex flex-col items-left mx-auto gap-4">
          <div className="flex gap-4 items-center">
            {stock.logo && (
              <img src={stock.logo} alt={stock.name} className="h-16 w-16 rounded-full border border-gray-300" />
            )}
            <div className="flex flex-row gap-4 items-center text-left">
              <h2 className="text-gray-100 font-black text-xl">{stock.name}</h2>
              <p className="text-gray-500 font-regular text-xl">{stock.symbol} • {stock.exchange}</p>
            </div>
          </div>

          <div className="text-3xl text-primary font-black flex-row gap-4">
            <div className="">${stock.price?.toFixed(2)}</div>
            <div className={`change ${stock.changePercent >= 0 ? 'positive' : 'negative'} text-secondary`}>
              {stock.changePercent >= 0 ? '▲' : '▼'} 
              {Math.abs(stock.changePercent)?.toFixed(2)}% 
              (${Math.abs(stock.change)?.toFixed(2)})
            </div>
          </div>

          <div className="grid grid-cols-2 w-1/2 text-lg text-gray-300 font-medium gap-4">
            <div className="">
              <span className="stat-label">Åbning</span>
              <span className="stat-value">${stock.open?.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Høj</span>
              <span className="stat-value">${stock.high?.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Lav</span>
              <span className="stat-value">${stock.low?.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Forrige lukning</span>
              <span className="stat-value">${stock.previousClose?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="container bg-backgroundthird p-4 rounded-md ">
          <div className="">
            <h3 className="text-xl font-bold">Om virksomheden</h3>
            <p className="text-md font-light">{stock.description}</p>
            
            <div className="meta">
              <span className="badge">{stock.industry}</span>
              <span className="badge">{stock.country}</span>
              {stock.marketCap && (
                <span className="badge">Market Cap: ${(stock.marketCap / 1000).toFixed(1)}B</span>
              )}
            </div>

            {stock.website && (
              <a 
                href={stock.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="website-link"
              >
                Besøg hjemmeside →
              </a>
            )}
          </div>

          {stock.news && stock.news.length > 0 && (
            <div className="news-section">
              <h3>Seneste nyheder</h3>
              {stock.news.map((article, index) => (
                <a 
                  key={index}
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="news-item"
                >
                  <h4>{article.headline}</h4>
                  <p>{article.summary}</p>
                  <span className="news-source">{article.source}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer>
        <button onClick={fetchBestStock} className="refresh-btn">
          🔄 Opdater data
        </button>
        <p className="disclaimer">
          Data leveret af Finnhub. Investering indebærer risiko.
        </p>
      </footer>
    </div>
  );
}

export default App;