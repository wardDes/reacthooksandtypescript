import React, { ReactNode, useState } from 'react'
import ReactDOM from 'react-dom'
import './index.css'


    /**********************************************
        Arrow functions are not hoisted up so the
        calculateWinner function must be declared before it
        is called.
    */

const calculateWinner = (squares: SquareValue[]): SquareValue => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

type SquareValue = 'X' | 'O' | null // how to declare type typescript

interface SquareProps {
    onClick(): void,
    //value: 'X' |'O' | null
    value: SquareValue
}


/* convert function component to ES6 functon component
    adding ': React.FC' indicates React Function Component
    add <> behind the React.FC; this is used to indicate type(s) of props
    use an interface to declare props.
    Here we use the SquareProps interface to declare possible properties.
    for 'value' prop and the 'onClick' prop which is a handler
    that accepts no parameter '() and return nothing 'void'
*/
const Square: React.FC<SquareProps> = (props) => {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  

  interface BoardProps {
    onClick(i : number) : void,
    //squares: ('x' | 'O' | null)[]
    squares: SquareValue[] // how to declare type for arrays
  }

  /*
    Converting the Board component to a ES6 function component
    adding ': React.FC' indicates React Function Component
    add <> behind the React.FC; this is used to indicate type(s) of props
    use an interface to declare props.
    Here we use the BoardProps interface to declare possible properties.
    The onClick props received from the Game component, takes a parameter
    'i' and returns nothing 'void'.
    The 'squares' prop the Board function component receives takes in 
    an array of Square objexts/components. 
    Since we know these values will be either 'X', 'O' or null we can
    declare this set of values as variable SquareValue and use it
    in parental components
    Continue converting the Board class Component to a Functional 
    component by removing the 'render() method. ****Function components do not have a render method****
    ***In functional components, the 'this' word is not used. 
    So all 'this' keywords are removed from the component.****
    ***Typescript only allows functions in functional components to
    presented as constants. The renderSquare method is set to take
    a parameter 'i' which is of type number and returns a Component
    which in Typescript can be represented by the type 'ReactNode'. 
    *** { ReactNode} must be added to imports from 'react'.******

  */
  const Board: React.FC<BoardProps> = props => {
    const renderSquare = (i: number): ReactNode =>{
      return (
        <Square
          value={props.squares[i]}
          onClick={() => props.onClick(i)}
        />
      );
    }

    return (
    <div>
        <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
        </div>
        <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
        </div>
        <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
        </div>
    </div>
    );
    
  }

  /*
    Converting Top Level Component to a Functional Component
    This component does not receive props!!!!
    To handle 'state' in the top level functional component
    we will import 'useState' method from 'react'. 
    
    The props of the class constructor; xlsNext, stepNumber and history
    are for a Typescript React Functional component  declared with 'useState'. 

    The nandleClick function is converted to an ES6 arrow function that 
    takes a parameter 'i' with a type of 'number' and return type of 'void' since
    it return nothing.

    The jumpTo function is also converted to an ES6 arrow funtion that
    takes a 'step' parameter of type number and returns type of 'void' since nothing
    is return.

    All remaining 'this' keywords are removed as they are not allowed in
    Typescript Functional components.

    The 'calculateWinner' function of taken from the bottom of the file
    and placed at the top because Functional Components are not 'hoisted'
    at build time like class components.
  */
  
  const Game: React.FC = () =>{

    // Three lines here are the conversion of constructor of 
    // class component into 'state' that a Typescript React functional
    // component can use using 'useState'.
    const [xIsNext, SetXIsNext] = useState<boolean>(true)
    const [stepNumber, SetStepNumber] = useState<number>(0)
    const [history, SetHistory] = useState<{squares: SquareValue[]}[]>([
        {
          squares: Array(9).fill(null)
        }
      ])

    // constructor(props) {
    //   super(props);
    //   this.state = {
    //     history: [
    //       {
    //         squares: Array(9).fill(null)// declares a 9 element array with each element set to 'null'
    //       }
    //     ],
    //     stepNumber: 0,
    //     xIsNext: true
    //   };
    // }
  
    const handleClick = (i:number): void => {
      const newHistory = history.slice(0, stepNumber + 1);
      const current = newHistory[newHistory.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = xIsNext ? "X" : "O";

    //Here we set state using the seT Functions of the properties
      SetHistory(newHistory.concat([
            {
                squares: squares
            }
      ]))
      SetStepNumber(newHistory.length)
      SetXIsNext(!xIsNext)

    //   this.setState({
    //     history: history.concat([
    //       {
    //         squares: squares
    //       }
    //     ]),
    //     stepNumber: history.length,
    //     xIsNext: !this.state.xIsNext
    //   });

    }
  
    const jumpTo = (step:number): void => {

      SetStepNumber(step)
      SetXIsNext((step % 2) === 0)

    //   this.setState({
    //     stepNumber: step,
    //     xIsNext: (step % 2) === 0
    //   });
    }



  
    //const history = this.state.history;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
    const desc = move ?
        'Go to move #' + move :
        'Go to game start';
    return (
        <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
        </li>
    );
    });

    let status;
    if (winner) {
    status = "Winner: " + winner;
    } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
    <div className="game">
        <div className="game-board">
        <Board
            squares={current.squares}
            onClick={i => handleClick(i)}
        />
        </div>
        <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        </div>
    </div>
    );
    
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  

  