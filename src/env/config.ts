export const config = {
  appName: "web3 concepts",
  icon: "/autodesk-logo-primary-rgb-white.svg",
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
          shaverSVF:
            "https://developer-autodesk.github.io/translated-models/shaver/0.svf",
        },
      },
      translation: {
        modelDerivativeURI:
          "https://developer.api.autodesk.com/modelderivative/v2/designdata",
        pollInterval: 1000,
      },
    }
  }
};
