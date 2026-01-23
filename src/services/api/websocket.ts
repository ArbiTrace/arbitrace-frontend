import { io, Socket } from 'socket.io-client';

// Use environment variable or default to localhost:3001
const AGENT_URL = import.meta.env.VITE_AGENT_URL || 'https://agent-wkl4.onrender.com/';

class WebSocketService {
    private socket: Socket | null = null;
    private listeners: Map<string, Function[]> = new Map();

    constructor() {
        this.connect();
    }

    connect() {
        if (this.socket?.connected) return;

        console.log(`🔌 Connecting to Agent at ${AGENT_URL}...`);

        this.socket = io(AGENT_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('✅ Connected to Agent WebSocket');
            // Re-emit any listeners
            this.setupListeners();
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from Agent WebSocket');
        });

        this.socket.on('connect_error', (err) => {
            console.error('⚠️ WebSocket connection error:', err);
        });
    }

    // Tell the agent which wallet is connected
    connectWallet(address: string) {
        if (!this.socket) this.connect();

        console.log(`👤 Sending wallet address to Agent: ${address}`);
        this.socket?.emit('wallet:connected', { address });
    }

    disconnectWallet() {
        this.socket?.emit('wallet:disconnected');
    }

    // Generic emit
    emit(event: string, data?: any) {
        this.socket?.emit(event, data);
    }

    // Generic on
    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);

        this.socket?.on(event, (data) => callback(data));
    }

    // Remove listener
    off(event: string, callback?: Function) {
        if (callback) {
            const callbacks = this.listeners.get(event) || [];
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
                this.listeners.set(event, callbacks);
            }
            this.socket?.off(event, callback as any);
        } else {
            this.listeners.delete(event);
            this.socket?.off(event);
        }
    }

    private setupListeners() {
        // Re-attach all registered listeners to the new socket instance if needed
        this.listeners.forEach((callbacks, event) => {
            callbacks.forEach(cb => {
                // Remove old listener to avoid duplicates if re-connecting
                this.socket?.off(event);
                this.socket?.on(event, (data) => cb(data));
            });
        });
    }
}

export const webSocketService = new WebSocketService();
