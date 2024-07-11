import React from 'react'
import ReactDOM from 'react-dom/client'
import MinesweeperGame from './MinesweeperGame.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MinesweeperGame width={30} height={16} bombCount={99}/>
  </React.StrictMode>,
)
