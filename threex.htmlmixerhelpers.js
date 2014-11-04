var THREEx = THREEx || {}
THREEx.HtmlMixerHelpers	= THREEx.HtmlMixerHelpers	|| {}

/**
 * create domElement for a iframe to insert in a THREEx.HtmlmixedPlane 
 * 
 * @param  {String} url  the url for the iframe
 */
THREEx.HtmlMixerHelpers.createIframeDomElement	= function(url){
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
		container.style.webkitOverflowScrolling	= 'touch'
		return container
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		Comment								//
	//////////////////////////////////////////////////////////////////////////////////
	return domElement
}


/**
 * set the iframe.src in a mixerPlane.
 * - Usefull as it handle IOS specificite
 */
THREEx.HtmlMixerHelpers.setIframeSrc	= function(mixerPlane, url){
	// handle THREEx.HtmlMultipleMixer.Plane 
	if( THREEx.HtmlMultipleMixer && mixerPlane instanceof THREEx.HtmlMultipleMixer.Plane ){
		mixerPlane.planes.forEach(function(plane){
			THREEx.HtmlMixerHelpers.setIframeSrc(plane, url)
		})
		return
	}

	// sanity check
	console.assert(mixerPlane instanceof THREEx.HtmlMixer.Plane )
	// get the domElement
	var domElement	= mixerPlane.domElement
	// handle IOS special case
	var onIos	= navigator.platform.match(/iP(hone|od|ad)/) !== null ? true : false
	if( onIos ){
		var domElement	= mixerPlane.domElement.firstChild
	}


	// sanity check
	console.assert( domElement instanceof HTMLIFrameElement )

	// actually set the iframe.src
	domElement.src	= url
}


/**
 * create domElement for a image to insert in a THREEx.HtmlmixedPlane 
 * 
 * @param  {String} url  the url for the iframe
 */
THREEx.HtmlMixerHelpers.createImageDomElement	= function(url){
	var domElement	= document.createElement('img')
	domElement.src	= url
	return domElement
}


