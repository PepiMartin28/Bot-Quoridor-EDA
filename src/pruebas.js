var datos = {
    "event": "your_turn",
    "data": {
        "player_2": "uno",
        "player_1": "dos",
        "score_2": 0.0,
        "walls": 10.0,
        "score_1": 0.0,
        "side": "S",
        "remaining_moves": 50.0,
        "board": "  N     N     N  -*-     -*-     -*-            S                                                                                                                                                                                                                                 S     S        ",
        "turn_token": "087920d0-0e6b-4716-9e77-add550a006aa",
        "game_id": "ab16e71c-caeb-11eb-975e-0242c0a80004"
    }
}
// var message_env = proccessMessage(datos);
// sendMessage(message_env);

let game_board = []
generateBoard(datos.data.board, game_board)
console.log(game_board)
async function sendMessage(message){
    try{
        console.log(message)
        /* await socket.send(JSON.stringify(message)); */
    }catch(error){
        console.log(error.message);
    }
}

 function proccessMessage(message){
    try{
        if(datos.event == "challenge"){
            message = {
                "action": "accept_challenge",
                "data":{
                    "opponent": message.data.opponent,
                    "challenge_id": message.data.challenge_id
                }
            }    
            return message;
        }
        if(datos.event == "your_turn"){
            message = realizarTurno(datos);
            return message; 
        }
    }catch(error){
        console.log(error.message);
    }
}

function realizarTurno(message_rec){
    try{
        let game_board = [];
        game_board = generateBoard(message_rec.data.board, game_board);
        console.log(game_board)
        if(Math.random() >= 0.20){
            message = verticalMove(message_rec, game_board);
            return message;
        }else{
            message = putWall(message_rec, game_board);
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
        return message = {
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
    }catch(error){
        console.log(error.message);
    }
}

function putWall(message_rec, game_board){
    try{
        if(message_rec.data.walls == 0){
            message = verticalMove(message_rec, game_board);
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
        return message = {"action": "wall",
            "data": {
                "game_id": message_rec.data.game_id,
                "turn_token": message_rec.data.turn_token,
                "row": row,
                "col": col,
                "orientation": "h"
            }
        } 
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
        return message = {"action": "move",
            "data":{
                "game_id": message_rec.data.game_id,
                "turn_token": message_rec.data.turn_token,
                "from_row": origin_row,
                "from_col": origin_col,
                "to_row": destiny_row,
                "to_col": destiny_col,
            }
        }      
    }catch(error){
        console.log(error.message);
    }
}