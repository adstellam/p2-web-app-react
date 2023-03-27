FROM node:16.18.1-buster-slim

RUN apt-get update && apt-get install -y git zsh tmux vim wget apt-utils iputils-ping tree

RUN yes | sh -c "$(wget --quiet https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
COPY zshrc /root/.zshrc

RUN yarn global add typescript expo-cli react-native

# Upgrade npm, this was causing this error:
# Error: EACCES: permission denied, mkdir '/root/.config/devcert'
RUN npm install -g npm@9.2.0

WORKDIR /opt/stout/ui

COPY yarn.lock .
COPY package.json .
RUN yarn install

COPY . .
