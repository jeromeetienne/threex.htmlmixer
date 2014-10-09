threex.htmlmixer
================

threex.htmlmixer is a [three.js game extension](http://www.threejsgames.com/extensions/) to seemlessly integrate actual dom elements in your game. It uses a clever blending trick to mix CSS3 and Webgl. See details in ["Mixing HTML Pages Inside Your WebGL"](http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/) post on [learningthree.js blog](http://learningthreejs.com). It provides a great new way for the player to interact with the 3d . For example you can include youtube players inside a movie screen. Additionally you can easily access the content of the whole web and include it in your three.js game. 

Show Don't Tell
===============
* [examples/basic.html](http://jeromeetienne.github.io/threex.htmlmixer/examples/basic.html)
\[[view source](https://github.com/jeromeetienne/threex.htmlmixer/blob/master/examples/basic.html)\] :
It shows a very basic usage.
* [examples/demo.html](http://jeromeetienne.github.io/threex.htmlmixer/examples/demo.html)
\[[view source](https://github.com/jeromeetienne/threex.htmlmixer/blob/master/examples/demo.html)\] :
It shows a various possible 3rd party widget iframe available on the web.

A Screenshot
============
[![screenshot](https://raw.githubusercontent.com/jeromeetienne/threex.htmlmixer/master/examples/images/screenshot-threex-htmlmixer-512x512.jpg)](http://jeromeetienne.github.io/threex.htmlmixer/examples/basic.html)

How To Install It
=================

You can install it via script tag

```html
<script src='threex.htmlmixer.js'></script>
```

Or you can install with [bower](http://bower.io/), as you wish.

```bash
bower install threex.htmlmixer
```

How to Use It
=============

instanciate the first object

```javascript
// you create the new object
var mixerContext	= new THREEx.HtmlMixer.Context(renderer, scene, camera)
// you update it at every frame
updateFcts.push(function(delta, now){
	mixerContext.update(delta, now)
})
```

update it at every frame

```javascript
mixerContext.update(delta, now)
```

create an plane

```javascript
var mixerPlane	= new THREEx.HtmlMixer.Plane(mixerContext, domElement)
scene.add(mixerPlane.object3d)
```

### tips
There is a shortcut for iframe as it is a common use-case.

```javascript
var url		= 'http://threejs.com';
var mixerPlane	= THREEx.HtmlMixer.createPlaneFromIframe(mixerContext, url)
scene.add(mixerPlane.object3d)
```
