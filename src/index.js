import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>   
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {[...Array(3)].map((x, i) =>
          <div className="board-row">
            {[...Array(3)].map((x, j) =>
              this.renderSquare(i*3+j)
            )}
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      movesAscending: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleBoardClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]) return;

    const currentPlayer = this.state.xIsNext ? 'X' : 'O';
    squares[i] = currentPlayer;
    this.setState({
      history: history.concat([{
        squares,
        move: currentPlayer + ' to ' + getColRow(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleSortClick() {
    this.setState({
      movesAscending: !this.state.movesAscending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const unalteredMoves = history.map((step, move) => {
      const desc = step.move ?
        'Go to move #' + move + ': ' +  step.move:
        'Go to game start';
        return (
          <li key={move}>
            <button className={move === this.state.stepNumber ? 'button-selected' : 'button'} onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
    });

    const moves = this.state.movesAscending ? unalteredMoves: unalteredMoves.reverse();

    let status;
    if(winner){
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleBoardClick(i)}
          /> 
        </div>
        <div className="game-info">
          <div><button onClick={() => this.handleSortClick()}>{this.state.movesAscending ? '↓' : '↑'}</button> | {status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function getColRow(i) {
  const colRowMap = {
    0: '(0,0)',
    1: '(1,0)',
    2: '(2,0)',
    3: '(0,1)',
    4: '(1,1)',
    5: '(2,1)',
    6: '(0,2)',
    7: '(1,2)',
    8: '(2,2)',
  };

  return colRowMap[i];
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

