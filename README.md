STARTING THE APP IN DEV MODE
----------------------------

In the project directory, you can run:

### `npm start`

which uns the app in the development mode at localhost:19006.
Open http://localhost:19006 to view it in the browser.


TESTING THE APP
---------------

### `npm test`

launches the test runner in the interactive watch mode.


BUILDING THE APP
----------------

### `npm run build`

builds the app for production to the `build` folder. NOTE that it is not /web-build.
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.\

BASEMAP
-------

The basemap used in the app is specified in the .env files. Currently it is the value of
REACT_APP_MAPBOX_SATELLITE_BASEMAP. It may be changed, for example, to the value of 
REACT_APP_MAPBOX_CUSTOM_STREET_BASEMAP, which is a a Stout's custome map including the 
field boundaries for all T&A's farms in Monterey County. 

The geojson file for this custom map was downloaded at 
https://apps.co.monterey.ca.us/CountyWebsite/AgComm/RanchMaps/ACO2020RanchMapPickpage89pg.htm