import React, {Component} from 'react';
import Square from '../square/Square';
import './Board.css';

class Board extends Component {

  XPLAYER_TURN = 'Player X\'s Turn!';
  OPLAYER_TURN = 'Player O\'s Turn!';

  constructor () {
    super()

    this.state = {
      isGameOver : false,
      gameStatusMessage : this.XPLAYER_TURN,
      squareEnum : {EMPTY : '', xPlayer : 'X', oPlayer : 'O'},
      currentPlayer : 'X',
      board : ['','','','','','','','',''],
      squareIndex : null
    }
  }
 
  updateBoard(squareIndex) {
    if (this.isMoveAllowed(squareIndex)) {
      this.setSquareItem(squareIndex);
    }
  }

  isMoveAllowed(squareIndex) {
    return (!this.state.isGameOver && this.isEmptyPosition(squareIndex));
  }

  isEmptyPosition (squareIndex) {
    return (this.state.board[squareIndex] === this.state.squareEnum.EMPTY);
  }

  setSquareItem(squareIndex) {
    let updatedBoard = this.state.board;
    updatedBoard[squareIndex] = this.state.currentPlayer;
    this.setState({
      board : updatedBoard
    })
  }

  render() {
    return this.createBoard();
  }

  createBoard() {
    return (
    <div className="board">
      <div className="gameStatusMessage">{this.state.gameStatusMessage}</div>
      {this.state.board.map(function (squareItem, squareIndex) {
        return (<Square key={squareIndex} squareIndex={squareIndex} squareItem={squareItem} updateSquare={this.updateBoard.bind(this)} currentPlayer={this.state.currentPlayer} />);
      }.bind(this))}
    </div>
    );
  }
}

export default Board;