var tilejson = "";

var map = L.mapbox.map('map', 'examples.map-9ijuk24y');
map.setView([38, -102.0], 9);

// As with any other AJAX request, this technique is subject to the Same Origin Policy:
// http://en.wikipedia.org/wiki/Same_origin_policy
// So the CSV file must be on the same domain as the Javascript, or the server
// delivering it should support CORS.
var markerLayer = L.mapbox.markerLayer()
    .loadURL('JSON/features.json')
    .addTo(map);
 var geocodeLayer = L.mapbox.markerLayer('geocode').addTo(map);
markerLayer.on('ready', function() {
    map.fitBounds(markerLayer.getBounds());
});
    // Add share control
//    mapbox.share().map(map).add();

    // Set title and description from tilejson
    document.title = "Proof of Concept";
    $('h1.map-title').text("A test of running this from local GeoJSON");
    $('p.description').text("We've just pilfered some information for this as a proof of concept. Here's to hoping it all works!");
    var container = $('#markerfilters');

    $.ajax({
        "url":"JSON/features.json",
        "success":function(data,textStatus){
            if(textStatus == "success"){
            tilejson = data;
                $.each(tilejson.features, function(index, m) {
                    var s = m.properties['marker-symbol'];

                    if (container.find('[href="#' + s + '"]').length) return;

                    var el = $(document.createElement('a'))
                        .addClass('markerfilter')
                        .attr('href', '#' + s)
                        .css('background-image', 'url(https://a.tiles.mapbox.com/v3/marker/pin-l-'+s+'+000000.png)')
                        .bind('click', filter);
                    container.append(el);
                });
        }else{
            alert("Sadly, we were unable to load the JSON, and will not be able to filter.");
        }
        }
    });


    $('[href="#all"]').bind('click', filter);


    function filter(e) {
        container.find('a').removeClass('selected');
        var id = $(this).addClass('selected').attr('href').replace('#', '');
        
        markerLayer.setFilter(function(f) {
            return f.properties['marker-symbol'] === id || id==="all";
        });

        //tilejson.markers.filter(function(feature) {
        //    return feature.properties['marker-symbol'] == id || id == 'all';
        //});
        return false;
    }
