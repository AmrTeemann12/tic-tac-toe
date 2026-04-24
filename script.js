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
        ];

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
            /* 
            compare the trackers array containing each mark position on the board with the winning patterns.
            whereas if any tracker array contains any complete winning pattern's positions. then, the mark's player wins.
            */
            return winningPatterns.some(pattern => {
                return pattern.every(value => tracker[mark].includes(value));
            });
        }

        function findWinningPattern (winnerMark){
            const winningPattern = winningPatterns.find(pattern => {
                return pattern.every(value => tracker[winnerMark].includes(value));
            })
            return winningPattern;
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

        return {assignMark, getBoard, checkWinningPattern, findWinningPattern, resetBoard};
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

    const playRound = (function(playerA, playerB, board){
        const xPlayer = () => playerA.getMark() === 'x'? playerA : playerB; 
        const oPlayer = () => playerA.getMark() === 'o'? playerA : playerB;
        // xPlayer and oPlayer to support mark toggling
        let roundCount = 0;
        let playerWin = false;
        let winner = {getName: () => null};

        function applyMark (row, col){
            if (checkRoundEnd()) newRound();
            let currentPlayer = roundCount % 2 === 0? xPlayer() : oPlayer();
            const assigned = board.assignMark(currentPlayer.getMark(), row, col)
                
            if(assigned){
                roundCount++;
                checkRoundResult(currentPlayer);
                return currentPlayer.getMark();
            }
        }

        function checkRoundResult (player){
            if(board.checkWinningPattern(player.getMark())){
                player.addPoint();
                winner = player;
                playerWin = true;
            } else if(roundCount === 9){
                console.log('Tie');
            }
        }

        function winningPattern(){
            if(!playerWin) return false;
            if(roundCount % 2 === 1){
                return gameBoard.findWinningPattern('x');
            } else {
                return gameBoard.findWinningPattern('o');
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
            winner = {getName: () => null};
        }

        const getWinnerName = () => winner.getName();

        return {applyMark, newRound, checkRoundEnd, winningPattern, getWinnerName};
    })(playerA, playerB, gameBoard);

    function toggleMark(){
        // to toggle both players' mark simultaneously
        const freshStart = gameBoard.getBoard().every(row => {
            return row.every(slot => slot.mark === null)
        });

        if(freshStart || playRound.checkRoundEnd()){
            playerA.toggleMark();
            playerB.toggleMark();
        }
    }

    return{
        play: playRound.applyMark,
        checkRoundEnd: playRound.checkRoundEnd,
        winningPattern: playRound.winningPattern,
        winnerName: playRound.getWinnerName,
        newRound: playRound.newRound,
        toggleMark: toggleMark,
        getBoard: () => gameBoard.getBoard().map(row => row.map(slot => slot.mark)),

        getPlayerAName: playerA.getName,
        setPlayerAName: playerA.setName,
        getPlayerAScore: playerA.getScore,
        getPlayerAMark: playerA.getMark,

        getPlayerBName: playerB.getName,
        setPlayerBName: playerB.setName,
        getPlayerBScore: playerB.getScore,
        getPlayerBMark: playerB.getMark,
    }
})();

