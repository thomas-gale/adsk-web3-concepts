import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Editor } from "./Editor";
import { SceneState } from "../../types/editablethree/SceneState";
import { Button } from "../elements/Button";
import * as IPFS from "ipfs-core";

export const Viewport = (): JSX.Element => {
  const ipfsRef = useRef<IPFS.IPFS>();
  const [nodeActive, setNodeActive] = useState(false);
  const [loadDataCid, setLoadDataCid] = useState("");
  const [saveDataCid, setSaveDataCid] = useState("");
  const [sceneState, setSceneState] = useState({
    nodes: [
      {
        id: "object1",
        type: "cube",
        pos: { x: 0, y: 0, z: 0 },
        children: [],
      },
      {
        id: "object2",
        type: "cylinder",
        pos: { x: 1, y: 1, z: 2 },
        children: [],
      },
      {
        id: "object3",
        type: "sphere",
        pos: { x: -3, y: -1, z: -1 },
        children: [],
      },
    ],
  } as SceneState);

  useEffect(() => {
    (async () => {
      const ipfs = await IPFS.create();
      ipfsRef.current = ipfs;
      setNodeActive(true);
      const { cid } = await ipfs.add("Some Magic Data");
      console.info(cid.toString());
      // QmXXY5ZxbtuYj6DnfApLiGstzPN7fvSyigrRee3hDWPCaf
    })();
    return () => {
      if (ipfsRef.current) {
        ipfsRef.current
          .stop()
          .catch((err) => console.error(err))
          .finally(() => setNodeActive(false));
      }
    };
  }, []);

  const onLoad = useCallback(async () => {
    console.log("onLoad");
    if (ipfsRef.current) {
      console.log("Loading", loadDataCid);
      const stream = ipfsRef.current.cat(loadDataCid);
      let data = "";
      for await (const chunk of stream) {
        // chunks of data are returned as a Buffer, convert it back to a string
        data += chunk.toString();
      }
      console.log(data);
    }
  }, [loadDataCid]);

  const onSave = useCallback(async () => {
    console.log("onSave");
    if (ipfsRef.current) {
      const { cid } = await ipfsRef.current.add("Some Magic Data");
      setSaveDataCid(cid.toString());
      console.info(cid.toString());
    }
  }, []);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="z-10 absolute flex flex-col">
        <div className="flex flex-col m-4 p-4 min-w-max rounded-xl bg-dark text-light bg-opacity-90 shadow-lg">
          <div>IPFS Node {nodeActive ? "✅" : "⚠️"}</div>
          <div className="flex flex-row mt-2">
            <input
              className="p-2 m-2 font-artifakt bg-light text-dark shadow-lg"
              type="text"
              value={loadDataCid}
              onChange={(e) => setLoadDataCid(e.target.value)}
            />
            <Button mode="light" className="mr-4" onClick={onLoad}>
              Load
            </Button>
          </div>
          <div className="flex flex-row mt-2">
            <Button mode="light" onClick={onSave}>
              Save
            </Button>
            <div className="ml-2 max-w-xs break-words">{saveDataCid}</div>
          </div>
        </div>
        <div className="flex flex-col mx-4 p-4 min-w-max rounded-xl bg-dark text-light bg-opacity-90 shadow-lg">
          {sceneState.nodes.map((node) => (
            <div key={node.id} className="flex flex-row">
              <div className="mx-1">
                <b>{node.id}</b>
              </div>
              <div className="mx-1">{node.type}</div>
              <div className="mx-1">
                <i>
                  x{node.pos.x.toPrecision(4)} y{node.pos.y.toPrecision(4)} z
                  {node.pos.z.toPrecision(4)}
                </i>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Editor sceneState={sceneState} setSceneState={setSceneState} />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
};
