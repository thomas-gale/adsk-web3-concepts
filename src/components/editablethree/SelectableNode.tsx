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
  const ref = React.useRef<TransformControlsImpl>(null);

  // useEffect(() => {
  //   ref.current?.position.set(
  //     children?.props.position.x ?? 0,
  //     children?.props.position.y ?? 0,
  //     children?.props.position.z ?? 0
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (selected) {
      console.log(`node ${node.id} selected`);
    } else {
      console.log(`node ${node.id} unselected`);
    }
  }, [selected]);

  return (
    <>
      <TransformControls
        ref={ref}
        onChange={(e) => onUpdatedPosition(e?.target.worldPosition)}
      />
      {node.type === "cube" && (
        <Box onClick={onClick} position={[node.pos.x, node.pos.y, node.pos.z]}>
          <meshStandardMaterial color="red" />
        </Box>
      )}
      {node.type === "cylinder" && (
        <Cylinder
          onClick={onClick}
          position={[node.pos.x, node.pos.y, node.pos.z]}
        >
          <meshStandardMaterial color="blue" />
        </Cylinder>
      )}{" "}
      {node.type === "sphere" && (
        <Sphere
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
