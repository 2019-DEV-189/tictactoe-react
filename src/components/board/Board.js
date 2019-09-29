import React, {Component} from 'react';
import Square from '../square/Square';
import './Board.css';

class Board extends Component {

  XPLAYER_TURN = 'Player X\'s Turn!';
  OPLAYER_TURN = 'Player O\'s Turn!';
  XPLAYER_WINS = 'Player X Wins!';
  OPLAYER_WINS = 'Player O Wins!';

  statusMessages = {
    "turn": { "X": this.XPLAYER_TURN, "O": this.OPLAYER_TURN},
    "won":  { "X": this.XPLAYER_WINS, "O": this.OPLAYER_WINS},
  }

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
      this.checkGameStatus();
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

  checkGameStatus() {
    if (this.isWon()) {
      this.setGameStatus(true, this.getStatusMessage('won', this.state.currentPlayer));
    }
    else if (this.isBoardFull()) {
      this.setState({ isGameOver : true})
    }
    else {
      this.nextMove();
    }
  }

  isWon() {
    return this.isTriplet();
  }

  isBoardFull() {
    for (const squareItem of this.state.board){
      if (squareItem === this.state.squareEnum.EMPTY){
        return false;
      }
    }
    return true;
  }

  nextMove() {
    this.togglePlayer();
  }

  isTriplet() {
    let tempBoard = this.tempBoard(this.state.board);
    return (this.isHorizontalTriplet(tempBoard) || this.isVerticalTriplet(tempBoard) || this.isDiagonalTriplet(tempBoard));
  }

  isHorizontalTriplet(tempBoard) {
    for (const colArray of tempBoard) {
      if (this.isEqual(colArray[0], colArray[1], colArray[2])) {
        return true;
      }
    }
    return false;
  }

  isVerticalTriplet(tempBoard) {
    let rowIndex = 0;
    for (let colIndex = 0; colIndex < tempBoard[rowIndex].length; colIndex++) {
      if (this.isEqual(tempBoard[0][colIndex], tempBoard[1][colIndex], tempBoard[2][colIndex])) {
        return true;
      }
    }
    return false;
  }

  isDiagonalTriplet(tempBoard) {
    return (this.isLeftDiagonalTriplet(tempBoard) || this.isRightDiagonalTriplet(tempBoard));
  }

  isLeftDiagonalTriplet(tempBoard) {
    return this.isEqual(tempBoard[0][0], tempBoard[1][1], tempBoard[2][2]);
  }

  isRightDiagonalTriplet(tempBoard) {
    return this.isEqual(tempBoard[0][2], tempBoard[1][1], tempBoard[2][0]);
  }

  isEqual(squareItem1, squareItem2, squareItem3) {
    return (squareItem1!=='' && squareItem1 === squareItem2 && squareItem2 === squareItem3);
  }

  tempBoard(board) {
    return ([board.slice(0,3), board.slice(3,6), board.slice(6,9)]);
  }

  togglePlayer() {
    let updatedCurrentPlayer = this.state.currentPlayer === this.state.squareEnum.xPlayer ? this.state.squareEnum.oPlayer : this.state.squareEnum.xPlayer;
    this.setState({
      currentPlayer : updatedCurrentPlayer
    }) 
    this.setGameStatus(false, this.getStatusMessage('turn', updatedCurrentPlayer));
  }

  setGameStatus(isGameOver, gameStatusMessage) {
    this.setState({
      isGameOver : isGameOver,
      gameStatusMessage : gameStatusMessage
    })
  }

  getStatusMessage(status, player) {
    const {turn, won} = this.statusMessages;
    switch(player.concat(status)) {
      case 'Xturn': return turn.X;
      case 'Oturn': return turn.O;
      case 'Xwon': return won.X;
      case 'Owon': return won.O;
      default: return this.state.gameStatusMessage;
    }
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