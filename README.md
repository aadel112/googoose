# googoose
A jquery plugin that allows an html page to be converted and/or downloaded into a Microsoft Word Document with an emphasis on performance

## About
Googose allows you to turn any html content page into a properly formatted Microsoft Word (.doc) file.

## Benefits
* You now have the aility to view rich web content, such as canvas and svg elements in MS Word
* You can generate word documents programatically without doing a whole lot of work, using a third party library, etc
* You can integrate this directly into sites with wysiwyg editors (eg:Wordpress). There is no need to install a plugin.

## To come
I'll commit the source in a few days, most likely. Currently, I'm still struggling with getting svg and canvas images to display properly. To me this is a critical feature that I want to provide, and it's one of the primary reasons for doing this in javascript. Ideally, the developer will be able to simply wait for an event trigger that signifies that all svgs/canvas images have finished being rendered, and then be able to invoke googoose.
