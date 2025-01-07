
// main.js
import { bluetoothService } from './services/bluetooth.js';
import { chatService } from './services/chat.js';
import { storageService } from './services/storage.js';
import { themeService } from './services/theme.js';
import { userService } from './services/user.js';
import MessageUI from './ui/messageUI.js';
import ConnectionUI from './ui/connectionUI.js';

console.log('UUID available:', typeof uuid !== 'undefined');

// Initialize services and UI
const initializeApp = () => {
    // First check if we need initial setup
    const playerId = storageService.getItem('playerId');
    setupEventListeners();
    setupGlobalFunctions();
    userService.checkInitialSetup();
    
    if (!playerId) {
        return; // Don't run the rest until we have a playerId
    }

    // Initialize core services
    themeService.initializeTheme();
    userService.initializeUserIdentity();

    // Load connections last
    const savedConnections = storageService.loadSavedConnections();
    ConnectionUI.displaySavedConnections(savedConnections);

    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const linkId = urlParams.get('link');
    if (linkId) {
        document.getElementById('linkInput').value = linkId;
    }
};

const setupEventListeners = () => {

    console.log('Setting up event listeners...');
    const saveInitialBtn = document.getElementById('saveInitialName');
    console.log('Save Initial Name button:', saveInitialBtn);

    if (saveInitialBtn) {
        saveInitialBtn.addEventListener('click', () => {
            console.log('Save button clicked');
            const name = document.getElementById('initialUserName').value.trim();
            if (name) {
                storageService.setItem('userName', name);
                storageService.setItem('playerId', uuid.v4());
                window.location.reload();
            }
        });
    }
    
    const themeToggleBtn = document.getElementById('themeToggle');
    themeToggleBtn?.addEventListener('click', themeService.toggleTheme.bind(themeService));

    // Add event listeners for user management
    document.getElementById('loadBackupBtn').addEventListener('click', () => {
        document.getElementById('backupFileInput').click();
    });
    
    document.getElementById('backupFileInput').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            userService.loadBackup(file);
        }
    });

    document.getElementById('loadBackupBtn1').addEventListener('click', () => {
        document.getElementById('restoreBackup').click();
    });
    
    document.getElementById('restoreBackup').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            userService.loadBackup(file);
        }
    });

    document.getElementById('saveNameBtn').addEventListener('click', () => 
        userService.saveUserName()
    );
    
    document.getElementById('editNameBtn').addEventListener('click', () => 
        userService.editUserName()
    );
    
    document.getElementById('userNameField').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            userService.saveUserName();
        }
    });

    document.getElementById('exportDataBtn').addEventListener('click', () => 
        userService.exportData()
    );

    // Add Bluetooth event listeners
    document.getElementById('connectBtn').addEventListener('click', async () => {
        try {
            const isConnected = await bluetoothService.connect();
            MessageUI.updateStatus(isConnected);
        } catch (error) {
            console.error('Connection error:', error);
            alert('Error: ' + error);
        }
    });

    document.getElementById('newFriendlyName').addEventListener('input', (e) => {
        document.getElementById('createConnectionBtn').disabled = !e.target.value.trim();
    });

    document.getElementById('startAnimation').addEventListener('click', async () => {
        try {
            await bluetoothService.writeSwitch(1);
            setTimeout(() => bluetoothService.writeSwitch(0), 10000); // Stop after 10 seconds
        } catch (error) {
            console.error('Animation error:', error);
            alert('Error: ' + error);
        }
    });

    document.getElementById('stopAnimation').addEventListener('click', async () => {
        try {
            await bluetoothService.writeSwitch(0);
        } catch (error) {
            console.error('Animation error:', error);
            alert('Error: ' + error);
        }
    });

    document.getElementById('sendText').addEventListener('click', async () => {
        const textField = document.getElementById('customText');
        const text = textField.value.trim();
        if (!text) return;
        
        try {
            await bluetoothService.sendText('... ... ' + text);
            textField.value = '';
        } catch (error) {
            console.error('Send text error:', error);
            alert('Error: ' + error);
        }
    });
};

const setupGlobalFunctions = () => {

    window.createConnection = async () => {
        const friendlyName = document.getElementById('newFriendlyName').value.trim();
        if (!friendlyName) return;
    
        try {
            const newPlayerId = uuid.v4();
            const connection = await chatService.createConnection(newPlayerId, friendlyName);
            chatService.currentConnectionId = connection.id;
            chatService.playerId = newPlayerId;
            
            storageService.saveConnection(connection.link_id, friendlyName, newPlayerId);
            
            document.getElementById('notifications').innerHTML = `
                Share this link with your friend:<br>
                <input type="text" value="${connection.link_id}" readonly style="width: 100%">
            `;
            
            document.getElementById('setupArea').classList.add('hidden');
            document.getElementById('chatArea').classList.remove('hidden');
            MessageUI.appendMessage('System', 'Waiting for friend to join...');
            
            chatService.startPolling();
        } catch (error) {
            console.error('Error creating connection:', error);
            document.getElementById('notifications').innerHTML = `Error: ${error.message}`;
        }
    };

    // Make certain functions available globally for onclick handlers
    window.rejoinConnection = async (linkId) => {
        try {
            // Show loading state
            const notifications = document.getElementById('notifications');
            notifications.innerHTML = 'Reconnecting...';
    
            const result = await chatService.rejoinConnection(linkId);
            
            // Update UI
            document.getElementById('setupArea').classList.add('hidden');
            document.getElementById('chatArea').classList.remove('hidden');
            document.getElementById('notifications').innerHTML = '';
            
            // If there's a friendly name field, update it
            const friendlyNameInput = document.getElementById('friendlyName');
            if (friendlyNameInput) {
                friendlyNameInput.value = result.connectionInfo.friendlyName;
            }
    
            MessageUI.appendMessage('System', 'Reconnected to chat');
    
        } catch (error) {
            console.error('Error reconnecting:', error);
            document.getElementById('notifications').innerHTML = `
                <div class="error-notification">
                    Error reconnecting: ${error.message}
                    <button class="retry-button" onclick="window.rejoinConnection('${linkId}')">
                        Retry Connection
                    </button>
                </div>
            `;
        }
    };

    window.deleteConnection = (linkId) => {
        storageService.deleteConnection(linkId);
        ConnectionUI.displaySavedConnections(storageService.loadSavedConnections());
    };
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', initializeApp);

