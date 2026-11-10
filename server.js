const mc = require('minecraft-protocol');

/**
 * Minecraft Protocol Client
 * A Node.js client for connecting to Minecraft servers
 */

// Configuration
const config = {
  host: process.env.MC_HOST || 'localhost',
  port: parseInt(process.env.MC_PORT) || 25565,
  username: process.env.MC_USERNAME || 'server',
  password: process.env.MC_PASSWORD || undefined,
  version: process.env.MC_VERSION || undefined,
  connectTimeout: 10000,
  maxRetries: 3,
  retryDelay: 5000
};

let client = null;
let connectionAttempts = 0;

/**
 * Create a new Minecraft client
 */
function createClient() {
  const options = {
    host: config.host,
    port: config.port,
    username: config.username
  };

  if (config.password) {
    options.password = config.password;
  }

  if (config.version) {
    options.version = config.version;
  }

  return mc.createClient(options);
}

/**
 * Handle client connection
 */
function connect() {
  console.log(`\n[${new Date().toISOString()}] Attempting to connect to ${config.host}:${config.port}`);
  
  try {
    client = createClient();
    connectionAttempts++;

    setupEventListeners();
    client.connect();

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Failed to create client:`, error.message);
    handleConnectionFailure();
  }
}

/**
 * Set up event listeners for the client
 */
function setupEventListeners() {
  // Chat messages
  client.on('chat', (json, meta) => {
    try {
      const message = typeof json === 'string' ? json : json.toString();
      console.log(`[Chat] ${message}`);
    } catch (error) {
      console.error('[Chat] Error processing message:', error.message);
    }
  });

  // Spawn event
  client.on('spawn', () => {
    console.log(`[${new Date().toISOString()}] Successfully spawned on server`);
    client.write('chat', { message: 'Welcome to the server!' });
  });

  // Disconnect event
  client.on('disconnect', (packet) => {
    console.log(`[${new Date().toISOString()}] Disconnected: ${packet.reason || 'Unknown reason'}`);
    handleConnectionFailure();
  });

  // Error event
  client.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Connection error:`, err.message);
    
    // Don't retry on authentication errors
    if (err.message.includes('auth') || err.message.includes('session') || err.message.includes('login')) {
      console.error('[Error] Authentication or login failed. Stopping retries.');
      return;
    }
    
    handleConnectionFailure();
  });

  // End event (clean disconnection)
  client.on('end', () => {
    console.log(`[${new Date().toISOString()}] Connection ended gracefully`);
    handleConnectionFailure();
  });

  // Login success
  client.on('login', () => {
    console.log(`[${new Date().toISOString()}] Successfully logged in as ${config.username}`);
    connectionAttempts = 0; // Reset counter on successful connection
  });

  // Status response (for server ping)
  client.on('status', (status) => {
    console.log(`[${new Date().toISOString()}] Server status received`);
    if (status.description) {
      console.log(`[Status] Server description: ${status.description}`);
    }
    if (status.players) {
      console.log(`[Status] Players online: ${status.players.online}/${status.players.max}`);
    }
  });
}

/**
 * Handle connection failures with retry logic
 */
function handleConnectionFailure() {
  // Clean up client reference
  if (client) {
    client.end();
    client = null;
  }

  // Stop after max retries
  if (connectionAttempts >= config.maxRetries) {
    console.error(`[${new Date().toISOString()}] Max connection attempts (${config.maxRetries}) reached. Exiting.`);
    process.exit(1);
  }

  // Retry after delay
  console.log(`[${new Date().toISOString()}] Retrying connection in ${config.retryDelay / 1000} seconds...`);
  setTimeout(connect, config.retryDelay);
}

/**
 * Graceful shutdown handler
 */
function gracefulShutdown(signal) {
  console.log(`\n[${new Date().toISOString()}] Received ${signal}. Shutting down gracefully...`);
  
  if (client) {
    client.end();
    client = null;
  }
  
  process.exit(0);
}

// Signal handlers for graceful shutdown
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] Uncaught exception:`, err.message);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] Unhandled rejection:`, reason);
});

// Start the client
console.log('='.repeat(50));
console.log('Minecraft Protocol Client');
console.log('='.repeat(50));
console.log(`Config: ${config.host}:${config.port} as ${config.username}`);
console.log('='.repeat(50));

connect();