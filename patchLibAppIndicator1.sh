#!/usr/bin/env bash
# Felix Albrigtsen 2022
# Fix .deb files that depend on libappindicator1, use the drop-in replacement libayatana-appindicator1
WORKDIR="tmpdir"

if [ $# -ne 1 ] || [[ ! -f "$1" ]] ; then
  echo "Please supply a valid filename."
  echo "Usage: './patchLibAppIndicator1.sh yourpackage.deb'"
  exit 1
fi
if [[ -d "$WORKDIR" ]] ; then
  echo "The folder at $WORKDIR already exists."
  exit 1
fi

if [[ -d "DEBIAN" ]] ; then
  echo "The folder at ./DEBIAN already exists."
  exit 1
fi

debfile="$1"
echo "Extracting $debfile"
dpkg-deb -x "$debfile" tmpdir
echo "Extracting dependency control files"
dpkg-deb --control "$debfile"

mv "./DEBIAN/" "$WORKDIR"
if ! grep -Fq "libappindicator1" "$WORKDIR/DEBIAN/control"; then
  echo "Error: $debfile does not depend on libappindicator1."
  rm -rf "$WORKDIR"
  exit 1
fi

echo "Patching package file"
newfile="${debfile%.*}-patched.deb"
sed -i 's/libappindicator1/libayatana-appindicator1/g' "$WORKDIR/DEBIAN/control"
echo "Repacking patched package"
dpkg -b "$WORKDIR" "$newfile"
echo "Cleaning up"
rm -rf "$WORKDIR"
echo "$debfile has been patched and repackaged into $newfile"
