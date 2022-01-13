import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { TransformControls as TransformControlsImpl } from "three-stdlib";
import {
  Cylinder,
  Dodecahedron,
  OrbitControls,
  TransformControls,
} from "@react-three/drei";
import { SceneState } from "../../types/editablethree/SceneState";

export interface EditorProps {
  sceneState: SceneState;
  setSceneState: (sceneState: SceneState) => void;
}

export const Editor = ({
  sceneState,
  setSceneState,
}: EditorProps): JSX.Element => {
  const transformControls1 = useRef<TransformControlsImpl>(null);
  const transformControls2 = useRef<TransformControlsImpl>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const object1 = useRef<any>(null);

  useEffect(() => {
    if (transformControls1.current) {
      // transformControls1.current.update();
      transformControls1.current.position.set(
        sceneState.object1pos.x,
        sceneState.object1pos.y,
        sceneState.object1pos.z
      );
    }
    if (transformControls2.current) {
      // transformControls2.current.update();
      transformControls2.current.position.set(
        sceneState.object2pos.x,
        sceneState.object2pos.y,
        sceneState.object2pos.z
      );
    }
  }, [sceneState]);

  return (
    <group>
      <OrbitControls makeDefault />
      <group>
        <TransformControls
          ref={transformControls1}
          onChange={(e) => {
            if (e?.target) {
              const pos = e.target.offset;
              object1.current.position.set(pos.x, pos.y, pos.z);
              setSceneState({
                ...sceneState,
                object1pos: object1.current.position,
              });
            }
          }}
        >
          <Dodecahedron ref={object1} position={sceneState.object1pos}>
            <meshStandardMaterial attach="material" color="gray" />
          </Dodecahedron>
        </TransformControls>
      </group>
      <group>
        <TransformControls ref={transformControls2}>
          <Cylinder position={sceneState.object2pos}>
            <meshStandardMaterial attach="material" color="pink" />
          </Cylinder>
        </TransformControls>
      </group>
    </group>
  );
};
