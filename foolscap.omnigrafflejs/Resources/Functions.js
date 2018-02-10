console.log("omnigraffle.js");

function fitTextFontToShapeSize(g) {
	var startRect = g.geometry
	var startingSizing = g.autosizing
	if (startingSizing == TextAutosizing.Full || startingSizing == TextAutosizing.Vertical) {
		return // already autosizing, so already fitting
	}
	
	var lowest = 5 // min font size to use
	var highest = 100 // max font size to use

	g.autosizing = TextAutosizing.Vertical 
	while ((highest - lowest) > 1) {
		if ((g.geometry.width > startRect.width) || (g.geometry.height > startRect.height)) {
			highest = g.textSize
		} else {
			lowest = g.textSize
		}
		g.textSize = lowest + Math.floor((highest - lowest) / 2)
	}
	g.textSize = lowest
	g.autosizing = startingSizing
	g.geometry = startRect
}


