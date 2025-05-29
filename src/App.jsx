import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Grid from './components/Grid'

const Square = ({children,updateBoard, index}) => {
    return (
        <div className="square">
            {children}
        </div>
    )
}

function App() {
    const sampleGrid = Array(30).fill().map(() => Array(30).fill(0));
    const [board,setBoard] = useState(Array(9).fill(null));


    return (
        <main className="board">
            <h1>Tic Tac Toe</h1>
            <section className="game">
                {
                    board.map((_,index) => {
                        return(
                            <Square
                                key={index}
                                index={index}>
                                {board[index]}
                            </Square>
                        )
                    })
                }
            </section>
        </main>
    )
}

export default App
