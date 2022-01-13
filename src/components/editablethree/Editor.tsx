import {
  Dodecahedron,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import React, { Ref, useRef, useState } from "react";

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
          <meshBasicMaterial attach="material" color="hotpink" wireframe />
        </Dodecahedron>
      </TransformControls>
    </group>
  );
};
