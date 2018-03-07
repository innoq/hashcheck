const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const path = require("path");

const fs = require('fs')

const FILE = process.env.FILE || "pwned-passwords-ordered-2.0.txt"
const BUFFER_SIZE = process.env.BUFFER_SIZE || 63
const PORT = process.env.PORT || 3000

function binarySearch(fd, buffer, resolve, hash, left, right) {

	let l = left / BUFFER_SIZE
	let r = right / BUFFER_SIZE
	let tmpMid = Math.floor((l + r) / 2)
	let mid = tmpMid * BUFFER_SIZE

  if (left > right) {
		resolve(false)
	}

	fs.read(fd,buffer,0,buffer.length,mid,(error,l,result) => {
		 
      let line = buffer.toString('utf8',0,l)
		  let col = line.split(":")

			if (col[1] != undefined) {
      	col[1] = col[1].trim()
			}

			if(col[0] === hash) {
				resolve(col[1])
			} else if (hash < col[0]) {
				return binarySearch(fd, buffer, resolve, hash, left, mid-BUFFER_SIZE)
			} else {
				return binarySearch(fd, buffer, resolve, hash, mid+BUFFER_SIZE, right)
			}
  })
}	

function search(hash) {

	const stats = fs.statSync(FILE)

	let fd = fs.openSync(FILE,'r')
	let buffer=new Buffer(BUFFER_SIZE)

		return new Promise((resolve, reject) => {
			binarySearch(fd, buffer, resolve, hash, 0, stats.size)
		})
}

app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname,'check.html')))

app.post('/check', (req, res) => {
	let hash = req.body.hash.toUpperCase()
	search(hash).then(count => {
		let result = {known:false}
		if(count!=false) {
			result.known=true
			result.count=count
		} 
		res.json(result)
	}).catch(err => {
		res.json({error:true})
	})
})
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
