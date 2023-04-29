const setBtn = document.getElementById('submit-btn');
const sizeInput = document.getElementById('size--input');
const board = document.getElementById('gameboard');
setBtn.addEventListener('click',()=>{
    generateBoard(sizeInput.value);
});
// 3 9 27
function generateBoard(e){
    let boardSize = Math.pow(3,e);
    console.log(boardSize);
    for(let i=0; i<boardSize; i++){
        for(let j=0; j<boardSize; j++){
            
        }
        board.appendChild();
    }
}