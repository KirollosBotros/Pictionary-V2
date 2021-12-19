#!/bin/bash

cd frontend && yarn prettier --write .
cd ../backend && yarn prettier --write .
cd ..