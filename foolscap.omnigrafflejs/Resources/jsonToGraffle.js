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
                cnvs = doc.windows[0].selection.canvas;
                cnvs.canvasSizingMode = CanvasSizingMode.Fit;
                cnvs.name = "Foolscap Website";
                for (let link of json) {
                    var url_from = link['url_from'];
                    var url_to = link['url_to'];
                    var text = link['text'];
                    if (!text || 0 === text.length) {
                        text = " ";
                    }
                    console.log(JSON.stringify(link));
                    console.log( link + " " + text + " " + url_from + " " + url_to + " " );
                    break;
                }
                
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
