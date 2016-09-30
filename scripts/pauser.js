console.log('pause command received');

var player = document.getElementById('movie_player');
var isPlayerRunning = player && !player.classList.contains('paused-mode'); 
var isPauseHandled = false;
if (!isPlayerRunning) {
    console.log('player is already paused');
}
else {
    console.log('player is running');
    var pauseBtn = document.getElementsByClassName('ytp-play-button ytp-button')[0];
    if (pauseBtn){
        pauseBtn.click();
        isPauseHandled = true;
    }
}

chrome.runtime.sendMessage(
    {
        command: 'pause-youtube-command',
        playerWasRunning: isPlayerRunning, 
        pauseHandled: isPauseHandled,
        resumeHandled: false
    }, 
    function(response) {
        console.log(response);
});
