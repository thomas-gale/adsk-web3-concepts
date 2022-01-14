import React from "react";
import * as THREE from "three";
import {
  Box,
  Cylinder,
  OrbitControls,
  Sphere,
  TransformControls,
} from "@react-three/drei";
import { SceneState } from "../../types/editablethree/SceneState";
import { Selectable } from "./Selectable";
// import { Mesh } from "three";

export interface EditorProps {
  sceneState: SceneState;
  setSceneState: (sceneState: SceneState) => void;
}

export const Editor = ({
  sceneState,
  setSceneState,
}: EditorProps): JSX.Element => {
  // const [selectedNode, setSelectedNode] = useState("");
  // // const nodeMap = useRef<Map<string, THREE.Mesh>>(new Map());

  // // // const selectedNode = useRef<Mesh>(null);

  // useEffect(() => {
  //   console.log("Selected Node ", selectedNode);
  // }, [selectedNode]);

  return (
    <group>
      <OrbitControls makeDefault />
      <TransformControls />
      {sceneState.nodes.map((node) => {
        if (node.type === "cube") {
          return (
            <Selectable
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
            >
              <Box
                key={node.id}
                position={new THREE.Vector3(node.pos.x, node.pos.y, node.pos.z)}
              >
                <meshStandardMaterial color="red" />
              </Box>
            </Selectable>
          );
        } else if (node.type === "cylinder") {
          return (
            <Selectable
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
            >
              <Cylinder
                key={node.id}
                position={new THREE.Vector3(node.pos.x, node.pos.y, node.pos.z)}
              >
                <meshStandardMaterial color="blue" />
              </Cylinder>
            </Selectable>
          );
        } else if (node.type === "sphere") {
          return (
            <Selectable
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
            >
              <Sphere
                key={node.id}
                position={new THREE.Vector3(node.pos.x, node.pos.y, node.pos.z)}
              >
                <meshStandardMaterial color="green" />
              </Sphere>
            </Selectable>
          );
        }
      })}
    </group>
  );
};
