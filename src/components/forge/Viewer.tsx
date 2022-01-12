import React, { useContext, useEffect, useRef } from "react";
import { ViewingContext } from "./ViewingContext";

export interface ViewerProps {
  config?: Autodesk.Viewing.Viewer3DConfig;
  onLoaded?: (viewer: Autodesk.Viewing.GuiViewer3D) => void;
  onError?: (code: number) => void;
}

// Thin wrapper around https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/overview/
// Add your own imperative hook code after GuiViewer object is loaded with the onLoaded callback.
// Place inside a relative layout div.
export const Viewer = ({
  config,
  onLoaded,
  onError,
}: ViewerProps): JSX.Element => {
  const { initialized: viewingContextInitialized } = useContext(ViewingContext);
  const viewerDivRef = useRef<HTMLDivElement>(null);
  const viewer = useRef<Autodesk.Viewing.GuiViewer3D>();

  // Viewer imperative loading code
  useEffect(() => {
    if (viewingContextInitialized && !viewer.current && viewerDivRef.current) {
      viewer.current = new Autodesk.Viewing.GuiViewer3D(
        viewerDivRef.current,
        config
      );
      const startedCode = viewer.current.start();
      if (startedCode > 0) {
        onError && onError(startedCode);
        return;
      }
      viewer.current.setBackgroundColor(51, 51, 51, 51, 51, 51);
      viewer.current.setLightPreset(2);
      if (onLoaded) onLoaded(viewer.current);
    }
  }, [config, onLoaded, onError, viewingContextInitialized]);

  // Viewer destructor
  useEffect(() => {
    return (): void => {
      if (viewer.current) {
        viewer.current.finish();
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          margin: 0,
          width: "100%",
          height: "100%",
        }}
        ref={viewerDivRef}
      />
    </div>
  );
};
