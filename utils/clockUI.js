/**
 * Clean Synthwave Timer – top-right, subtle but visible
 */
let timerElement = null;
let startTime = null;

export function initClockUI() {
    if (timerElement) return;

    timerElement = document.createElement('div');
    Object.assign(timerElement.style, {
        position: 'fixed',
        top: '16px',
        right: '16px',
        color: '#ff00ff',
        fontFamily: 'monospace',
        fontSize: '20px',
        fontWeight: 'bold',
        textShadow: `
            0 0 6px #ff00ff,
            0 0 12px #00ffff
        `,
        zIndex: '9999',
        pointerEvents: 'none'
    });
    timerElement.textContent = '00:00';
    document.body.appendChild(timerElement);

    startTime = performance.now();
}

export function updateClockUI() {
    if (!timerElement || startTime === null) return;

    const elapsedMs = performance.now() - startTime;
    const totalSec = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const seconds = (totalSec % 60).toString().padStart(2, '0');

    timerElement.textContent = `${minutes}:${seconds}`;
}