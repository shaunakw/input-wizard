#!/bin/sh

git checkout release
git merge main
git push
git checkout main