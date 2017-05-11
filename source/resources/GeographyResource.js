import {geoAlbersUsa, geoMercator} from 'd3-geo'

import usTopoJson from '../../maps/us/us-110m.topo.json'
import usCountyTopoJson from '../../maps/us/us-counties-20m.topo.json'
// import ukConstituencyTopoJson from '../../maps/uk/constituency.topo.json'
// import ukAuthorityTopoJson from '../../maps/uk/local-authority.topo.json'
import germanyConstituencyTopoJson from '../../maps/germany/constituency.topo.json'
import franceRegionTopoJson from '../../maps/france/region.topo.json'
import franceDepartmentTopoJson from '../../maps/france/department.topo.json'
import MapResource from './MapResource'
import fipsHash from '../../data/us/fips-to-state.json'
import fipsUsCountyHash from '../../data/us/fips-to-county.json'
// import fidHash from '../../data/uk/fid-to-constituency.json'
// import authorityIdHash from '../../data/uk/id-to-authority.json'
import wkrHash from '../../data/germany/wkr-to-name.json'
import regionHash from '../../data/france/region-to-name.json'
import departmentHash from '../../data/france/department-to-name.json'

const usProjection = (canvasDimensions) => {
  return geoAlbersUsa()
    .scale(canvasDimensions.width)
    .translate([
      canvasDimensions.width * 0.5,
      canvasDimensions.height * 0.5,
    ])
}

const usCountyProjection = (canvasDimensions) => {
  return geoMercator()
    .center([-90, 38])
    .scale(canvasDimensions.height * 1.0)
    .translate([
      canvasDimensions.width * 0.5,
      canvasDimensions.height * 0.5,
    ])
}

// const ukProjection = (canvasDimensions) => {
//   return geoMercator()
//     .center([-2, 55.7])
//     .scale(canvasDimensions.height * 2.9)
//     .translate([
//       canvasDimensions.width * 0.5,
//       canvasDimensions.height * 0.5,
//     ])
// }

const germanyProjection = (canvasDimensions) => {
  return geoMercator()
    .center([11, 51.2])
    .scale(canvasDimensions.height * 3.9)
    .translate([
      canvasDimensions.width * 0.5,
      canvasDimensions.height * 0.5,
    ])
}

const franceProjection = (canvasDimensions) => {
  return geoMercator()
    .center([3.4, 46.3])
    .scale(canvasDimensions.height * 3.4)
    .translate([
      canvasDimensions.width * 0.5,
      canvasDimensions.height * 0.5,
    ])
}

class GeographyResource {
  constructor() {
    this._geographies = [
      {
        label: 'United States',
        mapResource: new MapResource(usTopoJson, 'states'),
        geoCodeToName: fipsHash,
        projection: usProjection,
      },
      {
        label: 'United States - Counties',
        mapResource: new MapResource(usCountyTopoJson, 'counties'),
        geoCodeToName: fipsUsCountyHash,
        projection: usCountyProjection,
      },
      // {
      //   label: 'United Kingdom - Constituencies',
      //   mapResource: new MapResource(ukConstituencyTopoJson, 'constituencies'),
      //   geoCodeToName: fidHash,
      //   projection: ukProjection,
      // },
      // {
      //   label: 'United Kingdom - Local Authorities',
      //   mapResource: new MapResource(ukAuthorityTopoJson, 'authorities'),
      //   geoCodeToName: authorityIdHash,
      //   projection: ukProjection,
      {
        label: 'Germany - Constituencies',
        mapResource: new MapResource(germanyConstituencyTopoJson, 'constituencies'),
        geoCodeToName: wkrHash,
        projection: germanyProjection,
      },
      {
        label: 'France - Regions',
        mapResource: new MapResource(franceRegionTopoJson, 'regions'),
        geoCodeToName: regionHash,
        projection: franceProjection,
      },
      {
        label: 'France - Departments',
        mapResource: new MapResource(franceDepartmentTopoJson, 'departments'),
        geoCodeToName: departmentHash,
        projection: franceProjection,
      },
    ]
  }

  getMapResource(label) {
    return this._geographies.find(geography => geography.label === label).mapResource
  }

  getGeographies() {
    return this._geographies
  }

  getGeoCodeHash(label) {
    return this._geographies.find(geography => geography.label === label).geoCodeToName
  }

  getProjection(label, canvasDimensions) {
    const nullProjection = d => d
    if (!label) { return nullProjection }
    const projectionFn = this._geographies.find(geography => geography.label === label).projection
    return projectionFn(canvasDimensions)
  }
}

export default new GeographyResource()
