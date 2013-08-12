threex.htmlmixer
================

threex.htmlmixer is a three.js extension to seemlessly integrate actual dom elements in your webgl.
It is based on 
["Mixing HTML Pages Inside Your WebGL"](http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/)
post on [learningthree.js blog](http://learningthreejs.com)

Here is a [basic example](http://jeromeetienne.github.io/threex.htmlmixer/examples/basic.html) and its [source](https://github.com/jeromeetienne/threex.htmlmixer/blob/master/examples/basic.html)

How To Install It
=================

You can install it manually or with
[bower](http://bower.io/).
for the manual version, first include ```threex.htmlmixer.js``` with the usual

```html
<script src='threex.htmlmixer.js'></script>
```

or with
[bower](http://bower.io/) 
you type the following to install the package.

```bash
bower install -s threex.htmlmixer=https://github.com/jeromeetienne/threex.htmlmixer/archive/master.zip
```

then you add that in your html

```html
<script src="bower_components/threex.htmlmixer/threex.htmlmixer.js"></script>
```


How to Use It
=============

instanciate the first object

```javascript
// you create the new object
var htmlMixer	= new THREEx.HtmlMixer(renderer, scene, camera)
// you update it at every frame
updateFcts.push(function(delta, now){
	htmlMixer.update(delta, now)
})
```

update it at every frame

```javascript
htmlMixer.update(delta, now)
```

create an plane

```javascript
var mixerPlane	= new THREEx.HtmlMixer.Plane(htmlMixer, domElement)
scene.add(mixerPlane.object3d)
```

### tips
There is a shortcut for iframe as it is a common use-case.

```javascript
var url		= 'http://threejs.com';
var mixerPlane	= THREEx.HtmlMixer.createPlaneFromIframe(htmlMixer, url)
scene.add(mixerPlane.object3d)
```
