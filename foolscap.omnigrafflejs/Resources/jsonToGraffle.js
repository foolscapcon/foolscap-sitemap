// -*- esversion: 6; -*-

/*
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
*/

var _ = function(){
    var fitTextFontToShapeSize;

    var action = new PlugIn.Action(function(selection) {
        console.log("jsonToGraffle");
        fitTextFontToShapeSize = this.Functions.fitTextFontToShapeSize;
        this.Functions.readDataFile(function(json){
            console.log("readDataFile callback");
            Document.makeNewAndShow(function(doc){
                canvas = doc.windows[0].selection.canvas;
                canvas.canvasSizingMode = CanvasSizingMode.Fit;
                canvas.layoutInfo.automaticLayout = false;
                canvas.name = "Foolscap Website";
                grouped_items = {};
                groups = {};
                layers = {};
                // create items
                for (let link of json) {
                    var url = link['url_from'];
                    var url_to = link['url_to'];
                    var text = link['text'];
                    if (!text || 0 === text.length) {
                        text = " ";
                    }
                    //console.log(JSON.stringify(link));

                    if ( !(url in grouped_items) ) {
                        grouped_items[url] = [];
                    }
                    if ( !(url in layers) ) {
                        layers[url] = canvas.newLayer();
                        layer.name = url;
                    }
                    layer = layers[url];
                    item = layer.newShape();
                    item.shape = 'RoundRect';
                    item.text = text;
                    item.name = text
                    item.geometry = new Rect(0, 0, 100, 50);

                    fitTextFontToShapeSize(item);
                    item.setUserData('url', url);
                    item.setUserData('url_to', url_to);
                    grouped_items[url].push(item);

                }
                var x = 0;
                var y = 0;
                var dx = 102;
                var dy = 52;
                // create layers and groups
                for (let group_url in grouped_items) {
                    let items = grouped_items[group_url];
                    let group = new Group(items);
                    group.setUserData('url', group_url);
                    groups[group_url] = group;



                }



                //console.log(groups);
                // create links
                for (let group_url in grouped_items) {
                    for (let item of grouped_items[group_url]) {
                        let url = item.userData['url'];
                        let url_to = item.userData['url_to'];
                        // remove anchor
                        if (url_to.includes('#')) {
                            url_to = url_to.split('#')[0];
                        }
                        let to_group = groups[url_to];
                        if( to_group ) {
                            canvas.connect(item, to_group);
                        } else {
                            console.log("failed to look up " + url_to + " for " + url);
                        }

                        // layout
                        item.geometry.origin = new Point(x, y);
                        x = x + dx;

                    }
                    y = y + dy;
                    
                }
                //canvas.layout();

            }); //Document.makeNewAndShow
        }); //readDataFile
    }); // PlugIn.Action

    // routine determines if menu item is enabled
    action.validate = function(selection){
        return true;
    };

    return action;
}(); // top level function
_;
