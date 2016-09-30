function handlePauseCommand(){
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
    if (resumedVideosCount > 0) {
        showNotification("resumeNotification", "Resumed "+resumedVideosCount+ (resumedVideosCount > 1 ? " videos" : " video"));
    }
};