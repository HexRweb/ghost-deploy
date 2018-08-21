#! /bin/bash

yarn add --silent ghost-cli
node_modules/.bin/ghost install local -d instance --db=sqlite3
node_modules/.bin/ghost stop -d instance
database__connection__filename="$(pwd)/test/fixtures/ghost-local.db" node instance/current/index.js &
