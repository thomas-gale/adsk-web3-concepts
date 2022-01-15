export const config = {
  appName: "web3 concepts",
  icon: "/autodesk-logo-primary-rgb-white.svg",
  github: "https://github.com/thomas-gale/adsk-web3-concepts",
  ipfs: {
    webRtcStarServer:
      "/dns4/boiling-wildwood-67837.herokuapp.com/tcp/443/wss/p2p-webrtc-star/",
    gateway: {
      exampleDir:
        "https://gateway.pinata.cloud/ipfs/Qmaz3RP6BVNNJVPvEFSRjpXyGx6cxwFHHyJUKtX8Ue4r2b",
      exampleGearboxGltf:
        "https://gateway.pinata.cloud/ipfs/Qmaz3RP6BVNNJVPvEFSRjpXyGx6cxwFHHyJUKtX8Ue4r2b/GearboxAssy.gltf",
    },
  },
  api: {
    forge: {
      viewer: {
        css: "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.55.1/style.min.css",
        script:
          "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.55.1/viewer3D.min.js",
      },
    },
  },
};
