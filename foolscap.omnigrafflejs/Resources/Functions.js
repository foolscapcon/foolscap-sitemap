var _ = function() {
    console.log("foolscap Functions library");
    var Functions = new PlugIn.Library(new Version("1.0"));

    Functions.fitTextFontToShapeSize = function(g) {
	var startRect = g.geometry;
	var startingSizing = g.autosizing;
	if (startingSizing == TextAutosizing.Full || startingSizing == TextAutosizing.Vertical) {
	    return; // already autosizing, so already fitting
	}
	
	var lowest = 5; // min font size to use
	var highest = 100; // max font size to use
        
	g.autosizing = TextAutosizing.Vertical; 
	while ((highest - lowest) > 1) {
	    if ((g.geometry.width > startRect.width) || (g.geometry.height > startRect.height)) {
		highest = g.textSize;
	    } else {
		lowest = g.textSize;
	    }
	    g.textSize = lowest + Math.floor((highest - lowest) / 2);
	}
	g.textSize = lowest;
	g.autosizing = startingSizing;
	g.geometry = startRect;
    };

    Functions.readDataFile = function(dataCallback) {
	// create a version object
	var aVersion = new Version("1.0");
	// look up the plugin
	var plugin = PlugIn.find("org.foolscap.OmniGraffle",aVersion);
	// get the url for the text file inside this plugin
	var url = plugin.resourceNamed("foolscap.json");
	// read the file
	url.fetch(function (data){
            console.log("read data file " + url + " " + data.length);
	    var dataString = data.toString();
            var json = JSON.parse(dataString);
            console.log( typeof json );
	    dataCallback(json);
	});
    };

    Functions.handlers = function(){
	return "\n// Functions ©2017 Greg//omni forums\n• fitTextFontToShapeSize(g)";
    };

    Functions.documentation = function() {
        return "";
    };
    

    console.log(Functions);
    return Functions;
}();
_;

