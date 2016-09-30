
function addTabToPausedList(tabId){
    if (pausedTabs.indexOf(tabId) >= 0) return;
    pausedTabs.push(tabId);
};

function removeTabFromPausedList(tabId){
    var index = pausedTabs.indexOf(tabId);
    if (index < 0) return;
    pausedTabs.splice(index, 1);
};