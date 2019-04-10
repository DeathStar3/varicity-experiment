#!/bin/bash

# $1: repository URL
# $2: current project directory path
download_project(){
    git clone $1 $2
}

# $1: project directory
# ${@:2}: desired commits to checkout
checkout_commits(){
	for i in "${@:2}"; do
        git --git-dir=$1/.git --work-tree=$1 checkout ${i}
        if [ ! -d $1-${i}/ ]; then
            mkdir -p $1-${i}/
            cp -r $1/* $1-${i}/
        fi
    done
}

# $1: project directory
# ${@:2}: desired tags to checkout
checkout_tags(){
	for i in "${@:2}"; do
        git --git-dir=$1/.git --work-tree=$1 checkout tags/${i}
        if [ ! -d $1-${i}/ ]; then
            mkdir -p $1-${i}/
            cp -r $1/* $1-${i}/
        fi
    done
}

# $1: current project directory path
delete_project(){
    rm -rf $1
}

case "$1" in
	"download")
    	download_project ${@:2}
        ;;
	"commit")
    	checkout_commits ${@:2}
        ;;
    "tag")
        checkout_tags ${@:2}
        ;;
    "delete")
        delete_project ${@:2}
        ;;
esac