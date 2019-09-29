import React, {Component} from 'react';
import Board from '../board/Board';
import './Game.css';

class Game extends Component {
  render() {
    return (
    <div className="Game">
      <h1>Tic Tac Toe</h1>
      <Board/>
    </div>
    );
  }
}

export default Game;