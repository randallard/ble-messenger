// In connectionUI.js
class ConnectionUI {
    static displaySavedConnections(connections) {
        const container = document.getElementById('savedConnections');
        container.innerHTML = '<h3>Saved Connections</h3>';
        
        Object.entries(connections).forEach(([linkId, info]) => {
            const div = document.createElement('div');
            div.className = 'connection-item';
            div.innerHTML = `
                <span>${info.friendlyName}</span>
                <div>
                    <button class="button" onclick="ConnectionUI.copyConnectionLink('${linkId}')">Copy Link</button>
                    <button class="button" onclick="rejoinConnection('${linkId}')">Rejoin</button>
                    <button class="button" style="background-color: #dc3545;" onclick="deleteConnection('${linkId}')">Delete</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    static copyConnectionLink(linkId) {
        const isWebProtocol = window.location.protocol === 'http:' || window.location.protocol === 'https:';
        const linkUrl = isWebProtocol 
            ? `${window.location.origin}/ble-connect?link=${linkId}`
            : linkId;
            
        navigator.clipboard.writeText(linkUrl).then(() => {
            const notifications = document.getElementById('notifications');
            notifications.innerHTML = 'Link copied to clipboard!';
            setTimeout(() => {
                notifications.innerHTML = '';
            }, 2000);
        });
    }
}

export default ConnectionUI;