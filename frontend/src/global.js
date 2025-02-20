// Polyfill for simple-peer
window.global = window;
window.process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick')
};
window.Buffer = require('buffer').Buffer;