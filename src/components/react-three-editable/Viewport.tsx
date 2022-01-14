import React from "react";
import { Canvas } from "@react-three/fiber";
import { editable as e, configure, EditableState } from "react-three-editable";

// Import your previously exported state
import editableState from "./editableState.json";

const bind = configure({
  // Enables persistence in development so your edits aren't discarded when you close the browser window
  enablePersistence: true,
  // Useful if you use r3e in multiple projects
  localStorageNamespace: "Example",
});

export function Viewport() {
  return (
    <Canvas onCreated={bind({ state: editableState as EditableState })}>
      <ambientLight intensity={0.5} />
      {/* Mark objects as editable. */}
      {/* Properties in the code are used as initial values and reset points in the editor. */}
      {/* @ts-ignore */}
      <e.spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        uniqueName="Spotlight"
      />
      {/* @ts-ignore */}
      <e.pointLight uniqueName="PointLight" />
      {/* @ts-ignore */}
      <e.mesh uniqueName="Box">
        <boxBufferGeometry />
        <meshStandardMaterial color="orange" />
      </e.mesh>
    </Canvas>
  );
}
