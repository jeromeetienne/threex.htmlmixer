threex.htmlmixer
================

threex.htmlmixer is a three.js extension to seemlessly integrate actual dom elements in your webgl.
It is based on 
["Mixing HTML Pages Inside Your WebGL"](http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/)
post on [learningthree.js blog](http://learningthreejs.com)

How to Use It
=============

instanciate the first object

```javascript
// you create the new object
var htmlMixer	= new THREEx.Htmlmixer(renderer, scene, camera)
// you update it at every frame
updateFcts.push(function(delta, now){
	htmlmixer.update(delta, now)
})
```

update it at every frame

```javascript
htmlmixer.update(delta, now)
```

create an plane

```javascript
var mixerPlane	= new THREEx.Htmlmixer.Plane(htmlmixer, domElement)
scene.add(mixerPlane.object3d)
```

NOTE: use onAdded event to mirror it internally

There is a shortcut for iframe as it is a common usecas

```javascript
var mixerPlane	= THREEx.Htmlmixer.createPlaneFromIframe(htmlmixer, url)
scene.add(mixerPlane.object3d)
```
