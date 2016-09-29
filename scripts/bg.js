chrome.browserAction.onClicked.addListener(function(tab){
    console.log("clicked on a tab "+tab.url);

    chrome.tabs.executeScript({
        code: "document.body.style.backgroundColor = 'gray'"
    })
});

chrome.commands.onCommand.addListener(function(command){
    console.log("command "+command);
    if (command == 'pause-youtube-command'){
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
                    }
                }
            }
        });
    }
});