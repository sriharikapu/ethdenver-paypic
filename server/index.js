const http = require('http')
const fs = require('fs')
const randomstring = require('randomstring')

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url) {
    fs.readFile('.' + req.url, (err, img) => {
      if (err || !img) return res.end()
      res.writeHead(200, { 'Content-Type': 'image/png' })
      res.write(img, 'binary')
      res.end()
    })
    return
  }

  collectRequestData(req, (body) => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    const uniqueUri = randomstring.generate(5) + '.png'
    fs.writeFileSync('./' + uniqueUri, body, 'base64')
    res.write(JSON.stringify({ url: uniqueUri }))
    res.end()
  })
})

server.listen(8080)

function collectRequestData(request, callback) {
  let body = ''
  request.on('data', chunk => {
      body += chunk.toString()
  })
  request.on('end', () => {
      callback(body)
  })
}