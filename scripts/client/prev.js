console.log('prev command received');

var player = document.getElementById('movie_player');
var isPlayerRunning = player && player.classList.contains('playing-mode'); 
var isCommandHandled = false;
if (!isPlayerRunning) {
    console.log('player is not running');
}
else {
    console.log('player is running');
    var actionBtn = document.getElementsByClassName('ytp-prev-button ytp-button')[0];
    if (actionBtn){
        actionBtn.click();
        isCommandHandled = true;
    }
}

chrome.runtime.sendMessage(
    {
        command: 'prev-youtube-command',
        playerWasRunning: isPlayerRunning, 
        commandHandled: isCommandHandled
    }, 
    function(response) {
        console.log(response);
});
