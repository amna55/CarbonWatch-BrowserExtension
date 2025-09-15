// background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.type === 'page_footprint') {
        const hostname = message.hostname || 'unknown';
        const bytes = Number(message.bytes) || 0;

        chrome.storage.local.get(['stats'], function (result) {
            const stats = result.stats || {};
            stats[hostname] = (stats[hostname] || 0) + bytes;

            chrome.storage.local.set({ stats: stats }, function () {
                // optional callback
                sendResponse && sendResponse({ status: 'ok' });
            });
        });

        // return true to indicate we'll call sendResponse asynchronously
        return true;
    }
});
