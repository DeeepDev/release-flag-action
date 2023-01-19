#!/bin/bash

unzip_d () {
  zipfile="$1"
  zipdir=${1%.zip}
  unzip -d "$zipdir" "$zipfile"
}

unzip_d assets/fonts/*.zip
cp -r assets/fonts/* /usr/share/fonts/
fc-cache -fv
