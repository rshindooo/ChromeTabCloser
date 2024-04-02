chrome.action.onClicked.addListener(closeOldTabs);

function closeOldTabs() {
  chrome.tabs.query({}, function(tabs) {
    const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
    const cutoff = new Date().getTime() - oneDay;

    const tabsToClose = tabs.filter(function(tab) {
      return tab.lastAccessed && tab.lastAccessed < cutoff;
    });

    if (tabsToClose.length > 0) {
      const tabIds = tabsToClose.map(function(tab) {
        return tab.id;
      });

      chrome.tabs.remove(tabIds, function() {
        const plural = tabsToClose.length > 1 ? 's' : '';
        const message = `Closed ${tabsToClose.length} old tab${plural}.`;
        showNotification(message);
      });
    } else {
      showNotification('No old tabs to close.');
    }
  });
}

function showNotification(message) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
    title: 'Close Old Tabs',
    message: message
  });
}