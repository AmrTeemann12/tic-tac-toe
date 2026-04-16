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
            return;
        }
        board[row][col].mark = mark;
        
        tracker[mark].push(`${row}-${col}`)
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
    }

    const getBoard = () => board;
    const getTracker = () => tracker;

    return {assignMark, getBoard, getTracker, checkWinningPattern, resetBoard};
})()
