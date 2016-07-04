var gg = $(document).googoose({
    finishaction: null
});

// Check to see if whitespace is preserved in pre tags
QUnit.test( "pre test", function( assert ) {
    var newlines = $(gg.html).find('.pre-test')[0].outerHTML.indexOf( '\n' ) > -1 ? 1 : 0;
    assert.ok(newlines, "Passed"); 
});



