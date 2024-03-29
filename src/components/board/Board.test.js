import React from 'react';
import { shallow } from 'enzyme';
import Board from './Board';

const boardWrapper = shallow(<Board />);
const boardInstance = boardWrapper.instance();

// State Variables
let gameStatusMessage = boardWrapper.state('gameStatusMessage');
let squareEnum = boardWrapper.state('squareEnum');
let currentPlayer = boardWrapper.state('currentPlayer');
let board = boardWrapper.state('board');
let squareIndex = boardWrapper.state('squareIndex');

describe('Board Component', () => {
   it('renders without crashing', () => {
      shallow(<Board />);
    });
});

describe('X always goes first', function() {
   squareIndex = 0;

   it('should have X player as a current player when a new game begins', () => {
      expect(currentPlayer).toEqual('X');
      expect(gameStatusMessage).toEqual('Player X\'s Turn!');

      expect(currentPlayer).not.toEqual('O');
      expect(gameStatusMessage).not.toEqual('Player O\'s Turn!');
   });

   it('should be X that updates the board first', function() {
      boardInstance.updateBoard(0);
      expect(board[squareIndex]).toEqual('X');
      expect(board[squareIndex]).not.toEqual('O');
    });
});

describe('Players cannot play on a played position', function() {
   squareIndex = 0;
   board =  [
      squareEnum.xPlayer, squareEnum.EMPTY, squareEnum.EMPTY,
      squareEnum.EMPTY, squareEnum.EMPTY, squareEnum.EMPTY,
      squareEnum.EMPTY, squareEnum.EMPTY, squareEnum.EMPTY
   ];
   boardInstance.updateBoard(squareIndex);

   it('should not let player to update the board on a played position', function() {
     expect(boardInstance.isMoveAllowed()).toBeFalsy();
   });
});

describe('Players alternate placing X’s and O’s on the board until a game is over(win or draw)', function(){
   const togglePlayerSpy = jest.spyOn(boardInstance, 'togglePlayer');
   let tempBoard = [];

   it('should toggle Players on every next move', function() {
      boardInstance.nextMove();
      expect(togglePlayerSpy).toHaveBeenCalled();
   });

   it('should allow Player `X` to play next if Player `O` played last', function() {
      squareIndex = 2;
      boardInstance.state.currentPlayer = squareEnum.oPlayer;

      boardInstance.state.board =  [
            squareEnum.xPlayer, squareEnum.EMPTY, squareEnum.EMPTY,
            squareEnum.EMPTY, squareEnum.EMPTY, squareEnum.EMPTY,
            squareEnum.EMPTY, squareEnum.EMPTY, squareEnum.EMPTY
      ];

      boardInstance.updateBoard(squareIndex);
      expect(togglePlayerSpy).toHaveBeenCalled();
      expect(boardInstance.state.currentPlayer).toBe('X');
      expect(boardInstance.state.isGameOver).toBeFalsy();
      expect(boardInstance.state.gameStatusMessage).toBe('Player X\'s Turn!');
      });

   it('should allow Player `O` to play next if Player `X` played last', function() {
      squareIndex = 3;
      boardInstance.state.currentPlayer = squareEnum.xPlayer;
 
      boardInstance.state.board =  [
          squareEnum.xPlayer, squareEnum.EMPTY, squareEnum.oPlayer,
          squareEnum.EMPTY, squareEnum.EMPTY, squareEnum.EMPTY,
          squareEnum.EMPTY, squareEnum.EMPTY, squareEnum.EMPTY
      ];
 
      boardInstance.updateBoard(squareIndex);
      expect(togglePlayerSpy).toHaveBeenCalled();
      expect(boardInstance.state.currentPlayer).toBe('O');
      expect(boardInstance.state.isGameOver).toBeFalsy();
      expect(boardInstance.state.gameStatusMessage).toBe('Player O\'s Turn!');
    });

   it('should continue game if no player has three in a row horizontally', function() {
      squareIndex = 8;
      boardInstance.state.currentPlayer = squareEnum.oPlayer;
      boardInstance.state.board =  [
         squareEnum.xPlayer, squareEnum.EMPTY, squareEnum.xPlayer,
         squareEnum.oPlayer, squareEnum.oPlayer, squareEnum.EMPTY,
         squareEnum.EMPTY, squareEnum.EMPTY, squareEnum.EMPTY
      ];
      tempBoard = boardInstance.tempBoard(boardInstance.state.board);

      boardInstance.updateBoard(squareIndex);
      expect(boardInstance.isHorizontalTriplet(tempBoard)).toBeFalsy();
      expect(boardInstance.state.isGameOver).toBeFalsy();
   });

   it('should continue game if no player has three in a row vertically', function() {
      squareIndex = 7;
      boardInstance.state.currentPlayer = squareEnum.oPlayer;
      boardInstance.state.board =  [
         squareEnum.xPlayer, squareEnum.EMPTY, squareEnum.xPlayer,
         squareEnum.oPlayer, squareEnum.oPlayer, squareEnum.EMPTY,
         squareEnum.EMPTY, squareEnum.EMPTY, squareEnum.xPlayer
        ];
      tempBoard = boardInstance.tempBoard(boardInstance.state.board);
  
      boardInstance.updateBoard(squareIndex);
      expect(boardInstance.isVerticalTriplet(tempBoard)).toBeFalsy();
      expect(boardInstance.state.isGameOver).toBeFalsy();
   });

   it('should continue game if no player has three in a row diagonally', function() {
      squareIndex = 6;
      boardInstance.state.currentPlayer = squareEnum.oPlayer;
      boardInstance.state.board =  [
         squareEnum.xPlayer, squareEnum.EMPTY, squareEnum.xPlayer,
         squareEnum.oPlayer, squareEnum.oPlayer, squareEnum.EMPTY,
         squareEnum.EMPTY, squareEnum.oPlayer, squareEnum.xPlayer
        ];
      tempBoard = boardInstance.tempBoard(boardInstance.state.board);

      boardInstance.updateBoard(squareIndex);
      expect(boardInstance.isDiagonalTriplet(tempBoard)).toBeFalsy();
      expect(boardInstance.state.isGameOver).toBeFalsy();
   });

   it('should continue game if all 9 squares are not filled yet', function() {
      squareIndex = 7;
      boardInstance.state.currentPlayer = squareEnum.oPlayer;
      boardInstance.state.board =  [
         squareEnum.xPlayer, squareEnum.EMPTY, squareEnum.xPlayer,
         squareEnum.oPlayer, squareEnum.oPlayer, squareEnum.EMPTY,
         squareEnum.xPlayer, squareEnum.oPlayer, squareEnum.xPlayer
        ];
  
      boardInstance.updateBoard(squareIndex);
      expect(boardInstance.isBoardFull()).toBeFalsy();
      expect(boardInstance.state.isGameOver).toBeFalsy();
   });
});

