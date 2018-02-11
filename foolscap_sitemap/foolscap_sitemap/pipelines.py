# -*- coding: utf-8 -*-

import html

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html


class FoolscapSitemapPipeline(object):

    @classmethod
    def from_crawler(cls, crawler):
        return cls(crawler.settings)

    def __init__(self, settings):
        self.filename = "{0}_auto.js".format(settings['BOT_NAME'])

    def open_spider(self, spider):
        self.groups = {}


    def close_spider(self, spider):
        pass



    def process_item(self, item, spider):
        if not item['url_from'] in self.groups:
            self.groups[item['url_from']] = []
        self.groups[item['url_from']].append({
            "url": item['url_to'],
            "text": item['text']
        })
        return item
