$(document).ready(function () {
    $('#start-game').on('click', startGame);
});

async function startGame() {
    const CKey = $('#c-key').val();
    const mode = 2; // {1 - custom, 2 - random, 3 - arena}
    const opponentName = null; // use only when played in custom mode

    await play(CKey, mode, opponentName);
}
