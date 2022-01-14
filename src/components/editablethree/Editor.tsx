import React, { useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { SceneState } from "../../types/editablethree/SceneState";
import { SelectableNode } from "./SelectableNode";
// import { Mesh } from "three";

export interface EditorProps {
  sceneState: SceneState;
  setSceneState: (sceneState: SceneState) => void;
}

export const Editor = ({
  sceneState,
  setSceneState,
}: EditorProps): JSX.Element => {
  const [selectedNode, setSelectedNode] = useState("");

  useEffect(() => {
    console.log("Selected Node ", selectedNode);
  }, [selectedNode]);

  return (
    <group>
      <OrbitControls makeDefault />
      {sceneState.nodes.map((node) => (
        <SelectableNode
          key={node.id}
          node={node}
          selected={node.id === selectedNode}
          onClick={() => setSelectedNode(node.id)}
          onUpdatedPosition={(updatedPosition) =>
            setSceneState({
              ...sceneState,
              nodes: sceneState.nodes.map((n) =>
                n.id === node.id
                  ? {
                      ...n,
                      pos: {
                        x: updatedPosition.x,
                        y: updatedPosition.y,
                        z: updatedPosition.z,
                      },
                    }
                  : n
              ),
            })
          }
        />
      ))}
    </group>
  );
};
