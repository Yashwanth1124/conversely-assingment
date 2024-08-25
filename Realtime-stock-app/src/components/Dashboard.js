import React from 'react'

const Dashboard = ({totalWorth, cashBalance, userName}) => (
  <div className="dashboard">
    <h2>Dashboard</h2>
    <p>Total Worth: ${totalWorth}</p>
    <p>Cash Balance: ${cashBalance}</p>
  </div>
)

export default Dashboard
