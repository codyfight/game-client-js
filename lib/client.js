/**
 * TODO: implement a sophisticated algorithm to perform your codyfighter movement to the position x, y
 *
 * The game goal is to gather more points than the opponent. Points can be earned by
 *  - going thru exit (game.map.exits)
 *  - collaborating with (another robot || special agent) and caging the Pig (game.map.special_agents)
 *
 * All your available movements: game.robots.bearer.possible_moves
 */

const GAME_API_URL = 'https://game.codyfight.com';

const GAME_STATUS_INITIALIZING = 0;
const GAME_STATUS_PLAYING = 1;
const GAME_STATUS_ENDED = 2;

async function play(CKey, mode, opponentName = null) {

    // initialize a new game
    let game = await init(CKey, mode, opponentName);

    // match an opponent
    while (game.state.status === GAME_STATUS_INITIALIZING) {
        game = await check(CKey);
    }

    // play the game
    while (game.state.status === GAME_STATUS_PLAYING) {
        try {
            if (game.robots.bearer.is_action_required) {
                let randomMove = Math.floor(Math.random() * game.robots.bearer.possible_moves.length);

                let x = game.robots.bearer.possible_moves[randomMove].x;
                let y = game.robots.bearer.possible_moves[randomMove].y;

                game = await move(CKey, x, y);
            } else {
                game = await check(CKey);
            }
        } catch (error) {
            console.warn('Failed to perform a move, checking the game state...', error);
            game = await check(CKey);
        }
    }

    if (game.state.status === GAME_STATUS_ENDED) {
        console.log('Game Over!', game.verdict);
    }
}

async function init(CKey, mode, opponent) {
    return await request('POST', {'ckey': CKey, 'mode': mode, 'opponent': opponent});
}

async function move(CKey, x, y) {
    return await request('PUT', {'ckey': CKey, 'x': x, 'y': y});
}

async function check(CKey) {
    return await request('GET', {'ckey': CKey});
}

async function request(type, params) {
    return await $.ajax({type: type, data: params, url: GAME_API_URL});
}
