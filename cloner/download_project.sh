#!/bin/bash

# $1: repository URL
# $2: destination directory
# $3: desired commit to checkout
git_commit(){
	git clone $1 $2
	cd $2
	git checkout $3
}

# $1: repository URL
# $2: destination directory
# $3: desired tag to checkout
git_tag(){
	git clone $1 $2
	cd $2
	git checkout tags/$3
}

# $1: repository URL
# $2: destination directory
download_archive(){
	curl $1 -O $2/archive.zip
	cd $2
	unzip $2
	rm $2
}


case "$1" in
	"commit")
    	git_commit $2 $3 $4
        ;;         
    "tag")
        git_tag $2 $3 $4
        ;;
esac