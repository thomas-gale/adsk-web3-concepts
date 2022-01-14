import React from "react";
import * as THREE from "three";
import { Box, Cylinder, OrbitControls, Sphere } from "@react-three/drei";
import { SceneState } from "../../types/editablethree/SceneState";

export interface EditorProps {
  sceneState: SceneState;
  setSceneState: (sceneState: SceneState) => void;
}

export const Editor = ({ sceneState }: EditorProps): JSX.Element => {
  return (
    <group>
      <OrbitControls makeDefault />
      {sceneState.nodes.map((node) => {
        if (node.type === "cube") {
          return (
            <Box
              key={node.id}
              position={new THREE.Vector3(node.pos.x, node.pos.y, node.pos.z)}
            >
              <meshStandardMaterial color="red" />
            </Box>
          );
        } else if (node.type === "cylinder") {
          return (
            <Cylinder
              key={node.id}
              position={new THREE.Vector3(node.pos.x, node.pos.y, node.pos.z)}
            >
              <meshStandardMaterial color="blue" />
            </Cylinder>
          );
        } else if (node.type === "sphere") {
          return (
            <Sphere
              key={node.id}
              position={new THREE.Vector3(node.pos.x, node.pos.y, node.pos.z)}
            >
              <meshStandardMaterial color="green" />
            </Sphere>
          );
        }
      })}
    </group>
  );
};
