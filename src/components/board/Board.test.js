import React from 'react';
import { shallow } from 'enzyme';
import Square from '../square/Square';
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