// CONST VARIABLES:
const setBtn = document.getElementById('submit-btn');
const checkBtn = document.getElementById ('check-btn');
const solveBtn = document.getElementById('solve-btn');
const board = document.getElementById('gameboard');
const resultInfo = document.getElementById('validation-result');
// GENERATE SUDOKU BOARD ON PAGE LOAD
document.onload = generateBoard(2);
// RE-GENERATE BUTTON CLICK EVENT:
setBtn.addEventListener('click',()=>{
    generateBoard(2);
});
// GENERATE BOARD - FUNCTION:
function generateBoard(e){
    board.innerHTML="";
    let boardSize = Math.pow(3,e);
    for(let i=0; i<boardSize; i++){
        for(let j=0; j<9; j++){
            const inputArea = document.createElement('input');
            inputArea.setAttribute('type', 'number');
            inputArea.setAttribute('min', '1');
            inputArea.setAttribute('max', '9');
            inputArea.setAttribute('id', `${i}-${j}`);
            board.appendChild(inputArea);
        }
    }
}
let boardArr = new Array(9);
function fillArray(){
    boardArr = new Array(9);
    for (let i = 0; i < boardArr.length; i++) {
        boardArr[i] = new Array(9);
    }
    // ADD BOARD TO 2D ARRAY:
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            if(document.getElementById(`${i}-${j}`).value != ''){
                boardArr[i][j] = document.getElementById(`${i}-${j}`).value;
            }else{
                boardArr[i][j] = '.';
            }
        }
    }
}
// INPUT TO ARRAY - FUNCTION:
checkBtn.addEventListener('click',() =>{
    checkBtn.classList.add('running');
    fillArray();
    console.log(boardArr);
    // 2D ARRAY VALIDATION - FUNCTION:
    validateSudoku(boardArr);
});

async function validateSudoku(boardArr) {
    // VARIABLES:
    let resultRow = false;
    let resultCol = false;
    let resultBox = false;
    // INFO:
    resultInfo.classList.add("verifying");
    resultInfo.textContent="CHECKING";
    // CHECKING WITH ANIMATION:
    resultRow = await new Promise(resolve => setTimeout(() => {
        resolve(validSudokuRow(boardArr));
    }, 0));
    
    resultCol = await new Promise(resolve => setTimeout(() => {
        resolve(validSudokuCol(boardArr));
    }, 1000));
    
    resultBox = await new Promise(resolve => setTimeout(() => {
        resolve(validSudokuBox(boardArr));
    }, 1000));
    // CONSOLE LOG RESULTS:
    console.log("Result Row: " + resultRow);
    console.log("Result Col: " + resultCol);
    console.log("Result Box: " + resultBox);
    // FINAL RESULT INFO:
    clearChecked();
    resultInfo.classList.remove("verifying");
    checkBtn.classList.add('completed');
    if(resultRow || resultCol || resultBox){
        resultInfo.classList.toggle("invalid");
        resultInfo.textContent="INVALID INPUT";
    }else{
        resultInfo.classList.toggle("valid");
        resultInfo.textContent="VALID INPUT";
    }
}
function clearChecked(){
    const boxelem = document.querySelectorAll('.checking');
    boxelem.forEach(element => {
        element.classList.remove('checking');
    });
}

async function validSudokuRow(board){
    clearChecked();
    let isRepeated = false;
    const rowSet = new Set();
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            document.getElementById(`${i}-${j}`).classList.add('checking');
            const rowNumber = board[i][j];
            if(rowNumber !== '.'){
                if(rowSet.has(rowNumber)) {
                    isRepeated = true;
                    document.getElementById(`${i}-${j}`).classList.add('mistake');
                }
                else{ rowSet.add(rowNumber)}
            }
        }
        rowSet.clear();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("ROW RESULT: "+isRepeated);
    return isRepeated;
}

