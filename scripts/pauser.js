console.log('pause command received');

var player = document.getElementById('movie_player');
if (player && player.classList.contains('paused-mode')) {
    console.log('player is already paused');
}
else {
    console.log('player is running');
    var pauseBtn = document.getElementsByClassName('ytp-play-button ytp-button')[0];
    if (pauseBtn){
        console.log(pauseBtn);
        pauseBtn.click();
    }
}
