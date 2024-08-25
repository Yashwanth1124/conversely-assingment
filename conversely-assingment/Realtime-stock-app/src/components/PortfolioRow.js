import React from 'react'

const PortfolioRow = ({stock, onBuy, onSell}) => (
  <tr>
    <td>{stock.symbol}</td>
    <td>{stock.name}</td>
    <td>{stock.amount}</td>
    <td>${stock.currentValue ? stock.currentValue.toFixed(2) : 'N/A'}</td>{' '}
    {/* Show N/A if 0 */}
    <td>
      <button className="buy-button" onClick={onBuy}>
        Buy
      </button>
      <button className="sell-button" onClick={onSell}>
        Sell
      </button>
    </td>
  </tr>
)

export default PortfolioRow
