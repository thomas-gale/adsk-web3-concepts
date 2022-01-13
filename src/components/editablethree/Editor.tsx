import {
  Dodecahedron,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import React, { useState } from "react";

export const Editor = (): JSX.Element => {
  const [suppressOrbit, setSuppressOrbit] = useState(false);

  return (
    <group>
      <OrbitControls enabled={!suppressOrbit} />
      <TransformControls
        onMouseDown={() => setSuppressOrbit(true)}
        onMouseUp={() => setSuppressOrbit(false)}
      >
        <Dodecahedron>
          <meshBasicMaterial attach="material" color="gray" wireframe />
        </Dodecahedron>
      </TransformControls>
    </group>
  );
};
