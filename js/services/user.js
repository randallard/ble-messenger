import { storageService } from './storage.js';

class UserService {
    constructor(storageService) {
        this.storage = storageService;
        this.initializeBackupLoader();
    }

    initializeBackupLoader() {
        const loadBackupBtn = document.getElementById('loadBackupBtn');
        const fileInput = document.getElementById('backupFileInput');
        
        loadBackupBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                this.loadBackup(file);
            }
        });
    }
    
    async loadBackup(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            console.log('Loaded backup data:', data);
            
            // Clear current localStorage
            localStorage.clear();
            
            // Load backup data
            Object.entries(data).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
            
            // Refresh the UI
            this.initializeUserIdentity();
            
            document.getElementById('dataManagementStatus').textContent = 'Backup loaded successfully!';
            setTimeout(() => {
                document.getElementById('dataManagementStatus').textContent = '';
            }, 3000);
            
            // Reload the page to refresh all components
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error loading backup:', error);
            document.getElementById('dataManagementStatus').textContent = `Error loading backup: ${error.message}`;
        }
    }
    
    saveInitialName() {
        const name = document.getElementById('initialUserName').value.trim();
        console.log('Saving to localStorage:', {
            userName: name,
            playerId: uuid.v4(),
            allStorage: Object.entries(localStorage).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {})
        });
        if (name) {
            this.storage.setItem('userName', name);
            this.storage.setItem('playerId', uuid.v4());
            document.getElementById('mainContent').classList.remove('hidden');
            document.getElementById('initialSetup').classList.add('hidden');
            this.initializeUserIdentity();
            setupEventListeners();
            setupGlobalFunctions();
            console.log('saved and reloaded');
        }
    }

    checkInitialSetup() {
        const playerId = this.storage.getItem('playerId');
        console.log('Current playerId:', playerId);
    
        const mainContent = document.getElementById('mainContent');
        const initialSetup = document.getElementById('initialSetup');
        const saveButton = document.getElementById('saveInitialName');
    
        if (!playerId) {
            saveButton.onclick = () => this.saveInitialName();
        } else {
            mainContent.classList.remove('hidden');
            initialSetup.classList.add('hidden');
        }
    }

    initializeUserIdentity() {
        const userName = this.storage.getItem('userName');
        const nameDisplay = document.getElementById('nameDisplay');
        const nameInput = document.getElementById('nameInput');
        const displayedName = document.getElementById('displayedName');
        const playerIdDisplay = document.getElementById('playerIdDisplay');

        // Display player ID
        playerIdDisplay.textContent = this.storage.getOrCreatePlayerId();

        if (userName) {
            // Show name display section
            nameDisplay.style.display = 'block';
            nameInput.style.display = 'none';
            displayedName.textContent = userName;
        } else {
            // Show name input section
            nameDisplay.style.display = 'none';
            nameInput.style.display = 'block';
        }
    }

    saveUserName() {
        const nameField = document.getElementById('userNameField');
        const userName = nameField.value.trim();
        
        if (userName) {
            this.storage.setItem('userName', userName);
            document.getElementById('displayedName').textContent = userName;
            document.getElementById('nameDisplay').style.display = 'block';
            document.getElementById('nameInput').style.display = 'none';
            
            // Show success message
            document.getElementById('dataManagementStatus').textContent = 'Name saved successfully!';
            setTimeout(() => {
                document.getElementById('dataManagementStatus').textContent = '';
            }, 3000);
        }
    }

    editUserName() {
        const currentName = this.storage.getItem('userName') || '';
        const nameField = document.getElementById('userNameField');
        nameField.value = currentName;
        
        document.getElementById('nameDisplay').style.display = 'none';
        document.getElementById('nameInput').style.display = 'block';
    }

    exportData() {
        try {
            // Get all data from localStorage
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
            }

            // Convert to JSON and create blob
            const jsonData = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.href = url;
            a.download = `arduino-chat-backup-${timestamp}.json`;
            
            // Trigger download
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            document.getElementById('dataManagementStatus').textContent = 'Data exported successfully!';
            setTimeout(() => {
                document.getElementById('dataManagementStatus').textContent = '';
            }, 3000);
        } catch (error) {
            console.error('Error exporting data:', error);
            document.getElementById('dataManagementStatus').textContent = `Error exporting data: ${error.message}`;
        }
    }
}

export const userService = new UserService(storageService);

