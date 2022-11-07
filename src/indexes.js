
const si = require('search-index')
const path = require('path')
const fs = require('fs')

const indexes = {}

module.exports.getIndex = async (indexName, storePath) => {
  const index = indexes[indexName]
  const basePath = path.join(storePath, '.algolite')
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath)
  }

  if (!index) {
    let indexAsJson
    try {
      indexAsJson = JSON.parse(fs.readFileSync(path.join(basePath, indexName)))
    } catch (err) {
      // Initialize it empty when file does not exists / fails to parse
      indexAsJson = {}
    }
    const searchIndex = await si({
      name: indexName
    })
    await searchIndex.IMPORT(indexAsJson)
    indexes[indexName] = searchIndex
  }

  return indexes[indexName]
}

module.exports.existIndex = (indexName, storePath) => {
  const basePath = path.join(storePath, '.algolite', indexName)

  return fs.existsSync(basePath)
}
