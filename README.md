This app provides a geocoder for looking up an address and then determininng if it is within a NYC priority community district.  The geocoder provides a set of results matching input text.  On selection of one of these results, a marker is generated and intersected with the community district boundaries.  The marker popup will then report if the marker is located within a priority district.

Input with autocomplete enabled. The map extent and zoom levels are contrained.  The geocoder API prioritizes addresses within the active map extent.

Dependencies:
- [NYC Planning Labs geocoder](https://geosearch.planninglabs.nyc/docs/)
- Leaflet 
- [Leaflet Pelias geocoder plugin](https://github.com/pelias/leaflet-plugin)
- NYC community district geojson file
- jquery 3.6
- [Leaflet point-in-polygon plugin](https://github.com/mapbox/leaflet-pip)
    Copyright (c) 2017, Mapbox
    All rights reserved.

To do:
- Update popup messages
- Update layer symbology, provide legend
- Refactor with module bundler