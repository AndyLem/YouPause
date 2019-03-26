chrome.commands.onCommand.addListener(function(command) {
    console.log("command " + command);
    if (command == PauseCommand) {
        handlePauseCommand();
    }
    if (command == ResumeCommand) {
        handleResumeCommand();
    }
    if (command == NextCommand) {
        handleNextCommand();
    }
    if (command == PrevCommand) {
        handlePrevCommand();
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, info) {
    console.log('tab is being closed, removing from the list ' + tabId);
    removeTabFromPausedList(tabId);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("message received");
    console.log(sender);
    console.log(request);
    handleClientScriptMessage(request, sender, sendResponse);
});

chrome.notifications.onButtonClicked.addListener(function(id, index) {
    if (id == PauseNotificationId) {
        handlePauseNotificationButtonClick(index);
    }
    if (id == ResumeNotificationId) {
        handleResumeNotificationButtonClick(index);
    }
});

notifyPopupAboutPausedTabs([]);