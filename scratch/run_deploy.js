const { spawn } = require('child_process');

const proxyUrl = 'https://netlify-mcp.netlify.app/proxy/eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..AWTyvj9Up6-VeqnY.oDROEq8axSMRd1VOCHyQI-JdyFp-MQ7OJXrwz5p8704cwmW8b0eEGKASq71VNk_jG7H-GD-_I7fF2O8Xez4BKV-XWII2HAOgClZIxf4AiNAhaea6kZoizFGz0txz9BXRWRRxbcMewXCo9ZGW5Rahp6reNZ1XMXcALUjBkgXhLPP6_AKWlzzZxcdsTFoCW6xz7sBOeuqWRCCSJvy0FXqgaNl_2MsiLf61nAUaQIcWQlcye9Kpe6RW-EwF82StMgTQORP5Hqje5jGLyqWgfYNetPPgysYMvjDz29vTMQTbgmj-q2bmBFG97I5Ec_2kpUgNIShVUFol7xl97Fzz8ioO6XZh2DKhG_bct9A__hz_KnyYkNGzCm8AUFli12RzGLg6-72AyyNslCp05uHkXJjUMvlf3hg.LifKwVq0RxO_Q1XkSFQdow';

const child = spawn('cmd.exe', [
  '/c',
  'npx.cmd',
  '-y',
  '@netlify/mcp@latest',
  '--site-id',
  'd70a407b-ba94-40a1-a599-c253a9fe3cbb',
  '--proxy-path',
  proxyUrl
], {
  stdio: 'inherit'
});

child.on('close', (code) => {
  console.log('Deploy process finished with exit code:', code);
  process.exit(code);
});
