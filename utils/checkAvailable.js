const urlModel = require('../models/url')

async function checkAvailable(shortUrl) {
  let result = true
  await urlModel.findOne({ short_url: shortUrl }).exec((err, data) => {
      if (err) {
        console.error(err)
        res.json(err)
        return
      }
      if (data) {
        result = false
      }
    })
  
  return result
}

module.exports = checkAvailable