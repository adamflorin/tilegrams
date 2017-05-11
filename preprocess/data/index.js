const fs = require('fs')
const parse = require('csv-parse')
const numeral = require('numeral')
const abbreviate = require('abbreviate')

// Download fresh US Census county-level population data at:
// https://www.census.gov/data/tables/2016/demo/popest/counties-total.html
const INPUT_PATH = './data/co-est2016-alldata.csv'

const TILEGRAM_DATA_PATH = './data/population-by-county.csv'
const FIPS_HASH_PATH = './data/fips-to-county.json'

/** Format Tilegrams data CSV (FIPS,population) from U.S. census data */
function parseTilegramsData() {
  parse(
    fs.readFileSync(INPUT_PATH),
    {
      columns: true,
      auto_parse: true
    },
    (error, rows) => {
      const tilegramRows = []
      rows.forEach(row => {
        if (row.COUNTY === 0) {
          return
        }
        tilegramRows.push(`${formatFips(row)},${row.POPESTIMATE2016}`)
      })
      fs.writeFileSync(TILEGRAM_DATA_PATH, tilegramRows.join('\n'))
    }
  )
}

/** Format FIPS-to-human-name lookup table from U.S. census data */
function parseFipsHash() {
  parse(
    fs.readFileSync(INPUT_PATH),
    {
      columns: true,
      auto_parse: true
    },
    (error, rows) => {
      const fipsHash = {}
      rows.forEach(row => {
        if (row.COUNTY === 0) {
          return
        }
        const abbreviatedName = abbreviate(
          row.CTYNAME.replace(/ County$/, ''),
          {length: 3}
        )
        fipsHash[formatFips(row)] = {
          name: `${row.CTYNAME}, ${row.STNAME}`,
          name_short: `${abbreviatedName}.`
        }
      })
      fs.writeFileSync(
        FIPS_HASH_PATH,
        JSON.stringify(fipsHash, null, '  ')
      )
    }
  )
}

/** Format five-digit FIPS code from state and county codes */
function formatFips(row) {
  return numeral(row.STATE).format('00') + numeral(row.COUNTY).format('000')
}

// parseTilegramsData()
// parseFipsHash()
