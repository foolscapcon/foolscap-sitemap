// -*- esversion: 6; -*-


var _ = function(){
    // used in callbacks, so grab names
    var fitTextFontToShapeSize;
    var urlToName;

    var action = new PlugIn.Action(function(selection) {
        console.log("jsonToGraffle");
        fitTextFontToShapeSize = this.Functions.fitTextFontToShapeSize;
        urlToName = this.Functions.urlToName;
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
                    // if ( !(url in layers) ) {
                    //     layers[url] = canvas.newLayer();
                    //     layers[url].name = urlToName(url);

                    // }
                    layer = layers[url];
                    //item = layer.newShape();
                    item = canvas.newShape();
                    item.shape = 'RoundRect';
                    item.text = text;
                    item.name = text;
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
                    canvas.layoutGraphics(items);
                    let group = new Group(items);
                    group.name = urlToName(group_url);
                    group.setUserData('url', group_url);
                    groups[group_url] = group;
                }

                var subgraphs = [];
                // create links, group with originating group
                for (let group_url in grouped_items) {
                    let group = groups[group_url];
                    var lineAndGroup = [];                    
                    lineAndGroup.push(group);
                    for (let item of grouped_items[group_url]) {
                        let url = item.userData['url'];
                        let url_to = item.userData['url_to'];
                        // remove anchor
                        if (url_to.includes('#')) {
                            url_to = url_to.split('#')[0];
                        }
                        let to_group = groups[url_to];
                        if( to_group ) {
                            let line = canvas.connect(item, to_group);
                            lineAndGroup.push(line);
                        } else {
                            console.log("failed to look up " + url_to + " for " + url);
                        }

                        // layout
                        item.geometry.origin = new Point(x, y);
                        x = x + dx;
                        
                    }
                    var subgraph = new Subgraph(lineAndGroup);
                    subgraph.name = group.name;
                    subgraphs.push(subgraph);
                                     
                    
                    y = y + dy;
                    
                }
                canvas.layoutGraphics(subgraphs);

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
