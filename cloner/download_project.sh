#!/bin/bash

# $1: repository URL
# $2: destination directory
# $3: desired commit to checkout
git_commit(){
	git clone $1 $2
	cd $2
	for i in "${@:3}"; do
        git checkout $i
        mkdir ../$2-$i/
        cp -r * ../$2-$i/
    done
}

# $1: repository URL
# $2: destination directory
# $3: desired tag to checkout
git_tag(){
	git clone $1 $2
	cd $2
	for i in "${@:3}"; do
        git checkout tags/$i
        mkdir ../$2-$i/
        cp -r * ../$2-$i/
    done
}

case "$1" in
	"commit")
    	git_commit $2 $3 $4
        ;;
    "tag")
        git_tag $2 $3 $4
        ;;
esac