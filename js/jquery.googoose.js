/*!
 * googoose 1.0.0
 * https://github.com/aadel112/googoose/js/jquery.googoose.js
 * @license Apache 2.0
 *
 * Copyright (C) 2016 - aadel112.com - A project by Aaron Adel    
 */
(function ( $ ) {

    $.fn.googoose = function( options ) {

        var GG = $.fn.googoose;
        var ii = 0,
            gghtml = '',
            imgdata = '',
            now = new Date().getTime();
//            partstring = '----Googoose.Boundary';

//        imgdata = '\n\nMIME-Version: 1.0\nContent-Type: multipart/related;\nboundary="' + partstring + '"\n\n';

        GG.finish = function() {
           if(options.download) {
                //forces download of word doc
                var file = new File([gghtml], options.filename, {type: "applicatoin/msword;charset=utf-8"});
                saveAs(file);
            } else {
                document.write( gghtml );
            } 
        }

        var options = $.extend({
            // These are the defaults.
            area: 'div.googoose',
            headerfooterid: 'googoose-hdrftrtbl',
            margins: '1.0in',
            zoom: '75',
            filename: 'Doc1_' + now + '.doc',
            size: '8.5in 11.0in',
            display: 'Print',
            lang: 'en-US',
            download: true,
            toc: 'div.googoose.toc',
            pagebreak: 'div.googoose.break',
            convertsvgs: true,
            convertcanvas: true,
            imgdir: 'img',
            headerarea: 'div.googoose.header',
            footerarea: 'div.googoose.footer',
            headerid: 'googoose-header',
            footerid: 'googoose-footer',
            headermargin: '.5in',
            footermargin: '.5in',
            currentpage: 'span.googoose.currentpage',
            totalpage: 'span.googoose.totalpage',
            htmlboundary: '--',
            finishaction: GG.finish
        }, options );

		//http://requiremind.com/memoization-speed-up-your-javascript-performance/
       	GG.memoize = function(fn, resolver) {
		  var memoized = function() {
			resolver  = resolver || JSON.stringify;
			var cache = memoized.cache;
			var args  = Array.prototype.slice.call(arguments);
			var key   = resolver.apply(this, args);
			if(key in cache) {
			  console.log('hit cache');
			  return cache[key];
			}
			var result = fn.apply(this, arguments);
			cache[key] = result;
			return result;
		  };
		  memoized.cache = {};
		  return memoized;
		}

        GG.translate_mso_features = function( html ) {
            
            html = GG.convert_pagebreaks(html);
            html = GG.convert_toc(html);
            html = GG.convert_hdrftr(html);
            html = GG.convert_imgs(html);
            html = GG.convert_svgs(html);
            html = GG.convert_canvas(html);
//            html = GG.append_imgdata(html);

            return html;
        }

        GG.convert_pagebreaks = function( html ) {
            //user decides in html what will be a page break in word, this converts to a page break
            if( options.pagebreak ) {
                var thtml = $('<div>' + html + '</div>' );
                thtml.find(options.pagebreak).replaceWith(GG.get_pagebreak());
                html = thtml.html();
            }
            return html;
        }

        GG.convert_toc = function( html ) {
            //user determines in html what will be the toc in word
            if( options.toc && $(options.toc).length ) {
                var thtml = $('<div>' + html + '</div>' );
                thtml.find(options.toc).replaceWith(GG.get_toc_contents());
                html = thtml.html();
            }
            return html; 
        }

        GG.convert_hdrftr = function( html ) {
            var hvis = options.headerarea && $(options.headerarea).length;
            var fvis = options.footerarea && $(options.footerarea).length;
            if( hvis || fvis ) {
                var thtml = $('<div>' + html + '</div>' );
                var hdrftr = $('<table id=\'' + options.headerfooterid + '\'></table>');
                hdrftr.append('<tr><td class=h></td><td class=f></td></tr>');
                thtml.append(hdrftr);
                html = thtml.html();
                
                html = GG.convert_totalpage(html);
                html = GG.convert_currentpage(html);
            }
            if( hvis ) {
                var thtml = $('<div>' + html + '</div>' );
                var new_header = thtml.find(options.headerarea).html();
                thtml.find(options.headerarea).replaceWith('');
                thtml.find('table#' + options.headerfooterid + ' .h').append( 
                        GG.headerstart() + new_header + GG.headerend() );
                html = thtml.html();
            }
            if( fvis ) {
                var thtml = $('<div>' + html + '</div>' );
                var new_footer = thtml.find(options.footerarea).html();
                thtml.find(options.footerarea).replaceWith('');
                thtml.find('table#' + options.headerfooterid + ' .f').append( 
                        GG.footerstart() + new_footer + GG.footerend());
                html = thtml.html();
            }
            return html;

        }

        GG.convert_imgs = function( html ) {
            //make sure all standard images use absolute path 
            var thtml = $('<div>' + html + '</div>' );
            imgs = thtml.find('img');
            imgs.each(function() {
                $(this).attr( 'src', $(this)[0].src );
            });
            html = thtml.html();
            return html;
        }

        GG.convert_svgs = function( html ) {

            if( options.convertsvgs ) {
                var thtml = $('<div>' + html + '</div>' );
                svgs = thtml.find('svg');
                //TODO - convert each to canvas and replace
            }
            return html;

        }

        GG.convert_canvas = function(html) {
            if(options.convertcanvas) {
               var thtml = $('<div>' + html + '</div>' );
                canvases = thtml.find('canvas');

                canvases.each(function() {
                    var img = new Image();
                    img.setAttribute('src', GG.get_canvas_src_attr(this));
                    $(this).replaceWith( img );
                });
                html = thtml.html();
            }
            return html;
        }

        GG.savepng = function( e ) {
            var ret = GG.pngname($(e).html());
            e.toBlob(function(blob) {
                saveAs( blob, GG.pngname($(e).html()) );
            });
            return ret;
        }

		GG.get_png_name = function( html ) {
			var inc = ++ii;
			return ( now + '.image' + ii + '.png' );
		}

        GG.append_imgdata = function(html) {
            if(options.img_datahtml) {
                var thtml = $('<div>' + html + '</div>' );
                imgs = thtml.find('body').append(imgdata);
                html = thtml.html();
            }
            return html;
        }

        GG.get_canvas_src_attr = function(e) {
            var n = GG.savepng(e);
            return '#' + options.htmlboundary + n;
        }

        GG.convert_totalpage = function(html) {
            if( options.totalpage && $(options.totalpage).length ) {
                var thtml = $('<div>' + html + '</div>' );
                thtml.find(options.totalpage).html('');
                thtml.find(options.totalpage).append( GG.get_total_page_number() );
                html = thtml.html();
            }
            return html;
        }

        GG.convert_currentpage = function(html) {
            if( options.currentpage && $(options.currentpage).length ) {
                var thtml = $('<div>' + html + '</div>' );
                thtml.find(options.currentpage).html('');
                thtml.find(options.currentpage).append( GG.get_page_number() );
                html = thtml.html();
            }
            return html;
        }

        GG.get_pagebreak = function() {
            return '<br clear=all style=\'mso-special-character:line-break;page-break-before:always\'>';
        }

        GG.headerstart = function() {
            var html = '';
            html += '\n<div style=\'mso-element:header\' id=' + options.headerid + '>\n';
            html += '<p class="MsoHeader">\n';
            return html;
        }
        GG.headerend = function() {
            return '</p></div>\n';
        }

        GG.footerstart = function() {
            var html = '';
            html += '<div style=\'mso-element:footer\' id=' + options.footerid + '>';
            return html;
        }
        GG.footerend = function() {
            return '</div>\n';
        }

        GG.get_page_number = function() {

            var html = '<!--[if supportFields]><span\n';
            html += 'class=MsoPageNumber><span style=\'mso-element:field-begin\'></span><span\n';
            html += 'style=\'mso-spacerun:yes\'> </span>PAGE <span style=\'mso-element:field-separator\'></span></span><![endif]--><span\n';
            html += 'class=MsoPageNumber><span style=\'mso-no-proof:yes\'>1</span></span><!--[if supportFields]><span\n';
            html += 'class=MsoPageNumber><span style=\'mso-element:field-end\'></span></span><![endif]-->';   
            return html;
        }

        GG.get_total_page_number = function() {
            var html = '<!--[if supportFields]><span class=MsoPageNumber><span \n';
            html += ' style=\'mso-element:field-begin\'></span> NUMPAGES <span style=\'mso-element:field-separator\'></span></span><![endif]--><span \n';
            html += ' class=MsoPageNumber><span style=\'mso-no-proof:yes\'>1</span></span><!--[if supportFields]><span \n'
            html += ' class=MsoPageNumber><span style=\'mso-element:field-end\'></span></span><![endif]-->\n';
            return html;
        }

        GG.get_toc_contents = function() {
            var toc = '<p class=MsoToc1>\n';
            toc += '<!--[if supportFields]>\n';
            toc += '<span style=\'mso-element:field-begin\'></span>\n';
            toc += 'TOC \o "1-3" \\u \n';
            toc += '<span style=\'mso-element:field-separator\'></span>\n';
            toc += '<![endif]-->\n';
            toc += '<span style=\'mso-no-proof:yes\'>Table of content - Please right-click and choose "Update fields".</span>\n';
            toc += '<!--[if supportFields]>\n';
            toc += '<span style=\'mso-element:field-end\'></span>\n';
            toc += '<![endif]-->\n';
            toc += '</p>\n';

//            toc += '<br clear=all style=\'mso-special-character:line-break;page-break-before:always\'>\n';

            return toc;
        }

        //TODO - figure out a way to simulate a right mpuse click, update fields

        
        GG.include_css = function( html ) {
            //adding any header information that may be pertinent in teh copied html
            var tags = ['style', 'link'];
            for( i = 0; i < tags.length ; ++i ) {
                $(document).find(tags[i]).each( function( ) {
                    html += ( '\n' + $(this)[0].outerHTML + '\n' );
                } );
            }
            return html;
        }

        GG.html = function() {
            if( !$(options.area).length ) {
                return null;
            }
            // adding the standard mso header 
            var html = '<html xmlns:o=\'urn:schemas-microsoft-com:office:office\' xmlns:w=\'urn:schemas-microsoft-com:office:word\' xmlns=\'http://www.w3.org/TR/REC-html40\'>\n';
            html += '<head>\n';
            html += '<!--[if gte mso 9]>\n';
            html += '<xml>\n';
            html += '<w:WordDocument>\n';
            html += ( '<w:View>' + options.display + '</w:View>\n' );
            html += ('<w:Zoom>'+ options.zoom +'</w:Zoom>\n');
            html += '<w:DoNotOptimizeForBrowser/>\n';
            html += '</w:WordDocument>\n';
            html += '<o:OfficeDocumentSettings>\n';
            html += '<o:AllowPNG/>\n';
            html +='</o:OfficeDocumentSettings>\n';
            html += '</xml>\n';
            html += '<![endif]-->\n';
            html += '';

            html = GG.include_css( html );
            //adding in mso style necessesities
            html += '<style>\n';
            html += '<!--\n';
            html += '@page {\n';
            html += ('\tsize:' + options.size + ';\n');
            html += ('\tmargin:' + options.margins + ';\n');
            html += '}\n';
            html += '@page Container {\n';
            html += ('\tmso-header-margin:' + options.headermargin + ';\n' );
            html += ('\tmso-footer-margin:' + options.footermargin + ';\n' );
            html += ('\tmso-header:' + options.headerid + ';\n' );
            html += ('\tmso-footer:' + options.footerid + ';\n' );
            html += '}\n';
            html += 'div.Container { page:Container; }\n';
            html += ( 'table#' + options.headerfooterid + ' {\n' );
            html += '\tmargin:0in 0in 0in 9in;\n';
            html += '}\n';
            html += '-->\n';
            html += '</style>\n';

            //close head
            html += '</head>\n';

            //start body
            html += ('<body lang=' + options.lang + '>\n<div class=Container>');

            //add area content
            html += ( $(options.area).length ? 
                    GG.translate_mso_features( $(options.area).html() ) : '' );


            //close body
            html += '</div></body>\n';

            //close doc
            html += '</html>\n';
            return html;
        }

		//memoized fns
		GG.pngname = GG.memoize(GG.get_png_name);

        //execution
        gghtml = GG.html();
        gghtml = gghtml.replace( '#' + options.htmlboundary, '' );
        if( gghtml && options.finishaction ) {
            options.finishaction();   
        }

        return this;
    };

}( jQuery ));
