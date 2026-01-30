import { useState, useEffect } from 'react';
import { getBestTechStock } from './api/daily-winner';
import StockChart from './components/StockCharts';

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
        <p>Finding Stock of the day...</p>
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

      <div className='flex mt-20 flex-row justify-center bg-backgroundsecondary rounded-lg shadow-lg p-4 mb-8'>
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

          <div className="flex flex-col w-1/2 text-lg text-gray-300 font-medium gap-4">
            <div className="">
              <span className="mr-1">Opening</span>
              <span >${stock.open?.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="mr-1">High</span>
              <span >${stock.high?.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="mr-1">Low</span>
              <span >${stock.low?.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="mr-1">Former close</span>
              <span >${stock.previousClose?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="container bg-backgroundthird p-4 rounded-md ">
          <div className="">
            <h3 className="text-xl text-gray-100 mt-1 mb-2 font-bold">About</h3>
            <p className="text-md text-gray-400 font-light">{stock.description}</p>
            
            <div className="text-md font-light text-gray-300 gap-4">
              <span className="mr-1">{stock.industry}</span>
              <span className="mr-1">{stock.country}</span>
              {stock.marketCap && (
                <span className="mr-1">Market Cap: ${(stock.marketCap / 1000).toFixed(1)}B</span>
              )}
            </div>

            {stock.website && (
              <a 
                href={stock.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline cursor-pointer my-2 inline-block text-secondary hover:text-primary transition font-medium"
              >
                Visit company website
              </a>
            )}
          </div>

          {stock.news && stock.news.length > 0 && (
            <div className="text-gray-400 font-regular">
              <h3 className="text-xl text-gray-100 font-bold mt-4">Latest news</h3>
              {stock.news.map((article, index) => (
                <a 
                  key={index}
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className=""
                >
                  <h4>{article.headline}</h4>
                  <p className="mb-2">{article.summary}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer>
        <p className="md:mt-24 text-sm text-gray-500 text-center font-classic">
          Data delivered by Finnhub.
        </p>
      </footer>
    </div>
  );
}

export default App;