import React from 'react';
import { shallow } from 'enzyme';
import Board from './Board';

describe('Board Component', () => {
   it('renders without crashing', () => {
      shallow(<Board />);
    });
});