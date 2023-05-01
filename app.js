// CONST VARIABLES:
const setBtn = document.getElementById('submit-btn');
const checkBtn = document.getElementById ('check-btn');
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
// INPUT TO ARRAY - FUNCTION:
checkBtn.addEventListener('click',() =>{
    checkBtn.classList.add('running');
    let boardArr = new Array(9);
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
    if(resultRow || resultCol || resultBox){
        resultInfo.classList.toggle("invalid");
        resultInfo.textContent="INVALID INPUT";
    }else{
        resultInfo.classList.toggle("valid");
        resultInfo.textContent="VALID INPUT";
    }
    checkBtn.classList.add('completed');
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