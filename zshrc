# Path to your oh-my-zsh installation.
export ZSH=$HOME/".oh-my-zsh"

ZSH_THEME="dieter"

plugins=(git pip)

source $ZSH/oh-my-zsh.sh

export PATH=$PATH:/root/.pyenv/bin
export LC_ALL=C.UTF-8
export LANG=C.UTF-8
export PYTHONPYCACHEPREFIX=/tmp

alias l='ls -lahtr'
alias e="exit"
alias c="clear"
