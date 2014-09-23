var THREEx = THREEx || {}


THREEx.HtmlMixer	= {}

/**
 * define a context for THREEx.HtmlMixer
 * 
 * @param  {THREE.WebGLRenderer|THREE.CanvasRenderer} frontRenderer the renderer in front
 * @param  {THREE.Scene} scene the original scene
 * @param  {THREE.Camera} camera the camera used for the last view
 */
THREEx.HtmlMixer.Context	= function(frontRenderer, scene, camera){
	// update functions
	var updateFcts	= []
	this.update	= function(delta, now){
		updateFcts.forEach(function(updateFct){
			updateFct(delta, now)
		})
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////

	var rendererCSS	= new THREE.CSS3DRenderer()
	// TODO to make generic
	rendererCSS.setSize( window.innerWidth, window.innerHeight )
	rendererCSS.domElement.style.position	= 'absolute'
	rendererCSS.domElement.style.top	= 0
	rendererCSS.domElement.style.margin	= 0
	rendererCSS.domElement.style.padding	= 0
	rendererCSS.domElement.style.zIndex	= -1
	document.body.appendChild( rendererCSS.domElement )
	this.rendererCSS= rendererCSS

	if( frontRenderer.domElement.parentElement ){
		frontRenderer.domElement.parentElement.removeChild(frontRenderer.domElement)
	}
	rendererCSS.domElement.appendChild( frontRenderer.domElement )
	this.frontRenderer	= frontRenderer
	frontRenderer.domElement.style.position	= 'absolute'
	frontRenderer.domElement.style.top	= 0
	frontRenderer.domElement.style.margin	= 0
	frontRenderer.domElement.style.padding	= 0
	frontRenderer.domElement.style.pointerEvents	= 'none'

	// build cssCamera
	var cssFactor	= 1000
	this.cssFactor	= cssFactor
	var cssCamera	= new THREE.PerspectiveCamera(camera.fov, camera.aspect, camera.near*cssFactor, camera.far*cssFactor);

	updateFcts.push(function(delta, now){
		cssCamera.quaternion.copy(camera.quaternion)

		cssCamera.position
			.copy(camera.position)
			.multiplyScalar(cssFactor)
	})


	// create a new scene to hold CSS
	var cssScene = new THREE.Scene();
	this.cssScene= cssScene
	
	updateFcts.push(function(delta, now){
		rendererCSS.render(cssScene, cssCamera)
	})
}

/**
 * define plane in THREEx.HtmlMixer
 * 
 * @param  {THREEx.HtmlMixer.Context} mixerContext context
 * @param  {HTMLElement} domElement   the dom element to mix
 * @param  {Object} opts         options to set
 */
THREEx.HtmlMixer.Plane = function(mixerContext, domElement, opts) {	
	opts		= opts	|| {}
	opts.elementW	= opts.elementW	!== undefined	? opts.elementW	: 1024
	opts.planeW	= opts.planeW !== undefined	? opts.planeW	: 1
	opts.planeH	= opts.planeH !== undefined	? opts.planeH	: 3/4

	// update functions
	var updateFcts	= []
	this.update	= function(delta, now){
		updateFcts.forEach(function(updateFct){
			updateFct(delta, now)
		})
	}

	var planeW	= opts.planeW
	var planeH	= opts.planeH
	var planeMaterial   = new THREE.MeshBasicMaterial({
		opacity	: 0,
		color	: new THREE.Color('black'),
		blending: THREE.NoBlending,
		side	: THREE.DoubleSide,

		// opacity	: 1,
		// color	: new THREE.Color('blue'),
	})
	var geometry	= new THREE.PlaneGeometry( opts.planeW, opts.planeH )
	var object3d	= new THREE.Mesh( geometry, planeMaterial )
	this.object3d	= object3d

	// width of iframe in pixels
	var aspectRatio		= planeH / planeW
	var elementWidth	= opts.elementW;
	var elementHeight	= elementWidth * aspectRatio
	domElement.style.width	= elementWidth  + "px";
	domElement.style.height	= elementHeight + "px";

	// create a CSS3DObject to display element
	var cssObject		= new THREE.CSS3DObject( domElement )
	this.cssObject		= cssObject

	cssObject.scale.set(1,1,1)
		.multiplyScalar(mixerContext.cssFactor/(elementWidth/planeW))

	//////////////////////////////////////////////////////////////////////////////////
	//		hook event so cssObject is attached to cssScene when object3d is added/removed
	//////////////////////////////////////////////////////////////////////////////////
	object3d.addEventListener('added', function(event){
		mixerContext.cssScene.add(cssObject)
	})
	object3d.addEventListener('removed', function(event){
		mixerContext.cssScene.remove(cssObject)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////

	updateFcts.push(syncCssObject)

	function syncCssObject(){
		// get world position
		object3d.updateMatrixWorld();
		var worldMatrix	= object3d.matrixWorld;

		// get position/quaternion/scale of object3d
		var position	= new THREE.Vector3()
		var scale	= new THREE.Vector3()
		var quaternion	= new THREE.Quaternion()
		worldMatrix.decompose(position, quaternion, scale)

		// handle quaternion
		cssObject.quaternion.copy(quaternion)

		// handle position
		cssObject.position
			.copy(position)
			.multiplyScalar(mixerContext.cssFactor)
		// handle scale
		var scaleFactor	= elementWidth/(geometry.parameters.width*scale.x)
		cssObject.scale.set(1,1,1).multiplyScalar(mixerContext.cssFactor/scaleFactor)
	}
};

//////////////////////////////////////////////////////////////////////////////////
//		Some Helpers							//
//////////////////////////////////////////////////////////////////////////////////


/**
 * create a THREEx.HtmlmixedPlane for an iframe
 * 
 * @param  {String} url  the url for the iframe
 * @param  {Object} opts the options for THREEx.HtmlMixerPlane constructor
 * @return {THREEx.HtmlMixerPlane}      the object just created
 */
THREEx.HtmlMixer.createPlaneFromIframe	= function(mixerContext, url, opts){
	// create the iframe element
	var domElement	= document.createElement('iframe')
	domElement.src	= url
	domElement.style.border	= 'none'
	// create the THREEx.HtmlMixerPlane for that
	return new THREEx.HtmlMixer.Plane(mixerContext, domElement, opts)
}

/**
 * create a THREEx.HtmlmixedPlane for an iframe
 * 
 * @param  {String} url  the url for the iframe
 * @param  {Object} opts the options for THREEx.HtmlMixerPlane constructor
 * @return {THREEx.HtmlMixerPlane}      the object just created
 */
THREEx.HtmlMixer.createPlaneFromImage	= function(mixerContext, url, opts){
	// create the iframe element
	var domElement	= document.createElement('img')
	domElement.src	= url
	// create the THREEx.HtmlMixerPlane for that
	return new THREEx.HtmlMixer.Plane(mixerContext, domElement, opts)
}


