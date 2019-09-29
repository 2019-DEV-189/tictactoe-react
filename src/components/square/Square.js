import React, {Component} from 'react';
import classNames from 'classnames';
import './Square.css';

class Square extends Component {

  invokeBoard(props) {
    props.updateSquare(props.squareIndex);
  }

  render() {
    return (
    <div className = {classNames ("square " + this.props.squareIndex, 
                        { colWall: (this.props.squareIndex !==2 && this.props.squareIndex !==5 && this.props.squareIndex !==8), 
                          rowWall: (this.props.squareIndex !==6 && this.props.squareIndex !==7 && this.props.squareIndex !==8)
                        })
                      } onClick={() => this.invokeBoard(this.props)}>
      <p className = {classNames ({ xColor : this.props.squareItem === 'X', oColor : this.props.squareItem === 'O'})}>
        {this.props.squareItem}
      </p>
    </div>
    );
  }
}
export default Square;