# REQUIREMENTS:
# brew install gdal
# npm install -g topojson

# Download shapefiles from U.S. Census at:
# https://www.census.gov/geo/maps-data/data/cbf/cbf_counties.html

# Convert shapefile to GeoJSON
ogr2ogr -f GeoJSON us-counties-20m.geojson cb_2016_us_county_20m/cb_2016_us_county_20m.shp

# Convert GeoJSON to TopoJSON
# -q is quantization, set in powers of 10. 10000 is conservatively high.
geo2topo -q 10000 counties=us-counties-20m.geojson > us-counties-20m-props.topo.json

# Clean up TopoJSON properties
node index.js
