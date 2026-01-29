import { useState, useEffect } from 'react';
import { getAppleStock } from './api/daily-winner';

function App() {
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAppleStock();
      setStock(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={fetchStock}>Prøv igen</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Apple Stock (AAPL)</h1>
      
      <div className="stock-card">
        <div className="price">${stock.price?.toFixed(2)}</div>
        
        <div className={`change ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}>
          {stock.changePercent >= 0 ? '▲' : '▼'} 
          {Math.abs(stock.changePercent)?.toFixed(2)}% 
          (${Math.abs(stock.change)?.toFixed(2)})
        </div>
        
        <div className="stats">
          <div>Open: ${stock.open?.toFixed(2)}</div>
          <div>High: ${stock.high?.toFixed(2)}</div>
          <div>Low: ${stock.low?.toFixed(2)}</div>
          <div>Prev Close: ${stock.previousClose?.toFixed(2)}</div>
        </div>
        
        <button onClick={fetchStock}>Refresh</button>
      </div>
    </div>
  );
}

export default App;