#! /bin/bash

yarn add ghost-cli --silent --no-emoji --no-progress --non-interactive
node_modules/.bin/ghost install local -d instance --db=sqlite3 --no-prompt
node_modules/.bin/ghost stop -d instance --no-prompt
# remove stdout as a transport
sed -i 's/    "file",/    "file"/' instance/config.development.json
sed -i 's/    "stdout"//' instance/config.development.json
# HACK @todo: fix - allow PUT requests to v2 themes api so the uploaded theme can be activated
sed -i "s/themes\: \['POST'\],/themes\: ['POST', 'PUT'],/" instance/current/core/server/web/api/v2/admin/middleware.js
database__connection__filename="$(pwd)/test/fixtures/ghost-local.db" node instance/current/index.js &
