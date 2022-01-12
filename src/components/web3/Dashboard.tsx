/* eslint-disable @typescript-eslint/no-namespace */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { config } from "../../env/config";
import { Box } from "@mui/material";
import { Viewer } from "../forge/Viewer";
import { ViewingContextProvider } from "../forge/ViewingContext";

export const Dashboard = (): JSX.Element => {
  const viewerRef = useRef<Autodesk.Viewing.GuiViewer3D>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rawModelData, setRawModelData] = useState<any>();

  const experimentWithGearboxModel = useCallback(
    (viewer: Autodesk.Viewing.GuiViewer3D) => {
      // Assign ref
      viewerRef.current = viewer;

      // Experiment 1
      console.log("a. Load data from static resource");
      viewer.loadModel(
        window.origin + config.api.forge.viewer.examples.gearboxGltf,
        {},
        () => {
          viewer.getAllModels().forEach((model) => {
            console.log(model);
            console.log("b. Write the raw data to a local variable.");
            setRawModelData(model);
          });
        }
      );
    },
    []
  );

  useEffect(() => {
    (async (): Promise<void> => {
      if (viewerRef.current && rawModelData) {
        console.log("c. Unload the model");
        // viewerRef.current.unloadModel(rawModelData);

        console.log("d. Load raw model");
        // await viewerRef.current.loadExtension("Autodesk.Viewing.SceneBuilder");
        const ext = viewerRef.current.getExtension(
          "Autodesk.Viewing.SceneBuilder"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any;
        const modelBuilder = await ext.addNewModel({
          conserveMemory: false,
          modelNameOverride: "My Model Name",
        });
        console.log(modelBuilder);
        // viewer.load
      }
    })();
  }, [rawModelData]);

  return (
    <ViewingContextProvider options={{ env: "Local" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 1, m: 1 }}>
          <p>
            Hello Web3
            <ul>
              <li>loading static gltf resource (done)</li>
              <li>store resource on ipfs (todo)</li>
              <li>download resource from ipfs (todo)</li>
              <li>create (todo)</li>
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
