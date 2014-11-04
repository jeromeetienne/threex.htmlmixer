var THREEx	= THREEx		|| {}
THREEx.HtmlMixer= THREEx.HtmlMixer	|| {}

THREEx.HtmlMixer.convertToViewerUrl	= function(url){
	var baseUrl	= THREEx.HtmlMixer.convertToViewerUrl.baseUrl

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
		url	= baseUrl+'/htmlmixer-viewers/jwplayer-viewer/index.html?url='+encodeURIComponent(url)
		return url
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		raw video thru jwplayer-viewer
	//////////////////////////////////////////////////////////////////////////////////
	var isRawVideo		= /\.(ogv|mp4|m4v)$/i.test(url)
	if( isRawVideo === true ){
		url	= baseUrl+'/htmlmixer-viewers/jwplayer-viewer/index.html?url='+encodeURIComponent(url)
		return url
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		raw video thru jwplayer-viewer
	//////////////////////////////////////////////////////////////////////////////////
	var isRawImage		= /\.(jpg|gif|png)$/i.test(url)
	if( isRawImage === true ){
		url	= baseUrl+'/htmlmixer-viewers/image-viewer/index.html?url='+encodeURIComponent(url)
		return url
	}
	//////////////////////////////////////////////////////////////////////////////////
	//		for pdf, use pdf.js
	//////////////////////////////////////////////////////////////////////////////////
	var isPdf	= /\.pdf$/.test(url)
	if( isPdf === true ){
		url	= baseUrl+'/htmlmixer-viewers/pdfjs-viewer/web/viewer.html?file='+encodeURIComponent(url)
		return url
	}

	// if this point is reached, do nothing
	return url
}


THREEx.HtmlMixer.convertToViewerUrl.baseUrl	= '.'
