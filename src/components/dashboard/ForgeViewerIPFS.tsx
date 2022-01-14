import React, { useCallback, useRef } from "react";
import { config } from "../../env/config";
import { Button } from "../elements/Button";
import { Viewer } from "../forge/Viewer";
import { ViewingContextProvider } from "../forge/ViewingContext";

export const ForgeViewerIPFS = (): JSX.Element => {
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
      <div className="flex flex-col h-full">
        <div className="p-1 m-1">
          <div>
            Gearbox data (currently un-encrypted) stored on IPFS through{" "}
            <a href="https://gateway.pinata.cloud/ipfs/Qmaz3RP6BVNNJVPvEFSRjpXyGx6cxwFHHyJUKtX8Ue4r2b">
              gateway
            </a>
            <Button mode="light" className="m-1" onClick={loadModel}>
              Load Model
            </Button>
          </div>
          <div>
            <Button mode="light" className="m-1" onClick={clearModels}>
              Clear Models
            </Button>
          </div>
        </div>
        <div className="flex-grow">
          <Viewer
            config={{
              extensions: ["Autodesk.Viewing.SceneBuilder", "Autodesk.glTF"],
            }}
            onLoaded={onViewerLoaded}
          />
        </div>
      </div>
    </ViewingContextProvider>
  );
};
