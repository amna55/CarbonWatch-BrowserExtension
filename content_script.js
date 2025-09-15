// content_script.js
(function () {
    // Only run if the user didn't disable the extension
    chrome.storage.local.get(['enabled'], function (res) {
        const enabled = (res.enabled === undefined) ? true : res.enabled;
        if (!enabled) return;

        // wait a short time to let most resources load
        setTimeout(function () {
            try {
                var bytes = 0;

                // navigation entry (document)
                var nav = performance.getEntriesByType('navigation');
                if (nav && nav.length > 0) {
                    var n = nav[0];
                    if (typeof n.transferSize === 'number' && n.transferSize > 0) {
                        bytes += n.transferSize;
                    } else if (typeof n.encodedBodySize === 'number') {
                        bytes += n.encodedBodySize;
                    }
                }

                // resource entries
                var resources = performance.getEntriesByType('resource');
                resources.forEach(function (r) {
                    if (typeof r.transferSize === 'number' && r.transferSize > 0) {
                        bytes += r.transferSize;
                    } else if (typeof r.encodedBodySize === 'number' && r.encodedBodySize > 0) {
                        bytes += r.encodedBodySize;
                    } else if (typeof r.decodedBodySize === 'number' && r.decodedBodySize > 0) {
                        // last resort — uncompressed size (less ideal)
                        bytes += r.decodedBodySize;
                    }
                });

                const hostname = location.hostname || (new URL(location.href)).hostname;

                // send measurement to service worker/background
                chrome.runtime.sendMessage({ type: 'page_footprint', hostname: hostname, bytes: bytes });

                // store last measurement (used by popup)
                const last = { hostname: hostname, bytes: bytes, timestamp: Date.now() };
                chrome.storage.local.set({ last: last });
            } catch (e) {
                console.error('Carbon Watch: failed to compute page bytes', e);
            }
        }, 1500); // 1.5s delay (tweak if you want)
    });
})();
