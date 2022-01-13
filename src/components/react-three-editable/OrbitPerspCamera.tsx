import React from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

export const OrbitPerspCamera = (): JSX.Element => {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 0]}
        up={[0, 0, 1]}
        zoom={1.5}
      />
      <OrbitControls />
    </>
  );
};
