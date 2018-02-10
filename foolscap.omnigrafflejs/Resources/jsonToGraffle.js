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
