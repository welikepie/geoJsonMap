

    // Expose functionality as jQuery plugin
    $.fn.switchLayer = switchLayer;

    function switchLayer(e) {
        var $this = $(this),
            $parent = $this.parents('[data-control="switcher"]'),
            group = $this.data('group') || 0,
            map = $('#' + $this.parents('[data-map]').data('map')).data('map'),
            name = $this.attr('href').replace('#','');

        if (!map.getLayer(name).enabled) {
            // Disable all layers in same group
            var layers = $parent.find('a');
            for (var i = 0; i < layers.length; i++) {
                var l = map.getLayer($(layers[i]).attr('href').replace('#',''));
                if (l && group == ($(layers[i]).data('group') || 0) && l.enabled) {
                    $(layers[i]).removeClass('active');
                    $(layers[i]).trigger('disabled');
                    l.disable();
                }
            }

            map.enableLayer(name);
            $this.addClass('active');
            $this.trigger('enabled');

        } else if ($this.data('toggle')) {
            // Toggle layer off
            map.disableLayer(name);
            $this.removeClass('active');
            map.draw();
        }
        map.ui.refresh();
        return false;
    }

    $(function() {
        $('body').on('click.switcher.data-api', '[data-control="switcher"] a', switchLayer);
    });

    $.fn.ease = easeMap;

    function easeMap(e, force) {
        var $this = $(this);

        // Don't ease when toggling layer off
        if ($this.data('toggle') && e.type !== 'enabled') return false;

        var mapid = $this.data('map') || $this.parents('[data-map]').data('map'),
            map = $('#' + mapid).data('map');

        if (!map) return false;

        var lat = $this.data('lat') || map.center().lat,
            lon = $this.data('lon') || map.center().lon,
            zoom = $this.data('zoom') || map.zoom();

        map.ease.location({ lat: lat, lon: lon}).zoom(zoom).optimal();
        return false;
    }

    $(function() {
        $('body').on('click.ease.data-api enabled.ease', '[data-lat],[data-lon],[data-zoom]', easeMap);
    });
