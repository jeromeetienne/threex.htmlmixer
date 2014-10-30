var THREEx	= THREEx		|| {}
THREEx.HtmlMixer= THREEx.HtmlMixer	|| {}

THREEx.HtmlMixer.convertToViewerUrl	= function(url){
	//////////////////////////////////////////////////////////////////////////////////
	//		youtube/watch by embeded player
	//////////////////////////////////////////////////////////////////////////////////
	// var isYoutubeWatch	= /^https?:\/\/www.youtube.com\/watch/.test(url)
	// if( isYoutubeWatch === true ){
	// 	var matches	= url.match(/v=([^#\&\?]+)/)
	// 	console.assert(matches.length === 2)
	// 	var videoId	= matches[1]
	// 	url		= 'http://www.youtube.com/embed/'+videoId+'?playsinline=1&rel=0&showinfo=0'
	// 	return url
	// }

	//////////////////////////////////////////////////////////////////////////////////
	//		youtube/watch by embeded player
	//////////////////////////////////////////////////////////////////////////////////
	var isYoutubeWatch	= /^https?:\/\/www.youtube.com\/watch/.test(url)
	if( isYoutubeWatch === true ){
		url	= 'htmlmixer-viewers/jwplayer-viewer/index.html?url='+encodeURIComponent(url)
		return url
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		for pdf, use pdf.js
	//////////////////////////////////////////////////////////////////////////////////
	var isPdf	= /\.pdf$/.test(url)
	if( isPdf === true ){
		// url	= 'htmlmixer-viewers/pdfjs-simpleviewer/?url='+encodeURIComponent(url)
		url	= 'htmlmixer-viewers/pdfjs-viewer/web/viewer.html?file='+encodeURIComponent(url)
		return url
	}

	// if this point is reached, do nothing
	return url
}
