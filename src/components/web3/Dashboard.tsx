import React, { useCallback, useRef } from "react";
import { config } from "../../env/config";
import { Box, Button } from "@mui/material";
import { Viewer } from "../forge/Viewer";
import { ViewingContextProvider } from "../forge/ViewingContext";

export const Dashboard = (): JSX.Element => {
  const viewer = useRef<Autodesk.Viewing.GuiViewer3D>();

  const onViewerLoaded = useCallback((v: Autodesk.Viewing.GuiViewer3D) => {
    viewer.current = v;
  }, []);

  const clearModels = useCallback(() => {
    if (viewer.current) {
      viewer.current.getAllModels().forEach((model) => {
        viewer.current?.unloadModel(model);
      });
    }
  }, []);

  const loadModel = useCallback(() => {
    if (viewer.current) {
      viewer.current.loadModel(
        config.api.forge.viewer.examples.gearboxGltf,
        {}
      );
    }
  }, []);

  return (
    <ViewingContextProvider options={{ env: "Local" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 1, m: 1 }}>
          <Box>
            Page deployed on IPFS using <a href="https://fleek.co/">fleek</a>
            <Button sx={{ m: 1 }} variant="outlined" onClick={clearModels}>
              Clear Models
            </Button>
          </Box>
          <Box>
            Gearbox data (currently un-encrypted) stored on IPFS through{" "}
            <a href={config.api.forge.viewer.examples.gearboxGltf}>gateway</a>
            <Button sx={{ m: 1 }} variant="outlined" onClick={loadModel}>
              Load Model
            </Button>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Viewer
            config={{
              extensions: ["Autodesk.Viewing.SceneBuilder", "Autodesk.glTF"],
            }}
            onLoaded={onViewerLoaded}
          />
        </Box>
      </Box>
    </ViewingContextProvider>
  );
};
