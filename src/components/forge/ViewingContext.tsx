import React, { PropsWithChildren, useEffect, useState } from "react";
import Script from "next/script";
import { config } from "../../env/config";

export const ViewingContext = React.createContext({
  initialized: false,
});

export interface ViewingContextProps {
  options: Autodesk.Viewing.InitializerOptions;
}

// Place a single global ViewingContextProvider component around the common root of all your Autodesk.Viewing (LMV) components.
// https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/overview/
export const ViewingContextProvider = ({
  options,
  children,
}: PropsWithChildren<ViewingContextProps>): JSX.Element => {
  const [scriptLoaded, setScriptLoaded] = useState(
    typeof window !== "undefined" &&
      window.Autodesk?.Viewing?.Initializer !== undefined
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (scriptLoaded && !initialized) {
      Autodesk.Viewing.Initializer(options, () => setInitialized(true));
    }
    // Disabled script shutdown due to issue with d'tor in viewer3D.min.js scripts (uncaught TypeError: Cannot read properties of undefined (reading 'doOperation') at M.asyncPropertyOperation (developer.api.autodesk.com/modelderivative/v2/viewers/7.52.0/viewer3D.min.js:19))
    // If bad leaks are detected - re-address this issue (however a cursory profile in chrome seems to show nothing substantial)
    // return () => {
    //   if (scriptLoaded && initialized) {
    //     Autodesk.Viewing.shutdown();
    //     setInitialized(false);
    //   }
    // };
  }, [options, initialized, scriptLoaded]);

  return (
    <ViewingContext.Provider value={{ initialized }}>
      <link
        rel="stylesheet"
        href={config.api.forge.viewer.css}
        type="text/css"
      />
      <Script
        async
        src={config.api.forge.viewer.script}
        onLoad={(): void => setScriptLoaded(true)}
      />
      {children}
    </ViewingContext.Provider>
  );
};
