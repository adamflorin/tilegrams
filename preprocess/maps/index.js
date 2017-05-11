const fs = require('fs')

const INPUT_PATH = './us-counties-20m-props.topo.json'
const OUTPUT_PATH = './us-counties-20m.topo.json'

const topoJson = JSON.parse(fs.readFileSync(INPUT_PATH))

topoJson.objects.counties.geometries.forEach(geometry => {
  geometry.id = geometry.properties.GEOID
  delete geometry.properties
})

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(topoJson))
