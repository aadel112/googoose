var gg = $.fn.googoose({
    finishaction: null
});

// Check to see if whitespace is preserved in pre tags
QUnit.test( "pre test", function( assert ) {
    var newlines = $(gg.html).find('.pre-test')[0].outerHTML.indexOf( '\n' ) > -1 ? 1 : 0;
    assert.ok(newlines, "Passed"); 
});

// all HTML entities should be decoted to the human-readable representation
QUnit.test( "htmlentity test", function( assert ) {
    var entitiesReg = new RegExp(/&#(\d+);/g);
    var entities = entitiesReg.test($(gg.html).find('.pre-test')[0].outerHTML);
    assert.ok(!entities, "Passed"); 
});

//empty selected should return no HTML
QUnit.test( "empty selector test", function( assert ) {
    var gge = $.fn.googoose({
        finishaction: null, 
        area: 'div#fakeid'
    });
    assert.ok(!gge.html, "Passed"); 
});


