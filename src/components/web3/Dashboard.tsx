import React, { useCallback } from "react";
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
            <ul>
              <li>
                Gearbox data (currently un-encrypted) stored on IPFS through{" "}
                <a href={config.api.forge.viewer.examples.gearboxGltf}>
                  gateway
                </a>
              </li>
              <li>
                Page deployed on IPFS using{" "}
                <a href="https://fleek.co/">fleek</a>
              </li>
            </ul>
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
