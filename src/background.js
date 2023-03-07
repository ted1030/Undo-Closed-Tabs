let restore = async () => {
    let sessions = await chrome.sessions.getRecentlyClosed();
    if (sessions.length <= 0) 
        return;
    let tabs = sessions.map(session => ({
        id: session?.tab.sessionId || session.window.sessionId,
        title: session?.tab.title || `(${session.window.tabs.length}) Chrome`
    }));
    chrome.contextMenus.removeAll()
    for (let i in tabs) {
        // add submenu if more than 6 items
        if (i == 5) {
            chrome.contextMenus.create({
                id: "closed-tabs",
                title: "▶",
                contexts: ["action"]
            });  
        }
        // create closed tab items
        chrome.contextMenus.create({
            parentId: i < 5 ? null : "closed-tabs",
            id: tabs[i].id,
            title: tabs[i].title,
            contexts: ["action"]
        });
    }
};
restore();

chrome.sessions.onChanged.addListener(() => restore());
chrome.contextMenus.onClicked.addListener((info, tab) => chrome.sessions.restore(info.menuItemId));
chrome.action.onClicked.addListener(tab => chrome.sessions.restore());