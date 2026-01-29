// src/components/StockChart.jsx
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StockChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <p>No Data</p>
      </div>
    );
  }

  // Find min og max for at sætte Y-axis range
  const prices = data.map(d => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  // Bestem om aktien er oppe eller nede
  const isPositive = data[data.length - 1].close >= data[0].close;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{payload[0].payload.date}</p>
          <p className="tooltip-price">${payload[0].value.toFixed(2)}</p>
          <p className="tooltip-detail">High: ${payload[0].payload.high.toFixed(2)}</p>
          <p className="tooltip-detail">Low: ${payload[0].payload.low.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3>30-dages udvikling</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0.3}
              />
              <stop 
                offset="95%" 
                stopColor={isPositive ? "#10b981" : "#ef4444"} 
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#999"
            style={{ fontSize: '12px' }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[minPrice - padding, maxPrice + padding]}
            stroke="#999"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={CustomTooltip} />
          <Area
            type="monotone"
            dataKey="close"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="chart-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: isPositive ? "#10b981" : "#ef4444" }}></span>
          Lukkekurs
        </span>
      </div>
    </div>
  );
}

export default StockChart;