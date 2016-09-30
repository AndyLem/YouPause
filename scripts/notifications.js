function showNotification(id, message, buttons){
    chrome.notifications.create(id,
    {
        type:"basic",
        iconUrl: 'images/youtube-pause-128.png',
        title: "YouTube Pause",
        message: message,
        buttons: buttons
    },
    function(notificationId) { });
};