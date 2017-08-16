#!/bin/bash

VERSION="v1.2.1"
echo "Publishing version $VERSION..."

git commit -m "Publish bower $VERSION"
git tag "$VERSION"

git push origin --tags
