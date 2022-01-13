export const config = {
  appName: "web3 concepts",
  icon: "/autodesk-logo-primary-rgb-white.svg",
  github: "https://github.com/thomas-gale/adsk-web3-concepts",
  api: {
    forge: {
      auth: {
        tokenURI: "https://developer.api.autodesk.com/authentication/v2/token",
      },
      apps: [
        {
          name: "primary",
          clientId: process.env.FORGE_CLIENT_ID,
          clientSecret: process.env.FORGE_CLIENT_SECRET,
        },
      ],
      viewer: {
        css: "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.55.1/style.min.css",
        script:
          "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.55.1/viewer3D.min.js",
        examples: {
          gearboxGltf:
            "https://gateway.pinata.cloud/ipfs/Qmaz3RP6BVNNJVPvEFSRjpXyGx6cxwFHHyJUKtX8Ue4r2b/GearboxAssy.gltf",
        },
      },
      translation: {
        modelDerivativeURI:
          "https://developer.api.autodesk.com/modelderivative/v2/designdata",
        pollInterval: 1000,
      },
    },
  },
};
