# googoose
A jquery plugin that allows an html page to be converted and/or downloaded into a Microsoft Word Document with an emphasis on performance

## About
Googose allows you to turn any html content page into a properly formatted Microsoft Word (.doc) file.

## Benefits
* You now have the aility to view rich web content.
* You can generate word documents programatically without doing a whole lot of work, using a third party library, etc
* You can integrate this directly into sites with wysiwyg editors (eg:Wordpress). There is no need to install a plugin.

## Status
This is pretty close two as fully-fledged as it's going to be. Right now I'm just hardening it and working on bug fixes.

### Requirements
As you can see, you are required to include jquery in your page before googose

``` javascript
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>              
<script type="text/javascript" src="http://github.com/aadel112/googoose/js/jquery.googoose.js"></script>
```

I see no reason that jquery 1.5 or earlier wouldn't be supported, but I haven't tested this.

## Usage
The simplest usage will just call googose on page load.

``` javascript
<script type="text/javascript">
$(document).ready(function() {
    var o = {
        filename: 'test.doc'
    };
    $(document).googoose(o);
});
</script>
```

The content that is rendered to a Word doc will need to be wrapped in a div with the classname googoose-wrapper, by default.

``` html
<div class="googoose-wrapper"></div>
```

## Options
* area: 'div.googoose-wrapper' - This is the default selector of html to wrap the Word doc in.
* headerfooterid: 'googoose-hdrftrtbl' - This is used by the internals of googoose to manufacture headers and footers.
* margins: '1.0in' - the default CSS origins of the Word document. 
* zoom: '75' - the default Zoom percentage when the Word document opens.
* filename: null - the file name to save as. used only by the default finish action.
* size: '8.5in 11.0in' - the default size of the Word document.
* display: 'Print' - the default display mode to open the Word document in.
* lang: 'en-US' - the language on the page. defaults to English US.
* toc: 'div.googoose.toc' - if used by the developer this jQuery selector will translate into a Word table of contents.
* pagebreak: 'div.googoose.break' - if used by the developer at this jQuery selector will translate into a Microsoft Word page break.
* headerarea: 'div.googoose.header' - the content in this jQuery selector will be put in the Microsoft Word document header.
* footerarea: 'div.googoose.footer' - the content in this jQuery selector will be put in the document footer.
* headerid: 'googoose-header' - used solely by the googoose internals
* footerid: 'googoose-footer' - used solely by the googoose internals
* headermargin: '.5in' - CSS margin for the header.
* footermargin: '.5in' - the CSS margin for the footer.
* currentpage: 'span.googoose.currentpage' - generally used in headers and Footers this whole display the current page number.
* totalpage: 'span.googoose.totalpage' - generally displayed in headers and Footers this jQuery selector when put into the HTML content will display the number of total pages.
* finishaction: GG.finish - this is the default action that is called after the HTML has been rendered.
* html: null - gets populated before finishaction
* initobj: document - the root node

## To come
I've abandoned trying to make canvases and SVGs work for now. The developer can make this work by saving the canvas and SVG elements before invoking googoose on the server and then setting the source of the image to be the URL of the save to canvas, referencing the server URL.

I'm currently only working on bug fixes, and making sure the in implmentation is working.

## More
A perfectly good full example can be found [here](https://github.com/aadel112/wp-googoose) in this WordPress plugin which hooks googoose functionality to the tinymce editor.
You can visit my [blog](http://aadel112.com). I plan on putting more content regarding googoose on there. You can [contribute by donating](https://www.paypal.me/aadel112/5). Even $5 would be greatly appreciated. 
