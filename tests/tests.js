var gg = $(document).googoose({
    finishaction: null
});

//Do functional tests - testing basic functions
var functional_tests = [
	decodeHtmlEntity_test, convert_pagebreaks_test, 
	convert_toc_test, convert_hdrftr_test, convert_imgs_test,
	include_css_test, remove_bad_tags_test

];
for( var i = 0; i < functional_tests.length; ++i ) {
    QUnit.test( functional_tests[i].name, functional_tests[i] );
}


// Do regression tests - testing previously known bugs
var regression_tests = [
    pre_test, htmlentity_test, emptyselector_test
];
for( var i = 0; i < regression_tests.length; ++i ) {
    QUnit.test( regression_tests[i].name, regression_tests[i] );
}


// Check to see if whitespace is preserved in pre tags
function pre_test( assert ) {
    var newlines = $(gg.options.html).find('.pre-test')[0].outerHTML.indexOf( '\n' ) > -1 ? 1 : 0;
    assert.ok(newlines, "Passed"); 
}

// all HTML entities should be decoded to the human-readable representation
function htmlentity_test( assert ) {
    var entitiesReg = new RegExp(/&#(\d+);/g);
    var entities = entitiesReg.test($(gg.options.html).find('.pre-test')[0].outerHTML);
    assert.ok(!entities, "Passed"); 
}

//empty selected should return no HTML
function emptyselector_test( assert ) {
    var gge = $(this).googoose({
        finishaction: null, 
        area: 'div#fakeid'
    });
    assert.ok(!gge.options.html, "Passed"); 
};

function decodeHtmlEntity_test( assert ) {
    var h = "<p>I’ve </p> ";
    var out = gg.decodeHtmlEntity( h );
    assert.ok(out.indexOf('’') > -1, "Passed");
}
//stub
function remove_bad_tags_test( assert ) {
    var h = "<div><noscript>test</noscript></div>";
    var out = gg.remove_bad_tags( h );
    assert.ok(out.indexOf('noscript') <= -1 && out.indexOf('test') <= -1, 'Passed');
}
//stub
function convert_pagebreaks_test( assert ) { assert.ok(1, "Passed"); }
//stub
function convert_toc_test( assert ) { assert.ok(1, "Passed"); }
//stub
function convert_hdrftr_test( assert ) { assert.ok(1, "Passed"); }
//stub
function convert_imgs_test( assert ) { assert.ok(1, "Passed"); }
//stub
function include_css_test( assert ) { assert.ok(1, "Passed"); }

