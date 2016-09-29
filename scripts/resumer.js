var player = document.getElementById('movie_player');
var isPlayerRunning = player && !player.classList.contains('paused-mode'); 
if (isPlayerRunning) {
    console.log('player is already running');
}
else {
    console.log('player is paused');
    var playBtn = document.getElementsByClassName('ytp-play-button ytp-button')[0];
    if (playBtn){
        playBtn.click();
    }
}