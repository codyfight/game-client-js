const GAME_API_URL = 'https://game.codyfight.com';

let game = null; // game-state object received from game.codyfight.com

$(document).ready(async function () {

    // check if game initialized
    let play = new URLSearchParams(location.search).get('play');
    if (!play) return;

    // init params
    let apiKey = new URLSearchParams(location.search).get('api-key');
    let gameMode = new URLSearchParams(location.search).get('game-mode');
    let opponentName = new URLSearchParams(location.search).get('opponent-name');

    // clear state
    let needClear = new URLSearchParams(location.search).get('clear');
    if (needClear) {
        await clear(apiKey);
    }

    // initialize new game
    await init(apiKey, gameMode, opponentName);

    // display game-widget
    $('#game-widget').src = 'https://codyfight.com/spectate-robot/' + game['state']['robots']['bearer'];

    // wait for an opponent
    while (game['state']['status'] === 0) {
        await check(apiKey);
    }

    // play the game
    while (game['state']['status'] === 1) {
        try {
            if (game['state']['action_required']) {

                // TODO: implement sophisticated move choice: x, y coordinates from possible moves
                let randomIndex = Math.floor(Math.random() * game['map']['possible_moves'].length);

                let x = game['map']['possible_moves'][randomIndex]['x'];
                let y = game['map']['possible_moves'][randomIndex]['y'];

                await move(apiKey, x, y);
            } else {
                await check(apiKey);
            }
        } catch (e) {
            console.log('Error while trying to perform move, checking game state...', e.responseText);
            await check(apiKey);
        }
    }

    if (game['state']['status'] === 2) {
        alert('Game Over! Winner: ' + game['stats']['winner'] + ' | ' + game['stats']['win_condition']);
    }
});

function setGameState(data) {
    game = data;
}

async function init(apiKey, mode, opponent) {
    await request('POST', {
        'api_key': apiKey,
        'mode': mode,
        'opponent': opponent,
    });
}

async function move(apiKey, x, y) {
    await request('PUT', {
        'api_key': apiKey,
        'x': x,
        'y': y,
    });
}

async function check(apiKey) {
    await request('GET', {
        'api_key': apiKey,
    });
}

/** @deprecated */
async function clear(apiKey) {
    await request('DELETE', {
        'api_key': apiKey,
    });
}


async function request(type, params) {
    await $.ajax({
        type: type,
        url: GAME_API_URL,
        data: params,

        success: function (data) {
            setGameState(data)
        }
    });
}
