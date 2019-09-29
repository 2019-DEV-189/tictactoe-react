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
      expect(currentPlayer).toEqual(squareEnum.xPlayer);
      expect(gameStatusMessage).toEqual(boardInstance.XPLAYER_TURN);

      expect(currentPlayer).not.toEqual(squareEnum.oPlayer);
      expect(gameStatusMessage).not.toEqual(boardInstance.OPLAYER_TURN);
   });

   it('should be X that updates the board first', function() {
      boardInstance.updateBoard(0);
      expect(board[squareIndex]).toEqual(squareEnum.xPlayer);
      expect(board[squareIndex]).not.toEqual(squareEnum.oPlayer);
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
      expect(boardInstance.state.currentPlayer).toBe(squareEnum.xPlayer);
      expect(boardInstance.state.isGameOver).toBeFalsy();
      expect(boardInstance.state.gameStatusMessage).toBe(boardInstance.getStatusMessage('turn', squareEnum.xPlayer));
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
      expect(boardInstance.state.currentPlayer).toBe(squareEnum.oPlayer);
      expect(boardInstance.state.isGameOver).toBeFalsy();
      expect(boardInstance.state.gameStatusMessage).toBe(boardInstance.getStatusMessage('turn', squareEnum.oPlayer));
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