'use strict';

let shouldLog = true;

/* eslint-disable max-statements-per-line,brace-style */
module.exports.log = (...args) => shouldLog && console.log(...args);
module.exports.warn = (...args) => shouldLog && console.warn(...args);
module.exports.mute = () => {shouldLog = false;};
module.exports.unmute = () => {shouldLog = true;};
/* eslint-enable max-statements-per-line,brace-style */
