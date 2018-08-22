'use strict';

/*
 * DeployError is an extension of Error. Most if not all errors emitted by ghost-deploy will be
 * a DeployError object. This should make it easier to determine the cause of an error when you
 * deploy
*/
class DeployError extends Error {
}

module.exports = DeployError;
