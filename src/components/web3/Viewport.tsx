import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader, OrbitControls } from "@react-three/drei";

export const Viewport = (): JSX.Element => {
  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial wireframe />
          </mesh>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
};
