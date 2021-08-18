const GAME_API_URL = 'https://game.codyfight.com';

async function init(CKey, mode, opponent) {
    return await request('POST', {'ckey': CKey, 'mode': mode, 'opponent': opponent});
}

async function move(CKey, x, y) {
    return await request('PUT', {'ckey': CKey, 'x': x, 'y': y});
}

async function check(CKey) {
    return await request('GET', {'ckey': CKey});
}

async function request(method, params) {
    let requestInitializer = {
        method: method,
        headers: {'Content-Type': 'application/json'},
    };

    if (!(method === 'GET' || method === 'HEAD')) {
        requestInitializer.body = JSON.stringify(params);
    }

    let response = await fetch(GAME_API_URL + '?ckey=' + params.ckey, requestInitializer);
    if (!response.ok) {
        throw await response.json();
    }
    return await response.json();
}
