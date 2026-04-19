const gameBoard = (function (){
    const board = [
        [
         {mark: null},
         {mark: null},
         {mark: null}
        ],
        [
         {mark: null},
         {mark: null},
         {mark: null}
        ],
        [
         {mark: null},
         {mark: null},
         {mark: null}
        ]
    ];

    const tracker = {
        x: [],
        o: []
    };

    const winningPatterns = [
        ['0-0', '0-1', '0-2'],
        ['0-0', '1-0', '2-0'],
        ['0-0', '1-1', '2-2'],
        ['0-1', '1-1', '2-1'],
        ['0-2', '1-2', '2-2'],
        ['0-2', '1-1', '2-0'],
        ['1-0', '1-1', '1-2'],
        ['2-0', '2-1', '2-2']
    ]

    function assignMark (mark, row, col){
        const slot = board[row][col];
        if(slot.mark !==null){
            console.warn('the slot is already marked');
            return false;
        }
        slot.mark = mark;
        
        tracker[mark].push(`${row}-${col}`)
        return true;
    }

    function checkWinningPattern (mark){
        return winningPatterns.some(pattern => {
            return pattern.every(value => tracker[mark].includes(value));
        });
    }

    function resetBoard(){
        board.forEach(row => {
            row.forEach(slot => {
                slot.mark = null;
            })
        })
        tracker.x.length = 0;
        tracker.o.length = 0;
    }

    const getBoard = () => board;
    const getTracker = () => tracker;

    return {assignMark, getBoard, getTracker, checkWinningPattern, resetBoard};
})();

function createPlayer(name, mark, score){
    const addPoint = () => {
        score++
    }

    const getScore = () => score;
    const toggleMark = () => {
        if(mark === 'x'){
            mark = 'o';
        } else if (mark === 'o'){
            mark = 'x';
        }
    };
    const getMark = () => mark;

    return {name, toggleMark, getMark, addPoint, getScore};
}

const playerA = createPlayer("A", "x", 0);
const playerB = createPlayer("B", "o", 0);

const playRound = (function(playerA, playerB, board){
    const xPlayer = () => playerA.getMark() === 'x'? playerA : playerB; 
    const oPlayer = () => playerA.getMark() === 'o'? playerA : playerB;
    let roundCount = 0;
    let playerWin = false;

    function applyMark (row, col){
        if (checkRoundEnd()) newRound();
        let currentPlayer = roundCount % 2 === 0? xPlayer() : oPlayer();
        const assigned = board.assignMark(currentPlayer.getMark(), row, col)
            
        if(assigned){
            roundCount++;
            checkRoundResult(currentPlayer);
        }
    }

    function checkRoundResult (player){
        if(board.checkWinningPattern(player.getMark())){
            player.addPoint();
            console.log(`Player ${player.name} wins`)
            playerWin = true;
        } else if(roundCount === 9){
            console.log('Tie');
        }
    }

    function checkRoundEnd(){
        if(playerWin) return true;
        if(roundCount === 9) return true;
    }

    function newRound (){
        board.resetBoard();
        roundCount = 0;
        playerWin = false;
    }

    return {applyMark, newRound};

})(playerA, playerB, gameBoard);