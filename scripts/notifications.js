function showNotification(id, message){
    chrome.notifications.create(id,
    {
        type:"basic",
        iconUrl: 'images/youtube-pause-128.png',
        title: "YouTube Pause",
        message: message
    },
    function(notificationId) { });
};