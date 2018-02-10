#!/bin/sh
fns=$(python -c "import urllib;print urllib.quote(open('omnigraffle.js', 'r').read())") 
script=$(python -c "import urllib;print urllib.quote(open('foolscap_sitemap_auto.js', 'r').read())")
echo "opening script"
echo "omnigraffle://omnijs-run?scripr=console%2Elog%28%22loaded%22%29%3B%20console.log${fns}${script}" | wc 
open "omnigraffle://localhost/omnijs-run?script=console%2Elog%28%22pretest%22%29%3B"
open "omnigraffle://omnijs-run?scripr=console%2Elog%28%22loaded%22%29%3B%20console.log${fns}${script}"

