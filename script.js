const ticTacToe = (function(){
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

        return {assignMark, getBoard, checkWinningPattern, resetBoard};
    })();

    function createPlayer(name, mark){
        let score = 0

        const getName = () => name;
        const setName = (newName) => {name = newName};
        const addPoint = () => {score++};

        const getScore = () => score;
        const toggleMark = () => {
            if(mark === 'x'){
                mark = 'o';
            } else if (mark === 'o'){
                mark = 'x';
            }
        };
        const getMark = () => mark;

        return {getName, setName, toggleMark, getMark, addPoint, getScore};
    }

    const playerA = createPlayer("A", "x");
    const playerB = createPlayer("B", "o");

    function toggleMark(){
        playerA.toggleMark();
        playerB.toggleMark();
    }

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
                console.log(`Player ${player.getName()} wins`)
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

    const getGameBoard = gameBoard.getBoard;

    const firstPlayerName = playerA.getName;
    const setFirstPlayerName = playerA.setName;
    const firstPlayerScore = playerA.getScore;
    const firstPlayerMark = playerA.getMark;

    const secondPlayerName = playerB.getName;
    const setSecondPlayerName = playerB.setName;
    const secondPlayerScore = playerB.getScore;
    const secondPlayerMark = playerB.getMark;

    return{
        play: playRound.applyMark,
        newRound: playRound.newRound,
        toggleMark: toggleMark,
        getBoard: () => gameBoard.getBoard().map(row => row.map(slot => slot.mark)),

        getPlayerAName: playerA.getName,
        setPlayerAName: playerA.setName,
        getPlayerAScore: playerA.getScore,
        getPlayerAMark: playerA.getMark,

        getPlayerBName: playerA.getName,
        setPlayerBName: playerA.setName,
        getPlayerBScore: playerA.getScore,
        getPlayerBMark: playerA.getMark,
    }
})()