/**
 * Special wrapper to handle multiple THREEx.HtmlMixer.Context for a single WebglRenderer
 * * especially useful when the webglrenderer is doing scissor/viewport like multiviewport editors
 */



var THREEx = THREEx || {}


THREEx.HtmlMultipleMixer	= {}

/**
 * Multiple context handled as one, thus able to handle multi viewport
 */
THREEx.HtmlMultipleMixer.Context	= function(){
	// store all context
	var contexts	= []
	this.contexts	= contexts

	// update all context
	this.update	= function(){
		contexts.forEach(function(context){
			context.update();
		})
	}
}

THREEx.HtmlMultipleMixer.Plane = function(multipleMixerContext, domElement, opts){
	opts		= opts	|| {}
	opts		= JSON.parse(JSON.stringify(opts))

	var contexts	= multipleMixerContext.contexts
	var planes	= []
	this.planes	= planes

	var mixerContext= contexts[0]
	var plane 	= new THREEx.HtmlMixer.Plane(mixerContext, domElement, opts);
	planes.push(plane)
	this.object3d	= plane.object3d

	opts.object3d	= this.object3d

	for(var i = 1; i < contexts.length; i++){
		var mixerContext= contexts[i]
		var cloneElement= domElement.cloneNode()
		var plane 	= new THREEx.HtmlMixer.Plane(mixerContext, cloneElement, opts);
		planes.push(plane)
	}

	// update all context
	this.update	= function(){
		contexts.forEach(function(context){
			context.update();
		})
	}
}
