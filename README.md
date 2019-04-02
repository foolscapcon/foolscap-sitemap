# update python version
virtualenv --no-site-packages -p python3 .
(
  source bin/activate
  pip install scrapy
)
