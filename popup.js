// popup.js
document.addEventListener('DOMContentLoaded', function () {
    const status = document.getElementById('status');
    const result = document.getElementById('result');
    const details = document.getElementById('details');
    const toggle = document.getElementById('toggle');
    const clearBtn = document.getElementById('clear');

    // default assumptions
    const kWhPerGB = 0.06;
    const gCO2PerKWh = 475;
    const chainMultiplier = 50;

    function gramsFromBytes(bytes) {
        const gb = bytes / (1024 * 1024 * 1024);
        const kwh = gb * kWhPerGB;
        return kwh * gCO2PerKWh;
    }

    function bytesToHuman(bytes) {
        if (!bytes) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = 0;
        let b = bytes;
        while (b >= 1024 && i < units.length - 1) { b = b / 1024; i++; }
        return `${Math.round(b * 100) / 100} ${units[i]}`;
    }

    // Load stats when popup opens
    chrome.storage.local.get(['last', 'stats', 'enabled'], function (res) {
        const last = res.last || null;
        const stats = res.stats || {};
        const enabled = (res.enabled === undefined) ? true : res.enabled;

        toggle.textContent = enabled ? 'Disable' : 'Enable';

        if (last) {
            const grams = gramsFromBytes(last.bytes);
            status.innerHTML = `<div class="big">${Math.round(grams * 100) / 100} g CO₂</div>`;
            result.innerHTML = `<div>${bytesToHuman(last.bytes)} transferred on <strong>${last.hostname}</strong></div>`;
            let extra = `Measured at ${new Date(last.timestamp).toLocaleString()}.`;

            if (stats[last.hostname]) {
                const totalBytes = stats[last.hostname];
                const totalGrams = gramsFromBytes(totalBytes);
                extra += `<br/>Total for ${last.hostname}: ${bytesToHuman(totalBytes)} (~${Math.round(totalGrams * 100) / 100} g CO₂)`;
            }

            extra += `<br/>Inclusive estimate (×${chainMultiplier}): ${Math.round((grams * chainMultiplier) * 100) / 100} g CO₂`;
            details.innerHTML = extra;
        } else {
            status.textContent = 'No measurement yet. Open a page to measure.';
            clearBtn.disabled = true; // no stats to clear yet
        }
    });

    // Enable/disable toggle
    toggle.addEventListener('click', function () {
        chrome.storage.local.get(['enabled'], function (res) {
            const enabled = (res.enabled === undefined) ? true : res.enabled;
            chrome.storage.local.set({ enabled: !enabled }, function () {
                toggle.textContent = !enabled ? 'Disable' : 'Enable';
            });
        });
    });

    // Clear stats button
    clearBtn.addEventListener('click', function () {
        chrome.storage.local.set({ stats: {}, last: null }, function () {
            status.textContent = 'Stats cleared.';
            result.textContent = '';
            details.textContent = '';
            clearBtn.disabled = true; // disable button after clearing
        });
    });
});
