function handlePauseCommand(){
    lastPausedTabs = pausedTabs;
    pausedTabs = [];
    videosPaused = 0;
    pauseCommandsSent = 0;
    handleBroadcastEvent(executePauseInYoutubeTab, "pause-command");
};

function handleNextCommand() {
    handleBroadcastEvent(executeNextInYoutubeTab, "next-command");
};

function handlePrevCommand() {
    handleBroadcastEvent(executePrevInYoutubeTab, "prev-command");
};

function handleBroadcastEvent(commandExecutor, eventName){
    chrome.windows.getAll({populate:true}, function(windowsList){
        for (var i=0;i<windowsList.length;i++){
            for (var j=0;j<windowsList[i].tabs.length;j++){
                var tab = windowsList[i].tabs[j];
                var isYouTube = tab.url.toLowerCase().indexOf('youtube.com/watch?v=') >= 0; 
                if (isYouTube){
                    commandExecutor(tab);
                }
            }
        }        
    });
    _gaq.push(['_trackEvent', eventName, 'clicked']);
};

function executeNextInYoutubeTab(tab) {
    console.log('youtube tab ' + tab.id + ' found ' + tab.url);
    console.log('sending a next command to the tab ' + tab.id);
    chrome.tabs.executeScript(tab.id, 
        {
            file: "scripts/client/next.js"
        });
};

function executePrevInYoutubeTab(tab) {
    console.log('youtube tab ' + tab.id + ' found ' + tab.url);
    console.log('sending a prev command to the tab ' + tab.id);
    chrome.tabs.executeScript(tab.id, 
        {
            file: "scripts/client/prev.js"
        });
};

function executePauseInYoutubeTab(tab) {
    console.log('youtube tab ' + tab.id + ' found ' + tab.url);
    console.log('sending a pause command to the tab ' + tab.id);
    pauseCommandsSent++;
    chrome.tabs.executeScript(tab.id, 
        {
            file: "scripts/client/pauser.js"
        });
};

function handleResumeCommand(){
    resumeCommandsSent = 0;
    videosResumed = 0;
    for (var i=0;i<pausedTabs.length;i++){
        console.log('resuming a player on '+ pausedTabs[i])
        try {
            resumeCommandsSent++;
            resumeTab(pausedTabs[i]);
                
        } catch (error) {
            resumeCommandsSent--;
            console.log('error occured, removing a tab from the list.')
            console.log(error);
            removeTabFromPausedList(pausedTabs[i]);            
        }
    }
    _gaq.push(['_trackEvent', "resume-command", 'clicked']);
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

function handleClientScriptMessage(request, sender, sendResponse){
    if (request.command == PauseCommand) {
        handlePauseCommandCallback(request, sender.tab, sendResponse);
    } else if (request.command == ResumeCommand) {
        handleResumeCommandCallback(request, sender.tab, sendResponse);
    } else if (request.command == ActionResumeCommand) {
        handlePopupActionResume(request, sendResponse);
    } else if (request.command == ActionGetPausedTabsCommand) {
        handleGetPausedTabsCommand(request, sendResponse);
    } else if (request.command == ResumeAllFromPopupCommand) {
        handleResumeCommand();
    } else if (request.command == NextCommand) {
        handleNextCallback(request, sender, sendResponse)
     } else if (request.command == PrevCommand) {
        handlePrevCallback(request, sender, sendResponse)
    }
};

function handleNextCallback(request, sender, sendResponse) {
    sendResponse("Next is executed in the tab");
};

function handlePrevCallback(request, sender, sendResponse) {
    sendResponse("Prev is executed in the tab");
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
        notifyPopupAboutPausedTabs(pausedTabs);
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
        notifyPopupAboutPausedTabs([]);
    }
}

function handlePopupActionResume(request, sendResponse) {
    resumeTab(request.id);
    removeTabFromPausedList(request.id);
    notifyPopupAboutPausedTabs(pausedTabs);
};

function handleGetPausedTabsCommand(request, sendResponse){
    sendResponse(pausedTabs);
}