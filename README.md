# HashCheck

HashCheck is basically a simple fork of Troy Hunts Pwned Passwords Service.
You can use it to test a users password against a dictionary file.
The file itself is accessed via a binary search, so searching in Troys ordered 30Gig txt file works fine.

## The Dictionary

Troys password files can be downloaded here: https://haveibeenpwned.com/Passwords
V2 contains 500+ million leaked password hashes.
Please make sure to download the _ordered by hash_ version.

File Format: `hash:value<whitespace-padding>`

## Installtion

Clone repository or Download
Download the ordered password list
`npm install`

## Startup

`FILE=./hashes.txt node app.js`

## Environment Variables

| Parameter   | Description                            | Default                           |
| ---         | ---                                    | ---                               |
| FILE        | Path to the ordered hash database file | ./pwned-passwords-ordered-2.0.txt |
| PORT        | Port for the API to listen on          | 3000                              |
| BUFFER_SIZE | Size of an entry (default 63)          | 63                                |

## Webinterface

The webinterface uses the browsers webcrypto API to send the password SHA1 hashed to the backend.
It displays a warning if the app is not delivered via https.

## API

The API consists of a simple endpoint where you can post a SHA1-Hash for lookup:

```Path: /check
Content-Type: application/json
Payload: {"hash":"40bd001563085fc35165329ea1ff5c5ecbdbbeef"}
Response
JSON
Not known: {"known":false}
Known: {"known":true,"count":"358"}
```

## Run with docker

Build your image:

`docker build -t hashcheck`

Run the container, for example with:

`docker run --rm -ti -p 8080:3000 -v /local/pwned-passwords-ordered-2.0.txt:/usr/src/hashcheck/pwned-passwords-ordered-2.0.txt:ro hashcheck`

Note: The default path for the dictionary inside the container is `/usr/src/hashcheck/`.
If you use this location for your volume mount, you don't have to specifiy the env `FILE` for the container.


## Credits / Authors
- Simon Kölsch, simon.koelsch@innoq.com
- Favicon - https://www.freefavicon.com/freefavicons/objects/iconinfo/pad-lock-152-266970.html
