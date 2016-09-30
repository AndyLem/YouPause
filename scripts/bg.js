chrome.commands.onCommand.addListener(function(command){
    console.log("command "+command);
    if (command == 'pause-youtube-command'){
        handlePauseCommand();
    }
    if (command == 'resume-youtube-command'){
        handleResumeCommand();
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, info){
    console.log('tab is being closed, removing from the list '+tabId);
    removeTabFromPausedList(tabId);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (!sender.tab) return;
    console.log("message received from a content script: " + sender.tab.url + ' tab id: ' + sender.tab.id);
    console.log(request);
    if (request.pauseHandled) {
        addTabToPausedList(sender.tab.id);
        sendResponse('tab is added to paused list');
        videosPaused++;
    }
    else if (!request.playerWasRunning) {
         removeTabFromPausedList(sender.tab.id);
         sendResponse('tab is removed from paused list');
    }
    pauseCommandsSent--;
    if (pauseCommandsSent == 0)
        showNotification("pauseNotification", "Paused "+videosPaused+ (videosPaused > 1 ? " videos" : " video"));
});