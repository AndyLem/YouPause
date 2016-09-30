console.log('resume command received');

var player = document.getElementById('movie_player');
var isPlayerRunning = player && !player.classList.contains('paused-mode'); 
var isResumeHandled = false;
if (isPlayerRunning) {
    console.log('player is already running');
}
else {
    console.log('player is paused');
    var playBtn = document.getElementsByClassName('ytp-play-button ytp-button')[0];
    if (playBtn){
        playBtn.click();
        isResumeHandled = true;
    }
}

chrome.runtime.sendMessage(
    {
        command: 'resume-youtube-command',
        playerWasRunning: isPlayerRunning, 
        pauseHandled: false,
        resumeHandled: isResumeHandled
    }, 
    function(response) {
        console.log(response);
});