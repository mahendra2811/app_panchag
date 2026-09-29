const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Native Gradle/CMake outputs are generated under node_modules during an Android
// build. Metro's fallback watcher otherwise tries to watch thousands of these
// transient directories and can hit Linux's inotify limit.
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : []),
  /[\\/]android[\\/](?:build|\.cxx|\.gradle)[\\/]/,
];

module.exports = config;
