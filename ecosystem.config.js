module.exports = {
  apps: [{
    name: 'Tipapp',
    cwd: './build',
    script: 'index.js',
    env: {
      NODE_ENV: 'production',
      REACT_APP_ENV: 'production',
    },
  }],
}
