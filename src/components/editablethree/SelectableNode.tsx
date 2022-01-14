import React, { useEffect } from "react";
import * as THREE from "three";
import { TransformControls, Box, Cylinder, Sphere } from "@react-three/drei";
import { TransformControls as TransformControlsImpl } from "three-stdlib";
import { Node } from "../../types/editablethree/SceneState";

export interface SelectableProps {
  node: Node;
  selected: boolean;
  onUpdatedPosition: (updatedPosition: THREE.Vector3) => void;
  onClick: () => void;
}

export const SelectableNode = ({
  node,
  selected,
  onUpdatedPosition,
  onClick,
}: SelectableProps): JSX.Element => {
  const transRef = React.useRef<TransformControlsImpl>(null);
  const meshRef = React.useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (selected) {
      console.log(`node ${node.id} selected`);
      if (transRef.current && meshRef.current) {
        transRef.current.attach(meshRef.current);
      }
    } else {
      console.log(`node ${node.id} unselected`);
      if (transRef.current && meshRef.current) {
        transRef.current.detach();
      }
    }
  }, [node.id, selected]);

  return (
    <>
      <TransformControls
        ref={transRef}
        onChange={(e) => onUpdatedPosition(e?.target.worldPosition)}
      />
      {node.type === "cube" && (
        <Box
          ref={meshRef}
          onClick={onClick}
          position={[node.pos.x, node.pos.y, node.pos.z]}
        >
          <meshStandardMaterial color="red" />
        </Box>
      )}
      {node.type === "cylinder" && (
        <Cylinder
          ref={meshRef}
          onClick={onClick}
          position={[node.pos.x, node.pos.y, node.pos.z]}
        >
          <meshStandardMaterial color="blue" />
        </Cylinder>
      )}{" "}
      {node.type === "sphere" && (
        <Sphere
          ref={meshRef}
          onClick={onClick}
          position={[node.pos.x, node.pos.y, node.pos.z]}
        >
          <meshStandardMaterial color="green" />
        </Sphere>
      )}
      )
    </>
  );
};
