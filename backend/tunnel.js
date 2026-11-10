const localtunnel = require('localtunnel');

// Keep event loop active indefinitely
setInterval(() => {}, 1000 * 60 * 60);

async function startTunnel() {
  try {
    const tunnel = await localtunnel({ port: 5173 });
    console.log('TUNNEL_URL:' + tunnel.url);

    tunnel.on('close', () => {
      console.log('Tunnel closed. Reconnecting in 3 seconds...');
      setTimeout(startTunnel, 3000);
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
      setTimeout(startTunnel, 3000);
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err.message);
    setTimeout(startTunnel, 3000);
  }
}

startTunnel();
