import React, { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Editor } from "./Editor";

export const Viewport = (): JSX.Element => {
  const [sceneState, setSceneState] = useState({
    object1pos: new THREE.Vector3(0, 0, 0),
    object2pos: new THREE.Vector3(1, 0, 0),
  });

  useEffect(() => {
    console.log("SceneState", sceneState);
  }, [sceneState]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="z-50 absolute flex">
        <div className="m-4 p-4 rounded-xl bg-dark bg-opacity-60">
          Hello World
        </div>
      </div>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Editor sceneState={sceneState} setSceneState={setSceneState} />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
};
