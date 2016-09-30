function handlePauseCommand(){
    lastPausedTabs = pausedTabs;
    pausedTabs = [];
    
    chrome.windows.getAll({populate:true}, function(windowsList){
        pauseCommandsSent = 0;
        videosPaused = 0;
        for (var i=0;i<windowsList.length;i++){
            for (var j=0;j<windowsList[i].tabs.length;j++){
                var tab = windowsList[i].tabs[j];

                var isYouTube = tab.url.toLowerCase().indexOf('youtube.com/watch?v=') >= 0; 

                if (isYouTube){
                    console.log('youtube tab ' + tab.id + ' found ' + tab.url);
                    console.log('sending a pause command to the tab ' + tab.id);
                    pauseCommandsSent++;
                    chrome.tabs.executeScript(tab.id, 
                        {
                            file: "scripts/pauser.js"
                        });
                }
            }
        }        
    });
};

function handleResumeCommand(){
    resumeCommandsSent = 0;
    videosResumed = 0;
    for (var i=0;i<pausedTabs.length;i++){
        console.log('resuming a player on '+ pausedTabs[i])
        try {
            resumeCommandsSent++;
            chrome.tabs.executeScript(pausedTabs[i], 
                {
                    file: "scripts/resumer.js"
                });
                
        } catch (error) {
            resumeCommandsSent--;
            console.log('error occured, removing a tab from the list.')
            console.log(error);
            removeTabFromPausedList(pausedTabs[i]);            
        }
    }
};

function handlePauseNotificationButtonClick(index){
    if (index == 0) {
        console.log("Resume back was clicked on the pause notification");
        handleResumeCommand();
    }
};

function handleResumeNotificationButtonClick(index){
    if (index == 0) {
        console.log("Pause back was clicked on the resume notification");
        handlePauseCommand();
    }
};

function handleClientScriptMessage(request, tab, sendResponse){
    console.log("message received from a content script: " + tab.url + ' tab id: ' + tab.id);
    console.log(request);
    if (request.command = PauseCommand) {
        handlePauseCommandCallback(request, tab, sendResponse);
    }
    if (request.command = ResumeCommand) {
        handleResumeCommandCallback(request,tab, sendResponse);
    }
    
};

function handlePauseCommandCallback(request, tab, sendResponse){
    if (request.pauseHandled) {
        addTabToPausedList(tab.id);
        sendResponse('tab is added to paused list');
        videosPaused++;
    }
    else if (!request.playerWasRunning) {
         removeTabFromPausedList(tab.id);
         sendResponse('tab is removed from paused list');
    }
    pauseCommandsSent--;
    if (pauseCommandsSent == 0) {
        if (videosPaused > 0) {
            showNotification(PauseNotificationId, "Paused "+videosPaused+ (videosPaused > 1 ? " videos" : " video"),
            [{title: "Resume back"}]);
        }
        else {
            pausedTabs = lastPausedTabs;
            showNotification(NothingToPauseNotification, "No videos to pause");
        }
    }
}

function handleResumeCommandCallback(request, tab, sendResponse){
    if (request.resumeHandled) {
        videosResumed++;
    }
    resumeCommandsSent--;
    if (resumeCommandsSent == 0) {
        if (videosResumed > 0) {
            showNotification(ResumeNotificationId, "Resumed "+videosResumed+ (videosResumed > 1 ? " videos" : " video"),
                [{title: "Pause back"}],
                "images/youtube-play-128-borders.png");
        }
        else {
            showNotification(NothingToResumeNotification, "No videos to resume");
        }
    }
}

