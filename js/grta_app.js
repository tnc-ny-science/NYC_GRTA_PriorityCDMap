   /*global variables */

    /*set thematic colors */
    var priorityFill = 'rgba(205, 201, 15, 0.2)';
    var nonpriorityFill = 'rgba(0, 150, 204, 0.2)';
    var boroughsFill = 'rgba(0, 0, 0, 0)';


    /*community district layer*/
    var districtLayer = null;
    var boroughs_layerLayer = null;

    /*map, geocoder*/
    var districtmap, geocoder

    /*list fields here to support schema change for community district layer */
    var priorityDistrictFieldName = "Tax Abatement Priority Area";
    var districtIDFieldName = "boroname_cd";
    var cb_url = "cb_website";
    var cd_profile_url = "profileurl";


     //Basemap Options
     // Currently Active
    var basemap =  L.tileLayer('https://maps{s}.nyc.gov/xyz/1.0.0/carto/basemap/{z}/{x}/{y}.jpg', {
        minNativeZoom: 8,
        maxNativeZoom: 19,
        subdomains: '1234',
        bounds: L.latLngBounds([39.3682, -75.9374], [42.0329, -71.7187])
    });
    var labels = L.tileLayer('https://maps{s}.nyc.gov/xyz/1.0.0/carto/label/{z}/{x}/{y}.png8', {
        attribution: 'basemap by <a href="https://maps.nyc.gov/tiles/">NYC DoITT</a>',
        minNativeZoom: 11,
        maxNativeZoom: 19,
        subdomains: '1234',
        bounds: L.latLngBounds([39.3682, -75.9374], [42.0329, -71.7187])
    });

    /*
        // NOT CURRENTLY USED - Imagery and the labels to go over it. 
        //Will only change add if the right labels can be kept with right basemap
        var imagery2018 = L.tileLayer('https://maps.nyc.gov/xyz/1.0.0/photo/2018/{z}/{x}/{y}.png8', {
        attribution: 'imagery from <a href="https://maps.nyc.gov/tiles/">NYC DoITT</a>',
        minNativeZoom: 11,
        maxNativeZoom: 19,
        subdomains: '1234',
        bounds: L.latLngBounds([39.3682, -75.9374], [42.0329, -71.7187])
        }); 
        var labels_light = L.tileLayer('https://maps.nyc.gov/xyz/1.0.0/carto/label-lt/{z}/{x}/{y}.png', {
        attribution: 'imagery from <a href="https://maps.nyc.gov/tiles/">NYC DoITT</a>',
        minNativeZoom: 11,
        maxNativeZoom: 19,
        subdomains: '1234',
        bounds: L.latLngBounds([39.3682, -75.9374], [42.0329, -71.7187])
        });  
    */



    /*create and load app components*/
    createMap();
    createGeocoder();
    addGeocoderSelectionHandler();
    addLegend();
    

    /*use popup centered in map to convey errors */
    function passErrorToPopup(e){       
        var errorMessage = '<p>There was problem with this app</p>' +
            '<p>'+e+'</p>';
        var errorPopup = L.popup()
            .setLatLng (districtmap.getCenter())
            .setContent(errorMessage)
            .openOn(districtmap)   
    }


    function createMap() {
        var mapOptions = {
            maxBounds: [ [ 39.50,-75.74 ] , [41.752,-71.92]],
            minZoom: 10,
            layers:[basemap, labels]
        }

        //instantiate map
        districtmap = L.map('mapid', mapOptions).setView([40.703312, -73.97968], 10);

        L.control.scale().addTo(districtmap);


        //add boroughs layer
        boroughsLayer = L.geoJSON(null, {
            style: {
                    color: "gray",
                    fillOpacity: 0,
                    weight: 2.5,
                    dashArray: '5,5'
                }
            }).addTo(districtmap);
        

        //add district layer
        districtLayer = L.geoJSON(null, {            
            style: function (feature) {
                    /*conditionally set overlay fill color*/
                    color = priorityFill, color
                    if (feature.properties.grta_priority == "No") {
                        color = nonpriorityFill;
                    }

                    return {fillColor: color,
                            fillOpacity:1,
                            weight:1,
                            color: "gray"};
                    },
            onEachFeature: createDistrictPopup            
            }).addTo(districtmap);
           

        //load data
        addBoroughLayerData(boroughsLayer);
        addDistrictLayerData(districtLayer);
    }

    function createDistrictPopup (feature, layer) {
        // optionally enable inspection of district layer here
        var popupContent = "<big><strong>Community District:</strong> " + feature.properties.boroname_cd + "<br/>" +
            "<strong>Priority Tax Abatement Rate:</strong> " + feature.properties.grta_priority + "<br/>" +
            "<strong><a target='_blank' rel='noopener noreferrer' href=" + feature.properties.cb_website + ">Community District Website</a></strong>" + "<br/>" +
            "<strong><a target='_blank' rel='noopener noreferrer' href=" + feature.properties.profileurl + ">Community District Profile</a></strong></big>";

        layer.bindPopup(popupContent);
    }

    function addLegend(){

        // Add LegendLegend specific
        var legend = L.control({ position: "bottomright" });

        legend.onAdd = function(districtmap) {
            var div = L.DomUtil.create("div", "legend");
            div.innerHTML += "<h4>NYC Green Roof<br/>Tax Abatement Rate</h4>";
            div.innerHTML += '<i1 style="background:' + priorityFill + '"></i1><span>Priority Rate ($15/sq ft)</span><br>';
            div.innerHTML += '<i1 style="background:' + nonpriorityFill + '"></i1><span>Standard Rate ($5.23/sq ft)</span><br>';
            div.innerHTML += '<i1 style="background:' + boroughsFill 
                + '; outline-color:gray; outline-style:dashed; outline-width:2px;"></i1><span>Borough Boundaries</span><br>';
            return div;
        };
        legend.addTo(districtmap);

        
    }

    function addBoroughLayerData(layer){
        //add borough boundary layer - originally sourced from https://www1.nyc.gov/site/planning/data-maps/open-data/districts-download-metadata.page
        layer.addData(boroughs);                
                
            
    }


    function addDistrictLayerData(layer){
        try {
            
            layer.addData(districts);        
   
        } catch(e){
            passErrorToPopup(e);   
        }
    }



    function createGeocoder(){
        try {

            //define geocoder options
            var options = {
                  url: "https://geosearch.planninglabs.nyc/v2",
                  attribution: "geocoding by <a href='https://geosearch.planninglabs.nyc'>NYC Planning</a>", 
                  panToPoint: true,
                  markers: false,
                  textStrings: {
                    INPUT_PLACEHOLDER: 'Enter an NYC Address',
                    INPUT_TITLE_ATTRIBUTE: 'Determine if address is within a Priority Community District for the Green Roof Tax Abatement'
                  }
                }
        
            geocoder = L.control.geocoder(null, options);
            geocoder.setPosition('topright').addTo(districtmap);

        } catch(e){
            passErrorToPopup(e);   
        }
    }



    //create custom marker
    function createMarker(result){
        try {
                markerOptions = {
                    opacity: 1.0
                }

                messageContent = composeMarkerMessage(result);

                marker = new L.Marker(result.latlng, markerOptions)
                    .bindPopup(messageContent)
                    .addTo(districtmap)
                    .openPopup();

                //remove popup on geocoder clear for new search or focus to select from prior results
                geocoder.on('reset', function(e){
                        marker.remove();
                    });

                geocoder.on('focus', function(e){
                        marker.remove();
                    });
        } catch(e){
            passErrorToPopup(e);   
        }

    }


    //handle selection of geocoder result from input
    function addGeocoderSelectionHandler(){
        try {
            geocoder.on('select', function (result) {
              if (result.feature){
                //console.log('You’ve selected ' + result.latlng.lat + ":" + result.latlng.lng);
                //clear and close geocoder
                geocoder.collapse();
                createMarker(result)        
              } else {
                console.log('Address not found')
              }
            });
        } catch(e){
            passErrorToPopup(e);   
        }

    }

    /*set popup message -- input layer object with feature property referencing selected object */
    function composeMarkerMessage (result){
        try  {
        //determine if inside priority district
        //data: [locationstatus, districtid]
        intersectionData = getIntersectionData(result);

        //properties of geocoder result
        var attribs = result.feature.properties;
        var popupMessage = null;

        //if have districtid
        if (intersectionData[1]){
        //success message
            popupMessage =  '<h1 class="popup-header">' + intersectionData[0] + '</h1>' +
            '<p class="popup-message"><big><strong>Address:</strong> ' + attribs.label + '</br>' +
            '<strong>Community District ID:</strong> ' + intersectionData[1] + '</br>' +
            "<strong><a target='_blank' rel='noopener noreferrer' href=" + intersectionData[2] + ">Community District Website</a></strong>" + "<br/>" +
            "<strong><a target='_blank' rel='noopener noreferrer' href=" + intersectionData[3] + ">Community District Profile</a></strong></big>";
            '</p>';
        } else {
        //error message
            popupMessage =  '<h1 class="popup-header"> Community District Not Found </h1>' +
            '<big><strong><p class="popup-message">'+ intersectionData[0]  + 
            ' - There was a problem locating a Community District for:</strong>' + '</br>' +
            attribs.label + '</br></br>' +
            '<i>The address you searched for may be outside of a populated community district.</i>' +
            '</p></big>'
        }

        return popupMessage
        
        } catch(e) {
            passErrorToPopup(e)
        }  

    }

    /*With geocoder result, check for intersection with community district layer; 
    return array with status (in/out priority district), districtid
    */
    function getIntersectionData(result){
        try {
            console.log("location is: " +  result.latlng.toString());

            /*locationStatus outcomes: 
            Yes - intersects priority dist.
            No - intersects non-priority dist.
            No District Found - geocode result does not intersect any district (address error, geocoder error, district geom error)
            Multiple Districts Found - geocoder result intersects overlapping districts (district geom error)
            */
            locationStatus = null;
            districtID = null;
            cb_url_result = null;
            cd_profile_url_result = null;

            //check for district layer
            if (districtLayer) {
                //check for intersection
                var results = leafletPip.pointInLayer(result.latlng, districtLayer);
                var numDistricts = results.length;

                switch(numDistricts){
                    case 0:
                        locationStatus = "No District Found";
                        break;
                    case 1:
                        //Expected: value is "Yes" or "No"
                        locationStatus = results[0].feature.properties[priorityDistrictFieldName]
                        districtID = results[0].feature.properties[districtIDFieldName]
                        cb_url_result = results[0].feature.properties[cb_url]
                        cd_profile_url_result = results[0].feature.properties[cd_profile_url]
                        if (locationStatus == "Yes"){
                            locationStatus = "<small><small>In a Priority District<br/>Priority Rate Applies ($15/sq ft)</small></small>"
                        } else {
                            locationStatus = "<small><small>Not in a Priority District<br/>Standard Rate Applies ($5.23/sq ft)</small></small>"
                        }
                        break;
                    case 2:
                        locationStatus = "Multiple Districts Found"
                        break;
                    default:
                        //problem with numDistricts 
                        locationStatus = "Error locating district"
                        break;

                }
                
            }

            return [locationStatus, districtID, cb_url_result, cd_profile_url_result]

        } catch(e) {

            //todo: provide error notifications with widget
            console.log("Error in getIntersectionData", e)
            

        }
                    
       
    }