const MODE = 2; // {1 - custom, 2 - random, 3 - arena}
const OPPONENT_NAME = null; // use only when played in custom mode

$(document).ready(function () {
    $('#start-game').on('click', startGame)
});

async function startGame() {
    let CKey = $('#c-key').val();
    let widget = $('#game-widget');

    let game = await request('GET', {'ckey': CKey});

    widget.off('load');
    widget.on('load', async function () {
        await play(CKey, MODE, OPPONENT_NAME);
    });
    widget.attr('src', 'https://codyfight.com/widget/game/?robot=' + game.robots.bearer.name);
}
