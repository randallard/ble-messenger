// services/storage.js
class StorageService {
    getItem(key) {
        return localStorage.getItem(key);
    }

    setItem(key, value) {
        localStorage.setItem(key, value);
    }

    removeItem(key) {
        localStorage.removeItem(key);
    }

    getOrCreatePlayerId() {
        let storedPlayerId = this.getItem('playerId');
        
        if (!storedPlayerId) {
            storedPlayerId = uuid.v4();
            this.setItem('playerId', storedPlayerId);
        }
        
        return storedPlayerId;
    }

    saveConnection(linkId, friendlyName, playerId) {
        const connections = JSON.parse(this.getItem('savedConnections') || '{}');
        connections[linkId] = {
            friendlyName,
            playerId
        };
        this.setItem('savedConnections', JSON.stringify(connections));
    }

    loadSavedConnections() {
        return JSON.parse(this.getItem('savedConnections') || '{}');
    }

    deleteConnection(linkId) {
        const connections = this.loadSavedConnections();
        delete connections[linkId];
        this.setItem('savedConnections', JSON.stringify(connections));
    }
}

export const storageService = new StorageService();