(function(){
    const gameSlots = document.querySelectorAll('.slot');
    const matchLine = document.querySelector('.line-container');
    const errorText = document.querySelector('.error-text');
    const resultText = document.querySelector('.result-text');

    const xMark = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <style>
        .line {
        stroke: #333;
        stroke-width: 8;
        stroke-linecap: round;
        fill: none;
        stroke-dasharray: 150;
        stroke-dashoffset: 150;
        animation: drawLine 0.5s ease-in-out forwards;
        }
        .line-2 {
        animation-delay: 0.4s;
        }
        @keyframes drawLine {
        to { stroke-dashoffset: 0; }
        }
    </style>
    
    <!-- First Stroke -->
    <path class="line" d="M25,25 Q45,55 75,75" />
    
    <!-- Second Stroke -->
    <path class="line line-2" d="M75,25 Q55,45 25,75" />
    </svg>`;
    const oMark = `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <style>
        .draw-o {
        stroke: #333;
        stroke-width: 8;
        stroke-linecap: round;
        fill: none;
        /* The path length is roughly 250 units */
        stroke-dasharray: 250;
        stroke-dashoffset: 250;
        animation: drawCircle 0.8s ease-in-out forwards;
        }
        @keyframes drawCircle {
        to { stroke-dashoffset: 0; }
        }
    </style>
    <!-- Hand-drawn "O" path with a slight overlap at the top -->
    <path class="draw-o" d="M50,22 C30,22 18,40 18,55 C18,70 30,85 50,85 C70,85 82,70 82,50 C82,30 65,18 48,22" />
    </svg>`;

    function drawMark(place, row, col){
        const mark = ticTacToe.play(row, col);
        if(mark === 'x'){
            place.innerHTML = xMark;
        } else if(mark === 'o'){
            place.innerHTML = oMark;
        } else {
            errorText.textContent = "Can't play there!";
        }
    }

    function drawWinningLine(pattern){
        let startX;
        let startY;
        let endX;
        let endY;
                    
        //detect the path's start & end points for each pattern of the eight winning patterns
        switch(pattern[0]){
            case '0-0':
                switch(pattern[2]){
                    case '0-2':
                        startX = 10;
                        startY = 17;
                        endX = 90;
                        endY = 17;
                    break;
                    case '2-0':
                        startX = 17;
                        startY = 10;
                        endX = 17;
                        endY = 90;
                    break;
                    case '2-2':
                        startX = 10;
                        startY = 10;
                        endX = 90;
                        endY = 90;
                    break;
                }
            break;
            case '0-1':
                startX = 50;
                startY = 10;
                endX = 50;
                endY = 90;
            break;
            case '0-2':
                switch(pattern[2]){
                    case '2-2':
                        startX = 83;
                        startY = 10;
                        endX = 83;
                        endY = 90;
                    break;
                    case '2-0':
                        startX = 90;
                        startY = 10;
                        endX = 10;
                        endY = 90
                    break;
                }
            break;
            case '1-0':
                startX = 10;
                startY = 50;
                endX = 90;
                endY = 50;
            break;
            case '2-0':
                startX = 10;
                startY = 83;
                endX = 90;
                endY = 83;
            break;
        }

        const winningLine = `<svg class="match-line" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <style>
                .animated-line {
                    stroke-width: 3;
                    stroke: #d03e2f;
                    fill: none;
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: drawLine 0.7s ease-in-out forwards;
                }
            
                @keyframes drawLine {
                    to { stroke-dashoffset: 0; }
            }
            </style>
            <path d="M ${startX} ${startY} L ${endX} ${endY}" class="animated-line" pathLength="100"/>
            </svg>`;
        
        matchLine.innerHTML = winningLine;
    }

    function clearBoardDisplay(){
        gameSlots.forEach(slot => {
            slot.innerHTML = '';
        })
        matchLine.innerHTML = '';
        errorText.textContent = '';
        resultText.textContent = '';
    }

    //attach event listeners
    gameSlots.forEach(slot => {
        slot.addEventListener('click', (e) => {
            if(ticTacToe.checkRoundEnd()){
                clearBoardDisplay()
            }
            const row = slot.dataset.row;
            const col = slot.dataset.col;
            drawMark(slot, row, col)

            if(ticTacToe.checkRoundEnd()){
                const winningPattern = ticTacToe.winningPattern();
                if(!winningPattern){
                    resultText.textContent = "No Winner";
                } else {
                    drawWinningLine(winningPattern)
                    resultText.textContent = `Player ${ticTacToe.winnerName()} wins`
                }
            }
        })
    })
})();
