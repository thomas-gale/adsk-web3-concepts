# adsk-web3-concepts
An experimental look at how web3 based technologies could interface with Autodesk. Part of Research Engineering Innovation day(s).

Deployed on fleek https://tiny-silence-5016.on.fleek.co/

## IPFS/OrbitDb P2P Browser Notes
- Keep your browser tab's active (e.g. disable brave/chrome discards)
- `brave://discards/` (toggle auto-discard off for localhost/deployed page url)
  
- Wipe db data (brave/chrome)
- `brave://settings/siteData?searchSubpage=localhost&search=clear`

## Heroku based `webrtc-star`
attribution: https://suda.pl/free-webrtc-star-heroku/
  
```shell
# Login to Heroku
$ heroku login
# Login to the Container Registry
$ heroku container:login
# Clone the webrtc-star repo
$ git clone https://github.com/libp2p/js-libp2p-webrtc-star.git
$ cd js-libp2p-webrtc-star
# Create a Heroku app
$ heroku create
# Build and push the image
$ heroku container:push web
# Release the image to your app
$ heroku container:release web
# Scale to one free worker
$ heroku ps:scale web=1
# Open the app in the browser
$ heroku open
```
