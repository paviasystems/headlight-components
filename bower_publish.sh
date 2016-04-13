#!/bin/bash

cd NestedSortedMap
npm install
browserify index.js -o ../dist/main.js

cd ..
git commit -am "bower publish"
git tag v1.2.0
git push origin v1.2.0

#bower register headlight-components https://github.com/paviasystems/headlight-components.git
