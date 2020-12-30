const GAME_API_URL = 'https://game.codyfight.com';

const GAME_STATUS_REGISTERING = 0;
const GAME_STATUS_PLAYING = 1;
const GAME_STATUS_ENDED = 2;

async function play(CKey, mode, opponentName = null) {

    // initialize new game
    let game = await init(CKey, mode, opponentName);

    // match an opponent
    while (game.state.status === GAME_STATUS_REGISTERING) {
        game = await check(CKey);
    }

    // play the game
    while (game.state.status === GAME_STATUS_PLAYING) {
        try {
            if (game.state.is_action_required) {
                /**
                 * TODO: Implement your sophisticated algorithm to perform robot movement.
                 *
                 * You need to wisely chose x, y coordinates for the next robot movement.
                 * The goal is to gather more points than the opponent.
                 * Points can be earned by
                 *  - going thru exit;
                 *  - collaborating with (another robot || special agent) and caging the Pig;
                 *  - unexpected special situations and events might occur, follow Codyfight news to find out more!
                 *
                 * Robot can have these possible move directions {left, right, up, down, stay}
                 * Pick a move from "game.map.possible_moves"
                 *
                 * Currently it is implemented completely random movement.
                 */
                let randomMove = Math.floor(Math.random() * game.map.possible_moves.length);

                let x = game.map.possible_moves[randomMove].x;
                let y = game.map.possible_moves[randomMove].y;

                game = await move(CKey, x, y);
            } else {
                game = await check(CKey);
            }
        } catch (e) {
            console.log('Error while trying to perform move, checking game state...', e.responseText);
            game = await check(CKey);
        }
    }

    if (game.state.status === GAME_STATUS_ENDED) {
        console.log('Game Over!', game.stats.verdict);
    }
}

async function init(CKey, mode, opponent) {
    return await request('POST', {
        'api_key': CKey,
        'mode': mode,
        'opponent': opponent,
    });
}

async function move(CKey, x, y) {
    return await request('PUT', {
        'api_key': CKey,
        'x': x,
        'y': y,
    });
}

async function check(CKey) {
    return await request('GET', {
        'api_key': CKey,
    });
}

async function request(type, params) {
    return await $.ajax({
        type: type,
        data: params,
        url: GAME_API_URL,
        success: function (data) {
            return data;
        }
    });
}
