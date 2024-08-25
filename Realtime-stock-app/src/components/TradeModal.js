import React, {useState} from 'react'

const TradeModal = ({type, symbol, onTrade, setModalData}) => {
  const [quantity, setQuantity] = useState(1) // Default quantity to 1

  const handleSubmit = e => {
    e.preventDefault()
    onTrade(type, symbol, parseInt(quantity, 10)) // Call onTrade with the quantity
    setModalData({show: false, type: '', symbol: ''}) // Close the modal after trade
  }

  return (
    <div className="modal">
      {' '}
      {/* Use the modal class for centering */}
      <div className="trade-modal">
        {' '}
        {/* Trade modal content */}
        <h2>
          {type === 'buy' ? 'Buy' : 'Sell'} {symbol}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            min="1" // Prevents buying/selling less than 1 stock
          />
          <button type="submit">{type === 'buy' ? 'Buy' : 'Sell'}</button>
          <button
            type="button"
            onClick={() => setModalData({show: false, type: '', symbol: ''})}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default TradeModal
