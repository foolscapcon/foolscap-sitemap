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
        with open(self.filename, 'w') as output:
            i = "    "
            output.write("""var _ = function() {
            var action = new PlugIn.Action(function(selection){
            var fitTextFontToShapeSize = this.Functions.fitTextFontToShapeSize;
            Document.makeNewAndShow(function(doc){
            cnvs = doc.windows[0].selection.canvas;
            cnvs.canvasSizingMode = CanvasSizingMode.Fit;
            cnvs.name = "Foolscap Website";\n\n""")

            output.write("var groups = {};\n")
            output.write("var all_items = [];\n")
            output.write("var group_items = [];\n")
            output.write("var item;\n")
            for group_url, items in self.groups.items():
                output.write("group_items = [];\n")
                for index, link in enumerate(items):
                    to_url = link['url']
                    text = link['text']
                    output.write("item = cnvs.newShape();\n")
                    output.write("console.log(typeof item);\n")
                    output.write("console.log(item);\n")
                    output.write("item.shape = 'RoundRect';\n")
                    output.write("item.text = '{0}';\n".format(html.escape(text.strip())))
                    output.write("item.to_url = '{0}';\n".format(to_url))

                    output.write("fitTextFontToShapeSize(item);\n")
                    output.write("all_items.push(item);\n")
                    output.write("console.log(item.text);\n")
                    output.write("console.log(typeof all_items[0]);\n")
                    output.write("console.log(all_items[0]);\n")
                    output.write("group_items.push(item);\n")
                    output.write("\n")

                output.write("groups[\"{group_url}\"] = new Group(group_items);\n".format(**locals()))
                output.write("console.log(\"group {group_url}\");\n".format(**locals()))
                break
            output.write("\n")
            output.write("console.log(groups);\n")
            output.write("for (var from_item in all_items) {\n")
            output.write("    var url = from_item.to_url;\n")
            output.write("    var to_group = groups[from_item.to_url];\n")
            output.write("    console.log(url);\n")
            output.write("    console.log(typeof from_item);\n")
            output.write("    console.log(from_item);\n")
            output.write("    console.log(typeof to_group);\n")
            output.write("    console.log(to_group);\n")
            output.write("    cnvs.connect(from_item, to_group);\n")
            output.write("}\n")
            output.write("});\n")
            output.write("});//Action\n")
            output.write("return action;")
            output.write("""}();\n_;""")



    def process_item(self, item, spider):
        if not item['url_from'] in self.groups:
            self.groups[item['url_from']] = []
        self.groups[item['url_from']].append( {
            "url": item['url_to'],
            "text": item['text']
        })
        return item
