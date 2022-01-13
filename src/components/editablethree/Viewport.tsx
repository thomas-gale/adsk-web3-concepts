import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader, OrbitControls } from "@react-three/drei";
import { Editor } from "./Editor";

export const Viewport = (): JSX.Element => {
  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Editor />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
};
