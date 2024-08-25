import React from 'react'
import PortfolioRow from './PortfolioRow'

const PortfolioTable = ({stocks, onBuy, onSell}) => (
  <div className="portfolio-table">
    <h3>Portfolio</h3>
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Name</th>
          <th>Stocks</th>
          <th>Current Value</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {stocks.map(stock => (
          <PortfolioRow
            key={stock.symbol}
            stock={stock}
            onBuy={() => onBuy(stock.symbol)} // Correctly passing the stock symbol
            onSell={() => onSell(stock.symbol)} // Correctly passing the stock symbol
          />
        ))}
      </tbody>
    </table>
  </div>
)

export default PortfolioTable
