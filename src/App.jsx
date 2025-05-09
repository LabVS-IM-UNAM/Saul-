import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Grid from './components/Grid'

function App() {
    const sampleGrid = Array(30).fill().map(() => Array(30).fill(0));
    return (
        <div className="main-container">
            <h1>Juego de la Vida de Jhon Conway</h1>
        </div>
    )
}

export default App
