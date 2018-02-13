source ../bin/activate
if [ -f foolscap.json ]; then
    rm foolscap.json
fi
scrapy crawl foolscap -t json -o foolscap.json -L ${1:-WARN}
