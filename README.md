# Minecraft Protocol Client

A Node.js Minecraft protocol client built with [node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol). This client can connect to Minecraft servers and handle various protocol events.

## Features

- Connect to Minecraft servers (Java Edition)
- Handle chat messages
- Automatic reconnection with retry logic
- Graceful shutdown handling
- Environment-based configuration
- Comprehensive error handling

## Prerequisites

- Node.js 16.x or higher
- A Minecraft server to connect to

## Installation

```bash
npm install
```

## Configuration

The client can be configured using environment variables or defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `MC_HOST` | `localhost` | Minecraft server hostname |
| `MC_PORT` | `25565` | Minecraft server port |
| `MC_USERNAME` | `server` | Minecraft username |
| `MC_PASSWORD` | `undefined` | Minecraft password (for premium accounts) |
| `MC_VERSION` | `undefined` | Minecraft version (auto-detected if not specified) |

## Usage

### Starting the Client

```bash
npm start
```

### Using Environment Variables

```bash
# Start with custom configuration
MC_HOST=play.example.com MC_PORT=25565 MC_USERNAME=MyPlayer npm start

# Or use a .env file (create .env in project root)
echo "MC_HOST=play.example.com" > .env
echo "MC_PORT=25565" >> .env
echo "MC_USERNAME=MyPlayer" >> .env
npm start
```

### Configuration Examples

#### For Premium (Paid) Accounts
```bash
MC_USERNAME=your@email.com MC_PASSWORD=yourpassword npm start
```

#### For Custom Server
```bash
MC_HOST=mc.example.com MC_PORT=25565 npm start
```

## Event Handling

The client handles the following events:

- `chat` - Receives chat messages from the server
- `spawn` - Player spawns in the world
- `login` - Successfully logs into the server
- `status` - Server status information (player count, description)
- `disconnect` - Connection to server was lost
- `end` - Connection ended gracefully
- `error` - Connection errors

## Automatic Features

- **Auto-reconnect**: Automatically attempts to reconnect up to 3 times with 5-second delays
- **Graceful shutdown**: Handles `SIGINT` and `SIGTERM` for clean shutdown
- **Error recovery**: Distinguishes between authentication errors (no retry) and connection errors (retry)

## Project Structure

```
.
├── package.json          # Project dependencies and scripts
├── server.js            # Main client code
├── README.md            # This file
└── .gitignore           # Git ignore rules
```

## Development

### Running Tests

```bash
npm test
```

### Updating Dependencies

```bash
npm update
```

### Security Audit

```bash
npm audit
npm audit fix
```

## Troubleshooting

### Connection Issues
- Ensure the Minecraft server is running and accessible
- Check that the correct port is configured (default: 25565)
- Verify your username is correct

### Authentication Errors
- For premium accounts, ensure `MC_PASSWORD` is set
- For non-premium accounts, use a username that doesn't require authentication

### Version Mismatch
- Specify the correct Minecraft version using `MC_VERSION` environment variable
- Example: `MC_VERSION=1.19.4`

## License

MIT