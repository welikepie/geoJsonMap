

    function geocode(e) {

        e.preventDefault();
        var $this = $(this),
            //map = $('#' + $this.parents('[data-map]').data('map')).data('map'),
            query = encodeURIComponent($this.find('input[type=text]').val());

        $this.addClass('loading');

        $.ajax({
            url: 'http://open.mapquestapi.com/nominatim/v1/search?format=json&limit=1&q=' + query,
            jsonpCallback: 'callback',
            jsonpCallbackName: 'callback',
            success: success,
            complete:function(data,textResponse){
                console.log(data);
                console.log(textResponse);
            }
        });

        function success(resp) {
            resp = resp[0];
            $this.removeClass('loading');

            if (!resp) {
                $this.find('#geocode-error').text('This address cannot be found.').fadeIn('fast');
                console.log(resp);
                return;
            }

            $this.find('#geocode-error').hide();
            console.log(resp);
            map.setView([resp.lat, resp.lon],9);
            console.log(map);

            geocodeLayer.setGeoJSON({
                'type': 'Feature',
                'geometry': { 'type': 'Point', 'coordinates': [resp.lon, resp.lat] },
                'properties': {}
            });

            map.ui.refresh(); // Update attribution
             map.fitBounds(geocodeLayer.getBounds());
        }
    }

    
    $(function() {
        $('[data-control="geocode"] form').submit(geocode);
    });

