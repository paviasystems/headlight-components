#!/bin/bash

pushd ./NestedSortedMap
npm update
browserify ./index.js > ../dist/main.js
popd

echo "Built bower component in ./dist/main.js"
