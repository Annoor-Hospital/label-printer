#!/bin/bash

remoteip="${remoteip:-10.10.10.245}"
tgt=label-printer
echo $remoteip
# Check if route exists to remote host
if ! nc -w 3 -z $remoteip 22 2>/dev/null; then
        echo "No route to $remoteip or ssh port not open"
        exit 1
fi

# Remove existing compressed file
if [ -f "${tgt}.tar.gz" ]; then
        rm "${tgt}.tar.gz"
fi

# Verify command argument
if [ $# -eq 1 ] ; then
        if [ "$1" = "nobuild" ]; then
            nobuild=1
        else
            echo "Usage: $0 [nobuild]"
            exit 1
        fi
fi

# Build bahmniapps
echo $nobuild
if [ -z ${nobuild} ]; then
    yarn
    yarn build
    if [ $? -ne 0 ]; then
        exit 1
    fi
fi

# Compress and send to remote host
tar -cvzf "${tgt}.tar.gz" build
sftp "root@${remoteip}" <<< $'put '"$tgt"'.tar.gz'

# Log in to remote host and extract the compressed file into /var/www/html
ssh root@${remoteip} 'bash -s' << EOF
mv ${tgt}.tar.gz /var/www/html/
cd /var/www/html/
tar -xvzf ${tgt}.tar.gz
rm -rf $tgt
mv build $tgt
chown -R bahmni:bahmni $tgt
rm ${tgt}.tar.gz
EOF
