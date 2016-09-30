
function addTabToPausedList(tabId){
    if (pausedTabs.indexOf(tabId) >= 0) return;
    pausedTabs.push(tabId);
};

function removeTabFromPausedList(tabId){
    var index = pausedTabs.indexOf(tabId);
    if (index < 0) return;
    pausedTabs.splice(index, 1);
};

function showNotification(id, message, buttons, iconUrl){
    chrome.notifications.create(id,
    {
        type:"basic",
        iconUrl: iconUrl || 'images/youtube-pause-128-borders.png',
        title: "YouTube Pause",
        message: message,
        buttons: buttons
    },
    function(notificationId) { });
};