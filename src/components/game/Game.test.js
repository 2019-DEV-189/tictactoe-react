import React from 'react';
import { shallow } from 'enzyme';
import Game from './Game';

describe('Game Component', () => {
   it('renders without crashing', () => {
      shallow(<Game />);
    });
});