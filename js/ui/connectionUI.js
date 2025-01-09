// ui/connectionUI.js
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
                    <button class="button" onclick="window.rejoinConnection('${linkId}')">Rejoin</button>
                    <button class="button" style="background-color: #dc3545;" onclick="window.deleteConnection('${linkId}')">Delete</button>
                </div>
            `;
            container.appendChild(div);
        });
    }
}

export default ConnectionUI;
