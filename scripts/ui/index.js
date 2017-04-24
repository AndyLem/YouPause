function renderTabs(tabsList) {
    var list = $('#tabs-table-body');
    list.empty();

    chrome.tabs.query({}, function (allTabs) {
        var rows = 0;
        for (var i = 0; i < tabsList.length; i++) {
            var tab = getTab(tabsList[i], allTabs);
            if (!tab) continue;
            var row = $(document.createElement('tr'));
            var desc = $(document.createElement('td'))
                .html('<a href="#" data-id=' + tabsList[i] + ' class="open-tab">' + tab.title + '</a>')
                .appendTo(row);
            var actions = $(document.createElement('td'))
                .html('<a href="#" data-id=' + tabsList[i] + ' class="resume-btn btn btn-primary">Resume</a>')
                .appendTo(row);
            row.appendTo(list);
            rows++;
        }
        if (rows == 0)
            $('#resume-all-btn').addClass('disabled');
        else
            $('#resume-all-btn').removeClass('disabled');
    });
}


function getTab(id, allTabs){
    for (var i=0;i<allTabs.length;i++){
        if (allTabs[i].id == id) return allTabs[i];
    }
    return null;
}

function resumeTab(id){
    chrome.runtime.sendMessage({
        command: ActionResumeCommand,
        id:id
    });
}

function selectTab(id){
    chrome.tabs.query({}, function(allTabs){
        var tab = getTab(id, allTabs);
        if (!tab) return;
        if (tab.windowId)
            chrome.windows.update(tab.windowId, {focused: true});
        chrome.tabs.update(id, {active: true});
    });    
}

$('#tabs-table').on("click", 'a.resume-btn', function(){
    resumeTab($(this).data('id'));
});

$('#resume-all-btn').on("click", function(){
    if ($('#resume-all-btn').hasClass('disabled')) return;
    console.log('resuming all');
    chrome.runtime.sendMessage({
        command: ResumeAllFromPopupCommand
    });
});

$('#tabs-table').on("click", 'a.open-tab', function(){
    selectTab($(this).data('id'));
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.command == NotifyPopupAboutPausedVideos) {
        renderTabs(request.tabs);
    }
});

chrome.runtime.sendMessage({
    command: ActionGetPausedTabsCommand
}, function(response) {
    renderTabs(response);
});