// config/api.js
export const API_BASE = '/friends';
export const API_ENDPOINTS = {
    CREATE_CONNECTION: `${API_BASE}/connections`,
    GET_CONNECTION: (linkId) => `${API_BASE}/connections/link/${linkId}`,
    JOIN_CONNECTION: (linkId) => `${API_BASE}/connections/link/${linkId}/join`,
    SEND_MESSAGE: (connectionId) => `${API_BASE}/connections/${connectionId}/messages`,
    GET_NOTIFICATIONS: (playerId) => `${API_BASE}/players/${playerId}/notifications`,
    ACK_NOTIFICATIONS: (playerId) => `${API_BASE}/players/${playerId}/notifications/ack`
};
