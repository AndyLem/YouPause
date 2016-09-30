chrome.commands.onCommand.addListener(function(command){
    console.log("command "+command);
    if (command == PauseCommand){
        handlePauseCommand();
    }
    if (command == ResumeCommand){
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
    handleClientScriptMessage(request, sender.tab, sendResponse);
});

chrome.notifications.onButtonClicked.addListener(function(id, index){
    if (id == PauseNotificationId) {
        handlePauseNotificationButtonClick(index);
    }
    if (id == ResumeNotificationId) {
        handleResumeNotificationButtonClick(index);
    }
});