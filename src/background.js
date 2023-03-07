let tabs = [];

let restore = async () => {
    let sessions = await chrome.sessions.getRecentlyClosed();
    if (sessions.length <= 0) 
        return;
    tabs = Object.fromEntries(sessions/*.filter(s => s?.tab)*/.map((session) => {
        if (session?.tab)
            return [session.tab.sessionId, session.tab.title]
        return [session.window.sessionId, `(${session.window.tabs.length}) Chrome`]
    }));
    chrome.contextMenus.removeAll()

    top_items = Object.entries(tabs).reverse().slice(0, 5)
    sub_items = Object.entries(tabs).reverse().slice(5)
    if (top_items) {
        top_items.forEach((item) => {
            chrome.contextMenus.create({
                id: item[0],
                title: item[1],
                contexts: ["action"]
            });
        });
    }
    if (sub_items) {
        chrome.contextMenus.create({
            id: "closed-tabs",
            title: "▶",
            contexts: ["action"]
        });
        sub_items.forEach((item) => {
            chrome.contextMenus.create({
                parentId: "closed-tabs",
                id: item[0],
                title: item[1],
                contexts: ["action"]
            });
        });
    }
};
restore();

chrome.sessions.onChanged.addListener(() => restore());
chrome.contextMenus.onClicked.addListener((info, tab) => chrome.sessions.restore(info.menuItemId));
chrome.action.onClicked.addListener(tab => chrome.sessions.restore());