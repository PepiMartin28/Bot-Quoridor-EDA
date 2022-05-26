function proccessMessage(message_rec){
    try{
        if(message_rec.event == "challenge"){
            let message = {
                "action": "accept_challenge",
                "data":{
                    "opponent": message_rec.data.opponent,
                    "challenge_id": message_rec.data.challenge_id
                }
            }    
            return message;
        }
        if(message_rec.event == "your_turn"){
            let message = proccessTurn(message_rec);
            return message; 
        }
    }catch(error){
        console.log(error.message);
    }
}

function proccessTurn(message_rec){
    try{
        let game_board = [];
        game_board = generateBoard(message_rec.data.board, game_board);
        if(Math.random() >= 0.20){
            let message = verticalMove(message_rec, game_board);
            return message;
        }else{
            let message = putWall(message_rec, game_board);
            return message;
        } 
    }catch(error){
        console.log(error.message);
    }
} 

function generateBoard(server_board, game_board){
    for (let i=0; i<17; i++){
        game_board[i] = [];
        for(let j=0; j<17; j++){
            game_board[i][j] = '';
        }
    }
    for(var i=0; i<17; i++ ){
        let string_fill = server_board.substring(i*17,(17*i)+17);
        for(var j=0; j<17; j++){
            game_board[i][j]= string_fill.substring(j,(j+1));
        }
    }
    return game_board;
}

function verticalMove(message_rec, game_board){
    try{
        const side = message_rec.data.side;
        let counter = 0;
        let row_sum = 0;
        if(side == 'N'){
            row_sum = 1
        }else{
            row_sum = -1
        }
        for(let i=0; i<9; i++){
            for(let j=0; j<9; j++){
                if(game_board[i*2][j*2] == side){
                    var origin_row = i;
                    var origin_col = j;
                    var destiny_col = j;
                    if(game_board[(i*2)+row_sum][j*2] == ' '){
                        break;
                    }else{
                        counter ++;
                    }
                }
                if(counter == 3){
                    let message = horizontalMove(message_rec, game_board);
                    return message;
                } 
            }
        }
        let destiny_row = 0;
        if(game_board[(origin_row+row_sum)*2][destiny_col*2] == ' '){
            destiny_row = origin_row + row_sum;
        }else{
            destiny_row = origin_row + row_sum*2;
        }
        let message = {
            "action" :"move", 
            "data": {
                "game_id": message_rec.data.game_id,
                "turn_token": message_rec.data.turn_token,
                "from_row": origin_row,
                "from_col": origin_col,
                "to_row": destiny_row,
                "to_col": destiny_col,
            }
        }
        return message;     
    }catch(error){
        console.log(error.message);
    }
}

function horizontalMove(message_rec, game_board){
    try{
        const side = message_rec.data.side;
        for(var i=0; i<9; i++){
            for(var j=0; j<9; j++){
                if(game_board[i*2][j*2] == side){
                    var origin_row = i;
                    var destiny_row = i;
                    var origin_col = j;
                    if(game_board[i*2][(j*2)+1] == ' '){
                        break;
                    }
                }
            }
        }
        let destiny_col = 0;
        if(game_board[destiny_row*2][(origin_col+1)*2] == ' '){
            destiny_col = origin_col + 1;
        }else{
            destiny_col = origin_col + 2;
        }
        let message = {"action": "move",
            "data":{
                "game_id": message_rec.data.game_id,
                "turn_token": message_rec.data.turn_token,
                "from_row": origin_row,
                "from_col": origin_col,
                "to_row": destiny_row,
                "to_col": destiny_col,
            }
        }
        return message;      
    }catch(error){
        console.log(error.message);
    }
}

function putWall(message_rec, game_board){
    try{
        if(message_rec.data.walls == 0){
            let message = verticalMove(message_rec, game_board);
            return message;
        }
        let enemy;
        if(message_rec.data.side == 'N'){
            enemy = 'S';
        }else{
            enemy = 'N';
        }
        for(let i=0; i<9; i++){
            for(let j=0; j<9; j++){
                if(game_board[i*2][j*2] == enemy){
                    var row = i;
                    var col = j;
                    break;
                }
            }
        }
        if(enemy == 'S'){
            row = row - 1;
        }
        let message = {"action": "wall",
            "data": {
                "game_id": message_rec.data.game_id,
                "turn_token": message_rec.data.turn_token,
                "row": row,
                "col": col,
                "orientation": "h"
            }
        }
        return message; 
    }catch(error){
        console.log(error.message);
    }
}

module.exports.proccessMessage = proccessMessage
module.exports.generateBoard = generateBoard
module.exports.horizontalMove = horizontalMove
module.exports.verticalMove = verticalMove
module.exports.putWall = putWall
