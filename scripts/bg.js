var pausedTabs = [];

chrome.browserAction.onClicked.addListener(function(tab){
    console.log("clicked on a tab "+tab.url);

    chrome.tabs.executeScript({
        code: "document.body.style.backgroundColor = 'gray'"
    })
});

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

function showNotification(id, message){
    chrome.notifications.create(id,
    {
        type:"basic",
        iconUrl: 'images/youtube-pause-128.png',
        title: "YouTube Pause",
        message: message,
    },
    function(notificationId) {});
};

function handlePauseCommand(){
    pausedTabs = [];
    var pausedVideosCount = 0;
    chrome.windows.getAll({populate:true}, function(windowsList){
        for (var i=0;i<windowsList.length;i++){
            for (var j=0;j<windowsList[i].tabs.length;j++){
                var tab = windowsList[i].tabs[j];

                var isYouTube = tab.url.toLowerCase().indexOf('youtube.com/watch?v=') >= 0; 

                if (isYouTube){
                    console.log('youtube tab ' + tab.id + ' found ' + tab.url);
                    console.log('sending a pause command to the tab ' + tab.id);
                    chrome.tabs.executeScript(tab.id, 
                        {
                            file: "scripts/pauser.js"
                        });
                    pausedVideosCount++;
                }
            }
        }
    });
    if (pausedVideosCount > 0) {
        showNotification("pauseNotification", "Paused "+pausedVideosCount+" videos");
    }

};



function handleResumeCommand(){
    var resumedVideosCount = 0;
    for (var i=0;i<pausedTabs.length;i++){
        console.log('resuming a player on '+ pausedTabs[i])
        try {
            chrome.tabs.executeScript(pausedTabs[i], 
                {
                    file: "scripts/resumer.js"
                });
                resumedVideosCount++;
        } catch (error) {
            console.log('error occured, removing a tab from the list.')
            console.log(error);
            removeTabFromPausedList(pausedTabs[i]);            
        }
    }
    if (resumedVideosCount > 0){
        showNotification("resumeNotification", "Resumed "+resumedVideosCount+" videos");
    }

};


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (!sender.tab) return;
    console.log("message received from a content script: " + sender.tab.url + ' tab id: ' + sender.tab.id);
    console.log(request);
    if (request.pauseHandled) {
        addTabToPausedList(sender.tab.id);
        sendResponse('tab is added to paused list');
    }
    else if (!request.playerWasRunning) {
         removeTabFromPausedList(sender.tab.id);
         sendResponse('tab is removed from paused list');
    }
  });

function addTabToPausedList(tabId){
    if (pausedTabs.indexOf(tabId) >= 0) return;
    pausedTabs.push(tabId);
};

function removeTabFromPausedList(tabId){
    var index = pausedTabs.indexOf(tabId);
    if (index < 0) return;
    pausedTabs.splice(index, 1);
};