async function validSudokuCol(board){
    clearChecked();
    let isRepeated = false;
    const rowSet = new Set();
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            document.getElementById(`${j}-${i}`).classList.add('checking');
            const rowNumber = board[j][i];
            if(rowNumber !== '.'){
                if(rowSet.has(rowNumber)) {
                    isRepeated = true;
                    document.getElementById(`${j}-${i}`).classList.add('mistake');
                }
                else{ rowSet.add(rowNumber)}
            }
        }
        rowSet.clear();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("COLL RESULT: "+isRepeated);
    return isRepeated;
}

async function validSudokuBox(board){
    clearChecked();
    let isRepeated = false;
    const rowSet = new Set();
    let str=3;
    let stc=3;
    for(let i=0; i<9; i++){
        for(let j=str-3; j<str; j++){
            for(let k=stc-3;k<stc;k++){
                const rowNumber = board[j][k];
                document.getElementById(`${j}-${k}`).classList.add('checking');
                if(rowNumber !== '.'){
                    if(rowSet.has(rowNumber)) {
                        isRepeated = true;
                        document.getElementById(`${j}-${k}`).classList.add('mistake');
                    }
                    else{ rowSet.add(rowNumber)}
                }
            }
        }
        rowSet.clear();
        if(stc<=9){
            stc+=3;
        }
        if(stc==12){
            stc=3;
            str+=3;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("BOX - RESULT: "+isRepeated);
    return isRepeated;
}

// SOLVE THE BOARD USING API:
solveBtn.addEventListener('click',()=>{
    let boardString="";
    for(let c=0; c<9; c++){
        for (var r = 0; r < 9; r++) {
            if(document.getElementById(`${c}-${r}`).value!=''){
                boardString += document.getElementById(`${c}-${r}`).value;
            }else{
                boardString += '.';
            }
        }
    }
    console.log(boardString);
        const solvedBoardString = solveSudoku(boardString);
        console.log(solvedBoardString);
        i = 0;
        // FILL EMPTY FIELDS:
        for(let c=0; c<9; c++){
            for (var r = 0; r < 9; r++) {
                let solvedChar = solvedBoardString[i];
                document.getElementById(`${c}-${r}`).value=solvedChar;
                i++;
            }
        }
});

function solveSudoku(board) {
    // Convert the board string to a 2D array
    const grid = board.match(/.{1,9}/g).map(row => row.split(''));
  
    // Define a recursive helper function to solve the board
    function solve(row, col) {
      // If we've reached the end of the board, we're done!
      if (row === 9) {
        return true;
      }
  
      // Calculate the next row and column indices
      const nextRow = col === 8 ? row + 1 : row;
      const nextCol = col === 8 ? 0 : col + 1;
  
      // If this cell is already filled, move on to the next one
      if (grid[row][col] !== '.') {
        return solve(nextRow, nextCol);
      }
  
      // Try each number from 1 to 9 in this cell
      for (let num = 1; num <= 9; num++) {
        // Check if this number is valid in this cell
        if (isValid(row, col, num)) {
          // If it's valid, fill in the number and move on to the next cell
          grid[row][col] = num.toString();
          if (solve(nextRow, nextCol)) {
            return true;
          }
          // If we didn't find a solution with this number, backtrack and try the next one
          grid[row][col] = '.';
        }
      }
  
      // If none of the numbers worked, backtrack and try a different number in the previous cell
      return false;
    }
  
    // Define a helper function to check if a number is valid in a given cell
    function isValid(row, col, num) {
      // Check the row
      for (let c = 0; c < 9; c++) {
        if (grid[row][c] === num.toString()) {
          return false;
        }
      }
  
      // Check the column
      for (let r = 0; r < 9; r++) {
        if (grid[r][col] === num.toString()) {
          return false;
        }
      }
  
      // Check the 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if (grid[r][c] === num.toString()) {
            return false;
          }
        }
      }
  
      // If we haven't found any conflicts, this number is valid in this cell
      return true;
    }
  
    // Call the solve helper function to solve the board
    solve(0, 0);
  
    // Convert the solved board back to a string and return it
    return grid.map(row => row.join('')).join('');
  }