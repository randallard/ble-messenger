import { storageService } from './storage.js';
import { API_ENDPOINTS } from '../config/api.js';
import { bluetoothService } from './bluetooth.js';
import MessageUI from '../ui/messageUI.js';

class ChatService {
    constructor() {
        this.currentConnectionId = null;
        this.pollInterval = null;
        this.playerId = null;
        this.storage = storageService;
    }

    async createConnection(playerId, friendlyName) {
        try {
            const response = await fetch(API_ENDPOINTS.CREATE_CONNECTION, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' 
                },
                body: JSON.stringify({ player_id: playerId })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Error creating connection:', error);
            throw error;
        }
    }
    async joinConnection(linkId, playerId) {
        try {
            // Extract just the link ID if a full URL was provided
            const cleanLinkId = linkId.includes('?link=') 
                ? linkId.split('?link=')[1] 
                : linkId;
                
            const response = await fetch(API_ENDPOINTS.JOIN_CONNECTION(cleanLinkId), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_id: playerId })
            });
            
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error joining connection:', error);
            throw error;
        }
    }
    async sendMessage(connectionId, playerId, content) {
        try {
            const response = await fetch(API_ENDPOINTS.SEND_MESSAGE(connectionId), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player_id: playerId,
                    content: content
                })
            });
            
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async rejoinConnection(linkId) {
        try {
            // Get connection info from storage
            const connections = this.storage.loadSavedConnections();
            const connectionInfo = connections[linkId];
            
            if (!connectionInfo || !connectionInfo.playerId) {
                throw new Error('Connection information not found or incomplete');
            }
            
            // Set the player ID for this connection
            this.playerId = connectionInfo.playerId;
            
            // Try to join the connection
            const connection = await this.joinConnection(linkId, this.playerId);
            this.currentConnectionId = connection.id;
            
            // Start polling for messages
            this.startPolling();
            
            return {
                success: true,
                connectionInfo,
                connection
            };
        } catch (error) {
            console.error('Error rejoining connection:', error);
            throw error;
        }
    }

    startPolling() {
        if (!this.pollInterval) {
            this.pollInterval = setInterval(() => this.pollNotifications(), 1000);
        }
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    async pollNotifications() {
        if (!this.playerId) return;

        try {
            const response = await fetch(API_ENDPOINTS.GET_NOTIFICATIONS(this.playerId));
            if (!response.ok) throw new Error('Failed to fetch notifications');

            const notifications = await response.json();
            
            if (notifications.length > 0) {
                notifications.forEach(this.handleNotification.bind(this));
                
                // Acknowledge notifications
                await fetch(API_ENDPOINTS.ACK_NOTIFICATIONS(this.playerId), {
                    method: 'POST'
                });
            }
        } catch (error) {
            console.error('Error polling notifications:', error);
        }
    }

    handleNotification(notification) {
        // Handle different types of notifications
        if (notification.includes('Player') && notification.includes('joined')) {
            this.onPlayerJoined(notification);
        } 
        else if (notification.includes('Message from')) {
            this.onMessageReceived(notification);
        }
    }

    onPlayerJoined(notification) {
        document.getElementById('setupArea').classList.add('hidden');
        document.getElementById('chatArea').classList.remove('hidden');
        MessageUI.appendMessage('System', 'Friend joined the chat!');
    }

    async onMessageReceived(notification) {
        const match = notification.match(/Message from (.*?): (.*)/);
        if (!match) return;

        const [, senderPlayerId, message] = match;

        // Handle heart emoji animation
        if (message === "❤️" && bluetoothService.isConnected()) {
            await bluetoothService.writeSwitch(1);
            setTimeout(() => bluetoothService.writeSwitch(0), 10000);
        }
        else if (bluetoothService.isConnected()) {
            await bluetoothService.sendText(message);
        }

        MessageUI.appendMessage(senderPlayerId, message);
    }

}

export const chatService = new ChatService(storageService);

