const { spawn, exec } = require('child_process');

// Start the serve server
const server = spawn('npx', ['serve', '.', '--listen', '3000', '--no-clipboard'], {
  stdio: 'inherit',
  shell: true
});

// Open the default browser after 2 seconds (give server time to start)
setTimeout(function () {
  // Works on Windows (start), Mac (open), Linux (xdg-open)
  var cmd = process.platform === 'win32'  ? 'start http://localhost:3000'
           : process.platform === 'darwin' ? 'open http://localhost:3000'
           : 'xdg-open http://localhost:3000';
  exec(cmd);
  console.log('\n✓ Opening http://localhost:3000 in your browser...\n');
}, 2000);

// Forward kill signals to the child process
process.on('SIGINT',  function () { server.kill(); process.exit(); });
process.on('SIGTERM', function () { server.kill(); process.exit(); });
