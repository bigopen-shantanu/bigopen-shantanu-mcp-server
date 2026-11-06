const mc = require('minecraft-protocol');

const client = mc.createClient({
  host: 'localhost',
  port: 25565,
  username: 'server'
});

client.on('chat', (json, meta) => {
  console.log(json);
});

client.on('spawn', () => {
  client.write('chat', { message: 'Welcome to the server!' });
});

client.on('disconnect', (packet) => {
  console.log('Disconnected:', packet.reason);
});

client.on('error', (err) => {
  console.error(err);
});

client.on('end', () => {
  console.log('Connection ended');
});

client.connect();