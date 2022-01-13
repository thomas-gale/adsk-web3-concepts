/* eslint-disable @typescript-eslint/no-namespace */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { config } from "../../env/config";
import { Box } from "@mui/material";
import { Viewer } from "../forge/Viewer";
import { ViewingContextProvider } from "../forge/ViewingContext";

export const Dashboard = (): JSX.Element => {
  const experimentWithGearboxModel = useCallback(
    (viewer: Autodesk.Viewing.GuiViewer3D) => {
      viewer.loadModel(config.api.forge.viewer.examples.gearboxGltf, {});
    },
    []
  );

  return (
    <ViewingContextProvider options={{ env: "Local" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 1, m: 1 }}>
          <p>
            Data stored on IPFS through gateway:{" "}
            <a href={config.api.forge.viewer.examples.gearboxGltf}>
              {config.api.forge.viewer.examples.gearboxGltf}
            </a>
          </p>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Viewer
            config={{
              extensions: ["Autodesk.Viewing.SceneBuilder", "Autodesk.glTF"],
            }}
            onLoaded={experimentWithGearboxModel}
          />
        </Box>
      </Box>
    </ViewingContextProvider>
  );
};
