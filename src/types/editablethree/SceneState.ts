export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Node {
  id: string;
  type: "cylinder" | "sphere" | "cube";
  pos: Vector3;
  children: Node[];
}

export interface SceneState {
  nodes: Node[];
}
