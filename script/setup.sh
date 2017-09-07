#!/bin/bash

echo "Setting up your development env..."

if [ "$(uname)" == "Darwin" ]; then
  echo "Ensuring brew is installed..."
  which -s brew
  if [[ $? != 0 ]] ; then
      # Install Homebrew
      ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  else
      brew update
  fi
  brew install node
  brew install postgresql
  brew services start postgresql

  echo "Dropping databases & re-creating them..."
  dropdb teachbot
  dropdb teachbot_test
  createdb teachbot
  createdb teachbot_test
  createuser teachbot
  psql postgres -c "ALTER USER teachbot WITH PASSWORD 'teachbot';"


  echo "Installing dependencies..."
  cd $(dirname $0)/..
  npm install
else
  echo "Non mac setup script not supported, please see the README.md for details on setting your machine."
  echo "Contributions welcome!!!"
fi

echo "Please edit your .env file with the keys from generated from following the Slack App creation guide in the README.md"
echo "You're good to go! Run npm run start or npm run start:dev to get started"

