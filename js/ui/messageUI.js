// ui/messageUI.js
class MessageUI {
    static appendMessage(from, content) {
        const messageArea = document.getElementById('messageArea');
        const displayName = from === 'You' || from === 'System' ? from : this.getFriendlyName(from);
        messageArea.innerHTML += `<p><strong>${displayName}:</strong> ${content}</p>`;
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    static getFriendlyName(playerId) {
        const playerNames = JSON.parse(localStorage.getItem('playerNames') || '{}');
        return playerNames[playerId] || 'Unknown';
    }

    static updateStatus(connected) {
        const statusDiv = document.getElementById('status');
        const startAnimation = document.getElementById('startAnimation');
        const stopAnimation = document.getElementById('stopAnimation');
        const sendText = document.getElementById('sendText');
        const connectBtn = document.getElementById('connectBtn');

        statusDiv.textContent = connected ? 'Connected' : 'Disconnected';
        statusDiv.className = connected ? 'connected' : 'disconnected';
        startAnimation.disabled = !connected;
        stopAnimation.disabled = !connected;
        sendText.disabled = !connected;
        connectBtn.textContent = connected ? 'Disconnect' : 'Connect to Device';
    }
}

export default MessageUI;

