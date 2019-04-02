# -*- coding: utf-8 -*-
import scrapy
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.linkextractors.lxmlhtml import LxmlLinkExtractor
from foolscap_sitemap.linkextractors.part import PartialLinkExtractor
from foolscap_sitemap.items import FoolscapSitemapItem
from scrapy.utils.response import get_base_url

import logging
import os.path as path

class FoolscapSpider(CrawlSpider):
    name = 'foolscap'
    allowed_domains = ['www.foolscap.org']
    start_urls = ['http://www.foolscap.org/']

    rules = (
        Rule(PartialLinkExtractor(canonicalize=True, unique=True),
             follow=True, callback='parse_items'),
        )

    def __init__(self, *a, **kw):
        super(FoolscapSpider, self).__init__(*a, **kw)
        self.section_names = ['header', 'footer', 'nav']
        self.sections = {}


    def parse_items(self, response):
        urlparts = response.url.split("/")
        filename = urlparts[-1] if urlparts[-1] else urlparts[-2]
        filename = filename + '.html'
        logging.info(response.url)
        logging.info(filename)
        with open(path.join('site', filename), 'wb') as f:
            f.write(response.body)
            return        
        # seperate header, footer
        for section in self.section_names:
            # use lxml xpath
            selector = response.selector.root.find(".//{0}".format(section))
            if selector is not None and not section in self.sections:
                self.sections[section] = True
                logging.info("foolscap: found section {section}".format(**locals()))
                yield from self.parse_links(selector, response, section)
            elif selector is not None:
                logging.info("foolscap: section {section} already processed.".format(**locals()))
            else:
                logging.info("foolscap: section {section} not there.".format(**locals()))
            if selector is not None:
                item = FoolscapSitemapItem()
                item['url_from'] = response.url
                item['url_to'] = section
                item['text'] = section
                yield item

        tree = response.selector.root.find('.//main')
        if tree is None:
            logging.warn("foolscap: no section main {response.url}".format(**locals()))
            tree = response.selector
        else:
            logging.info("foolscap: found section main {tree} {response.url}".format(**locals()))
        yield from self.parse_links(tree, response)

    def parse_links(self, selector, response, section=None):
        le = PartialLinkExtractor(allow=self.allowed_domains, deny=())
        base_url = get_base_url(response)
        for link in le._extract_links(selector, response.url, response.encoding, base_url):
            item = FoolscapSitemapItem()

            item['url_from'] = section or response.url
            item['url_to'] = link.url
            if not link.text:
                path = '//a[contains(@href, "{0}")]/@class'.format(link.url)
                item['text'] = " ".join(response.selector.xpath(path).extract()).strip()
            else:
                item['text'] = link.text.strip()
            yield item
