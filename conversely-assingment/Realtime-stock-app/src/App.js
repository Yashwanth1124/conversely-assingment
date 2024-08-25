import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Dashboard from './components/Dashboard'
import PortfolioTable from './components/PortfolioTable'
import TradeModal from './components/TradeModal'
import './App.css'

const API_KEY = '66491dc23e9c6adf869381ef4e3c97e3'

const App = () => {
  const [stocks, setStocks] = useState([])
  const [user, setUser] = useState({
    name: 'Aimen Sahnoun',
    totalWorth: 4293.25, // Updated to start with initial cash balance
    cashBalance: 4293.25,
  })

  const [searchTerm, setSearchTerm] = useState('') // New state for search term
  const [modalData, setModalData] = useState({
    show: false,
    type: '',
    symbol: '',
  })

  const [fetchError, setFetchError] = useState('')

  const fetchAllStocks = async () => {
    try {
      const response = await axios.get(
        `https://api.marketstack.com/v1/tickers?access_key=${API_KEY}`,
      )
      const allStocks = response.data.data

      if (!allStocks || allStocks.length === 0) {
        setFetchError('No stocks found')
        return
      }

      const updatedStocks = await Promise.all(
        allStocks.map(async stock => {
          try {
            const priceResponse = await axios.get(
              `https://api.marketstack.com/v1/eod/latest?access_key=${API_KEY}&symbols=${stock.symbol}`,
            )

            const currentValue = priceResponse.data.data[0].close || 0 // Get the closing price

            return {
              symbol: stock.symbol,
              name: stock.name,
              amount: 0, // Initialize amount to 0
              currentValue, // Set current value
            }
          } catch (error) {
            console.error(`Error fetching price for ${stock.symbol}:`, error)
            return {
              symbol: stock.symbol,
              name: stock.name,
              amount: 0,
              currentValue: 0, // Set to 0 if error occurs
            }
          }
        }),
      )

      setStocks(updatedStocks)
      setFetchError('')
    } catch (error) {
      console.error('Error fetching all stocks:', error)
      setFetchError(error.message || 'Failed to fetch stocks.')
    }
  }

  useEffect(() => {
    fetchAllStocks() // Fetch all stocks on mount
    const interval = setInterval(fetchAllStocks, 60000) // Update every 60 seconds
    return () => clearInterval(interval)
  }, [])

  const updateUserWorth = () => {
    const totalInvestment = stocks.reduce((acc, stock) => {
      return acc + stock.amount * stock.currentValue // Total investment based on stock amount and current value
    }, 0)

    // Update total worth
    const totalWorth = totalInvestment + user.cashBalance

    setUser(prevUser => ({
      ...prevUser,
      totalWorth, // Update total worth
    }))
  }

  const handleBuy = symbol => {
    setModalData({show: true, type: 'buy', symbol})
  }

  const handleSell = symbol => {
    setModalData({show: true, type: 'sell', symbol})
  }

  const handleTrade = (type, symbol, quantity) => {
    setStocks(prevState =>
      prevState.map(stock => {
        if (stock.symbol === symbol) {
          if (type === 'buy') {
            const totalCost = stock.currentValue * quantity
            if (user.cashBalance >= totalCost) {
              // Update cash balance
              setUser(prevUser => ({
                ...prevUser,
                cashBalance: prevUser.cashBalance - totalCost,
              }))
              return {
                ...stock,
                amount: stock.amount + quantity, // Increase stock amount
              }
            } else {
              alert('Insufficient cash balance to complete the purchase.') // Alert user if insufficient funds
              return stock
            }
          } else {
            const totalRevenue = stock.currentValue * quantity
            return {
              ...stock,
              amount: Math.max(stock.amount - quantity, 0), // Prevent negative amount
            }
          }
        }
        return stock
      }),
    )

    updateUserWorth() // Update total worth after trade
    setModalData({show: false, type: '', symbol: ''})
  }

  // Filter stocks based on the search term
  const filteredStocks = stocks.filter(
    stock =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className='app'>
      <Dashboard
        totalWorth={user.totalWorth}
        cashBalance={user.cashBalance}
        userName={user.name}
        fetchError={fetchError}
      />
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search stocks by symbol or name'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)} // Update search term state
        />
      </div>
      <PortfolioTable
        stocks={filteredStocks}
        onBuy={handleBuy}
        onSell={handleSell}
      />
      {modalData.show && (
        <TradeModal
          type={modalData.type}
          symbol={modalData.symbol}
          onTrade={handleTrade}
          setModalData={setModalData}
        />
      )}
    </div>
  )
}

export default App