describe('If a player is able to draw three X’s or three O’s in a row, that player wins.', function(){

   it('should be a win if Player `X` draws three in a row', function() {
      squareIndex = 5;
      boardInstance.state.currentPlayer = squareEnum.xPlayer;
 
      boardInstance.state.board =  [
          squareEnum.xPlayer, squareEnum.EMPTY, squareEnum.xPlayer,
          squareEnum.oPlayer, squareEnum.oPlayer, squareEnum.EMPTY,
          squareEnum.xPlayer, squareEnum.oPlayer, squareEnum.xPlayer
      ];
 
      boardInstance.updateBoard(squareIndex);
      expect(boardInstance.isWon()).toBeTruthy();
      expect(boardInstance.state.isGameOver).toBeTruthy();
      expect(boardInstance.state.gameStatusMessage).toBe('Player X Wins!');
   });

   it('should be a win if Player `O` draws three in a row', function() {
      squareIndex = 1;
      boardInstance.state.currentPlayer = squareEnum.oPlayer;
      boardInstance.state.isGameOver = false;
 
      boardInstance.state.board =  [
          squareEnum.xPlayer, squareEnum.EMPTY, squareEnum.xPlayer,
          squareEnum.oPlayer, squareEnum.oPlayer, squareEnum.EMPTY,
          squareEnum.xPlayer, squareEnum.oPlayer, squareEnum.xPlayer
      ];
      
      boardInstance.updateBoard(squareIndex);
      expect(boardInstance.isWon()).toBeTruthy();
      expect(boardInstance.state.isGameOver).toBeTruthy();
      expect(boardInstance.state.gameStatusMessage).toBe('Player O Wins!');
   });
});

describe('If all nine squares are filled and neither player has three in a row, the game is a draw.', function(){

   it('should be a draw if Player `X` doesn`t have three in a row and board is full', function() {
      squareIndex = 2;
      boardInstance.state.currentPlayer = squareEnum.xPlayer;
      boardInstance.state.isGameOver = false;
 
      boardInstance.state.board =  [
          squareEnum.oPlayer, squareEnum.oPlayer, squareEnum.EMPTY,
          squareEnum.xPlayer, squareEnum.xPlayer, squareEnum.oPlayer,
          squareEnum.oPlayer, squareEnum.xPlayer, squareEnum.xPlayer
      ];
 
      boardInstance.updateBoard(squareIndex);
      expect(boardInstance.isDraw()).toBeTruthy();
      expect(boardInstance.state.isGameOver).toBeTruthy();
      expect(boardInstance.state.gameStatusMessage).toBe('It\'s a Draw!');
   });

   it('should be a draw if Player `O` doesn`t have three in a row and board is full', function() {
      squareIndex = 5;
      boardInstance.state.currentPlayer = squareEnum.oPlayer;
      boardInstance.state.isGameOver = false;
 
      boardInstance.state.board =  [
          squareEnum.oPlayer, squareEnum.oPlayer, squareEnum.xPlayer,
          squareEnum.xPlayer, squareEnum.xPlayer, squareEnum.EMPTY,
          squareEnum.oPlayer, squareEnum.xPlayer, squareEnum.xPlayer
      ];
 
      boardInstance.updateBoard(squareIndex);
      expect(boardInstance.isDraw()).toBeTruthy();
      expect(boardInstance.state.isGameOver).toBeTruthy();
      expect(boardInstance.state.gameStatusMessage).toBe('It\'s a Draw!');
   });
});