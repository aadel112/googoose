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

        GG.finish = function() {
           if(options.download) {
                //html5 attr, not supported in ie yet
                //forces download of word doc
                var link = document.createElement('a');
                link.download = options.filename ? options.filename : new Date().getUTCMilliseconds() + '.doc' ;
                link.href = 'data:,' + options.html;
                link.click();
            } else {
                document.write( options.html );
            } 
        }

        var options = $.extend({
            // These are the defaults.
            area: 'div.googoose',
            headerfooterid: 'googoose-hdrftrtbl',
            margins: '1.0in',
            zoom: '75',
            filename: null,
            size: '8.5in 11.0in',
            display: 'Print',
            lang: 'en-US',
            download: true,
            toc: 'div.googoose.toc',
            pagebreak: 'div.googoose.break',
//TODO - handle svgs by converting them to canvas then to pngs
//            convertsvgs: true,
            convertcanvas: true,
            headerarea: 'div.googoose.header',
            footerarea: 'div.googoose.footer',
            headerid: 'googoose-header',
            footerid: 'googoose-footer',
            headermargin: '.5in',
            footermargin: '.5in',
            currentpage: 'span.googoose.currentpage',
            totalpage: 'span.googoose.totalpage',
            finishaction: GG.finish
        }, options );

        GG.translate_mso_features = function( html ) {
            
            html = GG.convert_pagebreaks(html);
            html = GG.convert_toc(html);
            html = GG.convert_hdrftr(html);
            html = GG.convert_imgs(html);
            html = GG.convert_svgs(html);
            html = GG.convert_canvas(html);

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
            imgs = thtml.find('svg');
            imgs.each(function() {
                $(this).attr( 'src', $(this)[0].src );
            });
            html = thtml.html();
            return html;
        }

        GG.convert_svgs = function( html ) {
            //TODO - convert svgs to png 
            //https://gist.github.com/Caged/4649511
            //http://stackoverflow.com/questions/8499633/how-to-display-base64-images-in-html
            //it seems word actually can't display an svg without first converting to canvas then png or some such
            //probably want to do this eventually 
            //https://github.com/gabelerner/canvg
            if( options.convertsvgs ) {
                var thtml = $('<div>' + html + '</div>' );
                svgs = thtml.find('svg');

                var xser = new XMLSerializer();
                svgs.each(function() {
                    var xml = xser.serializeToString(this);
                    var data = "data:image/svg+xml;base64," + btoa(xml);
                    var img = new Image();
                    img.setAttribute('src', data);
                    $(this).replaceWith( img );
                });
                html = thtml.html();
            }
            return html;

        }

        GG.convert_canvas = function(html) {
            if(options.convertcanvas) {
               var thtml = $('<div>' + html + '</div>' );
                canvases = thtml.find('canvas');

                canvases.each(function() {
                    var img = new Image();
                    img.setAttribute('src', this.toDataURL());
                    $(this).replaceWith( img );
                });
                html = thtml.html();
            }
            return html;
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
            html += '</xml>\n';
            html += '<![endif]-->\n';
            html += '';

            //adding any header information that may be pertinent in teh copied html
            $(document).find('style').each( function( ) {
                html += ( '\n' + $(this)[0].outerHTML + '\n' );
            } );
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

//            //add header footer content
//            html += ( $(options.headerfooter).length ? $(options.headerfooter).html() : '' );

            //close body
            html += '</div></body>\n';

            //close doc
            html += '</html>\n';
            return html;
        }

        options.html = GG.html();

        if( options.html && options.finishaction ) {
            options.finishaction();   
        }

        return this;
    };

}( jQuery ));
