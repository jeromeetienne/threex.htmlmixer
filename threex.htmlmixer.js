var THREEx = THREEx || {}


THREEx.HtmlMixer	= THREEx.HtmlMixer	|| {}

/**
 * define a context for THREEx.HtmlMixer
 * 
 * @param  {THREE.WebGLRenderer|THREE.CanvasRenderer} rendererWebgl the renderer in front
 * @param  {THREE.Scene} scene the original scene
 * @param  {THREE.Camera} camera the camera used for the last view
 */
THREEx.HtmlMixer.Context	= function(rendererWebgl, scene, camera){
	// update functions
	var updateFcts	= []
	this.update	= function(){
		updateFcts.forEach(function(updateFct){
			updateFct()
		})
	}

	// build cssFactor to workaround bug due to no display 
	var cssFactor	= 1000
	this.cssFactor	= cssFactor

	//////////////////////////////////////////////////////////////////////////////////
	//		update renderer
	//////////////////////////////////////////////////////////////////////////////////

	var rendererCss	= new THREE.CSS3DRenderer()
	this.rendererCss= rendererCss


	this.rendererWebgl	= rendererWebgl

	//////////////////////////////////////////////////////////////////////////////////
	//		Handle Camera
	//////////////////////////////////////////////////////////////////////////////////

	var cssCamera	= new THREE.PerspectiveCamera(camera.fov, camera.aspect, camera.near*cssFactor, camera.far*cssFactor);

	updateFcts.push(function(){
		cssCamera.quaternion.copy(camera.quaternion)

		cssCamera.position
			.copy(camera.position)
			.multiplyScalar(cssFactor)
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	// create a new scene to hold CSS
	var cssScene = new THREE.Scene();
	this.cssScene= cssScene
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Auto update objects
	//////////////////////////////////////////////////////////////////////////////////

	this.autoUpdateObjects	= true
	updateFcts.push(function(){
		if( this.autoUpdateObjects !== true )	return
		cssScene.traverse(function(cssObject){
			if( cssObject instanceof THREE.Scene === true )	return
			var mixerPlane	= cssObject.userData.mixerPlane
			if( mixerPlane === undefined )	return
			mixerPlane.update()
		})		
	}.bind(this))

	//////////////////////////////////////////////////////////////////////////////////
	//		Render cssScene
	//////////////////////////////////////////////////////////////////////////////////
	updateFcts.push(function(delta, now){
		rendererCss.render(cssScene, cssCamera)
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
	opts.object3d	= opts.object3d !== undefined	? opts.object3d	: null

	this.domElement	= domElement

	// update functions
	var updateFcts	= []
	this.update	= function(){
		updateFcts.forEach(function(updateFct){
			updateFct()
		})
	}

	var planeW	= opts.planeW
	var planeH	= opts.planeH
	if( opts.object3d === null ){
		var planeMaterial   = new THREE.MeshBasicMaterial({
			opacity	: 0,
			color	: new THREE.Color('black'),
			blending: THREE.NoBlending,
			side	: THREE.DoubleSide,
		})
		var geometry	= new THREE.PlaneGeometry( opts.planeW, opts.planeH )
		var object3d	= new THREE.Mesh( geometry, planeMaterial )		
	}else{
		var object3d	= opts.object3d
	}

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

	// hook cssObhect to mixerPlane
	cssObject.userData.mixerPlane	= this

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

	updateFcts.push(function(){
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
		var scaleFactor	= elementWidth/(object3d.geometry.parameters.width*scale.x)
		cssObject.scale.set(1,1,1).multiplyScalar(mixerContext.cssFactor/scaleFactor)
	})
};

//////////////////////////////////////////////////////////////////////////////////
//		Some Helpers							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * create domElement for a iframe to insert in a THREEx.HtmlmixedPlane 
 * 
 * @param  {String} url  the url for the iframe
 */
THREEx.HtmlMixer.createDomElementForIframe	= function(url){
	// create the iframe element
	var domElement	= document.createElement('iframe')
	domElement.src	= url
	domElement.style.border	= 'none'

	//////////////////////////////////////////////////////////////////////////////////
	//		IOS workaround for iframe
	//////////////////////////////////////////////////////////////////////////////////
	var onIos	= navigator.platform.match(/iP(hone|od|ad)/) !== null ? true : false
	if( onIos ){
		// - see the following post for explaination on this workaround
		// - http://dev.magnolia-cms.com/blog/2012/05/strategies-for-the-iframe-on-the-ipad-problem/
		domElement.style.width	= '100%'
		domElement.style.height	= '100%'
		var container	= document.createElement('div')
		container.appendChild(domElement)
		container.style.overflow	= 'scroll'
		// container.style.webkitOverflowScrolling	= 'touch'
		return container
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	return domElement
}

/**
 * create domElement for a image to insert in a THREEx.HtmlmixedPlane 
 * 
 * @param  {String} url  the url for the iframe
 */
THREEx.HtmlMixer.createDomElementForImage	= function(url){
	var domElement	= document.createElement('img')
	domElement.src	= url
	return domElement
}

/**
 * create a THREEx.HtmlmixedPlane for an iframe
 * 
 * @param  {String} url  the url for the iframe
 * @param  {Object} opts the options for THREEx.HtmlMixerPlane constructor
 * @return {THREEx.HtmlMixerPlane}      the object just created
 */
THREEx.HtmlMixer.createPlaneFromIframe	= function(mixerContext, url, opts){
	// create the domElement
	var domElement	= THREEx.HtmlMixer.createDomElementForIframe(url)
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
	// create the domElement
	var domElement	= THREEx.HtmlMixer.createDomElementForImage(url)
	// create the THREEx.HtmlMixerPlane for that
	return new THREEx.HtmlMixer.Plane(mixerContext, domElement, opts)
}


