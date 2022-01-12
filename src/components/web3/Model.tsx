import React from "react";
import { useGLTF } from "@react-three/drei";
import { config } from "../../env/config";

export const Model = (): JSX.Element => {
  const gltf = useGLTF(config.data.gearboxGltf);
  useGLTF.preload(config.data.gearboxGltf);
  return (
    <group>
      <primitive object={gltf.scene} />
    </group>
  );
};
