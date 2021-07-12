# NYC Green Roof Tax Abatement - Priority Area Webmap

Developed by [The Nature Conservancy in New York](https://www.nature.org/en-us/about-us/where-we-work/united-states/new-york/), Cities Program, with support from our Data Science team.

Read about our work to map the Green Roofs in NYC [here](https://www.nature.org/en-us/about-us/where-we-work/united-states/new-york/stories-in-new-york/green-roofs-new-york-city/) and about Sustainable Roofing Laws in NYC [here](https://www.nature.org/en-us/about-us/where-we-work/united-states/new-york/stories-in-new-york/nyc-laws-green-roofs-solar-panels/).

If you have questions about this tool or similar efforts, reach out to Mike Treglia, Lead Scientist of Cities Program with The Nature Conservancy in New York at michael.treglia@tnc.org.

 ## Intended Use
 
 This web-app is designed to enable users to enter an address using the address-search functionality, and identify: 1) what Community District the address falls within; and 2) whether the respective Communinity District falls is considered a Priority Area for the Green Roof Tax Abatement (GRTA). While which Community Districts are considered priority areas for the GRTA are available with the [Final Rule on the GRTA from the NYC Mayor's Office of Sustainability](https://www1.nyc.gov/site/sustainability/legislation/legislation-rules.page), until now there has been no easy-to-use tool developed that enables users to quickly identify, visually or by address, whether properties are in Priority Areas. Thus, this fills a gap in accessibility of information, and hope this enables use of the GRTA.

 *Note - this tool is intended for informational purposes only and users should verify their Community District and eligibility for the GRTA within Priority Areas with official City sources. The work is provided "as is," without warranty. See the [License](LICENSE.md), and [The Nature Conservancy's Tems of Use](https://www.nature.org/en-us/about-us/who-we-are/accountability/terms-of-use/) and [Privacy Statement](https://www.nature.org/en-us/about-us/who-we-are/accountability/privacy-policy/) for more full disclaimers.*


 ## Where to find it and how to use

 This tool is avaialble live, embedded in [the NYC Green Roof Roof Researchers Alliance Website]() [Fill this in]. A full-page version is also available at [to be filled in]()

 Users can also download or clone this repository and run a local http-server (e.g., via [NPM http-server](https://www.npmjs.com/package/http-server)) to run a functional version of this tool loally. 

 Users can click on individual Community Districts for information about which District it is, whether it is a Priority Area for the GRTA, and for links to the respective Community Board webpages and the associated Community District Profiles. Whether Community Districts are Priority Areas for the GRTA is also color-coded, as denoted by the legend in the lower right corner.
 
 To search for addresses, users can click on the magnifying glass icon in the upper-right corner of the tool, and search for a NYC address. Only NYC addresses will work, and this leverages a NYC-specific tool. The address will be marked by a pop-up on the map, which will indicate whether the address falls in the boundaries of a Priority Area, and also provide additional information about the Community District.


## Dependencies

This work relies on the following packages and libraries (all sourced from CDN or similar sources). Please see documentation for the respective packages and libraries for licensing and other details:
- [Leaflet](https://leafletjs.com/) (version 1.7.1) - This is the  underlying webmapping library we leveraged.
- [NYC Planning Labs geocoder](https://geosearch.planninglabs.nyc/docs/) - a NYC-specific geocoding system that returns spatial coordinates based on address search, developed by the NYC Department of City Planning. Note, Input with autocomplete enabled. The map extent and zoom levels are contrained.  The geocoder API prioritizes addresses within the active map extent.
- [Leaflet Pelias geocoder plugin](https://github.com/pelias/leaflet-plugin) - A plugin for Leaflet that enables Pelias-based geocoding engines (such as the NYC Planning Labs geocoder) to be easily embeded in Leaflet webmaps.
- [jquery](https://jquery.com/download/) (version 3.6) - Library, that in this case, enables import of geojson files to leaflet for visualization and overlay analyses.
- [Leaflet point-in-polygon plugin](https://github.com/mapbox/leaflet-pip) - a plug-in for Leaflet that enables point-in-polygon overlay analyses (to determine what Community District individual addresses fall within). This plugin is  Copyright (c) 2017, Mapbox, All rights reserved.


## Associated Data

This work also relies on two datasets (stored in the [./data](./data) folder). Download and processing of these datasets for this tool was done in R, with Code available in the [./R](./R) folder.

- NYC Community District geojson file with indications of whether each Community District is a Priority Area for the GRTA, and links to the Community Board Website and the respective [NYC Planning - Community District Profiles](https://communityprofiles.planning.nyc.gov/). Original Source datasets are available from the City of New York, noted below, and this specific version, as available here, is available under a [Attribution-NonCommercial-ShareAlike 4.0 License](https://creativecommons.org/licenses/by-nc-sa/4.0/).
    - The spatial data were sourced from the geojson file of Community District Boundaries (clipped to shoreline) available from [NYC Planning - Bytes of the Big Apple](https://www1.nyc.gov/site/planning/data-maps/open-data/districts-download-metadata.page).
    - Coding of whether Community Districts were designated as Priority Areas for the GRTA was based on the [Final Rule on the GRTA from the NYC Mayor's Office of Sustainability](https://www1.nyc.gov/site/sustainability/legislation/legislation-rules.page).
    - Links to the Community Board Website were leveraged from the Indicators Data available for download from the [Community District Profiles](https://communityprofiles.planning.nyc.gov/).
- NYC Borough Boundaries were sourced from the geojson file Borough Boundaries (Clipped to Shoreline) available from [NYC Planning -  Bytes of the Big Apple](https://www1.nyc.gov/site/planning/data-maps/open-data.page#district_political).


## Reporting Issues
If you experience issues with this tool, please report. Our preference is that users file an issue, with as much info as possible [via the issues tab here]](https://github.com/tnc-ny-science/NYC_GRTA_PriorityCDMap/issues). Include Browser and version, and clear description of the issue including:
 - Expected behavior
 - Observed behavior
 - Screenshots as possible and seems useful
 - Detail of how you are triggering the observed behavior (e.g., "click on magnifying glass icon...")

 Alternatively, users can email michael.treglia@tnc.org with issues they are experiencing. 