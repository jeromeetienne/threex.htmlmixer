# Handling Events with threex.htmlmixer

# Requirements
* webgl canvas must be before css3d element to get proper visual effect

# Possible solution
* here is a dom hierachy with all elements in fullpage
    * webgl canvas with pointer-none
    * a event catcher in front
    * css3d domElement
    * a event catch in the back
* find a way to ensure the event are propagated in the order you expect
    - do a test bed
    - only 4 div, each with a different name
    - do a console.log on event reception
    - or better display on screen

### how to handle event in this case
* depending the event you want to listen on
* either you listen on the front event catcher
    - if so, iframe will get the event AFTER you
* or on the back event catcher
    - if so, iframe will get the event BEFORE you