// services/bluetooth.js
import { BLE_CONFIG } from '../config/bluetooth.js';

class BluetoothService {
    constructor() {
        this.device = null;
        this.switchCharacteristic = null;
        this.textCharacteristic = null;
    }

    async connect() {
        if (this.device && this.device.gatt.connected) {
            await this.device.gatt.disconnect();
            this.device = null;
            return false;
        }

        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [BLE_CONFIG.serviceUuid] }]
            });
            
            this.device.addEventListener('gattserverdisconnected', () => {
                console.log('Device disconnected');
                return false;
            });

            const server = await this.device.gatt.connect();
            const service = await server.getPrimaryService(BLE_CONFIG.serviceUuid);
            this.switchCharacteristic = await service.getCharacteristic(BLE_CONFIG.switchCharUuid);
            this.textCharacteristic = await service.getCharacteristic(BLE_CONFIG.textCharUuid);
            
            return true;
        } catch (error) {
            console.error('Bluetooth Error:', error);
            throw error;
        }
    }

    async writeSwitch(value) {
        if (!this.switchCharacteristic) return;
        try {
            await this.switchCharacteristic.writeValue(Uint8Array.from([value]));
        } catch (error) {
            console.error('Error writing value:', error);
            throw error;
        }
    }

    async sendText(text) {
        if (!this.textCharacteristic) return;
        try {
            const encoder = new TextEncoder();
            await this.textCharacteristic.writeValue(encoder.encode(text));
        } catch (error) {
            console.error('Error sending text:', error);
            throw error;
        }
    }

    isConnected() {
        return this.device && this.device.gatt.connected;
    }
}

export const bluetoothService = new BluetoothService();

