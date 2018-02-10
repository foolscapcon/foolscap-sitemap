# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from foolscap_sitemap.items import FoolscapSitemapItem

class FoolscapSpider(CrawlSpider):
    name = 'foolscap'
    allowed_domains = ['www.foolscap.org']
    start_urls = ['http://www.foolscap.org/']

    rules = (
        Rule(LinkExtractor(canonicalize=True, unique=True),
             follow=True, callback='parse_items'),
        )

    def parse_items(self, response):
        for link in LinkExtractor(allow=self.allowed_domains, deny=()).extract_links(response):
            item = FoolscapSitemapItem()
            item['url_from'] = response.url
            item['url_to'] = link.url
            item['text'] = link.text
            yield item

