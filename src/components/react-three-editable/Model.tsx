import React from "react";
import { useGLTF } from "@react-three/drei";
import { config } from "../../env/config";

export const Model = (): JSX.Element => {
  const gltf = useGLTF(config.api.forge.viewer.examples.gearboxGltf);
  useGLTF.preload(config.api.forge.viewer.examples.gearboxGltf);
  return (
    <group>
      <primitive object={gltf.scene} />
    </group>
  );
};
