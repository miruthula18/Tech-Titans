const { spawn } = require('child_process');
const path = require('path');

console.log('===============================================================');
console.log('   DISASTER REUNITE: Find. Verify. Reunite.                    ');
console.log('   Launching Full-Stack Production Emergency Architecture...   ');
console.log('===============================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

// 1. Start Backend on port 5000
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
});

// 2. Start Frontend Vite Dev Server on port 5173
const frontend = spawn(npxCmd, ['vite', '--host', '0.0.0.0'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\nShutting down Disaster Reunite services...');
  backend.kill('SIGINT');
  frontend.kill('SIGINT');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

frontend.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});
