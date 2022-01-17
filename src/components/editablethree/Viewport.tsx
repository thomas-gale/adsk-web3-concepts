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
import { config } from "../../env/config";

import * as IPFS from "ipfs";
import OrbitDB from "orbit-db";
import KeyValueStore from "orbit-db-kvstore";

// import * as IPFS from "ipfs";
// import * as IPFS from "ipfs-core";
// import * as OrbitDB from "orbit-db";
// import { Message } from "ipfs-core-types/src/pubsub";

export const Viewport = (): JSX.Element => {
  const ipfsRef = useRef<IPFS.IPFS>();
  const orbitDbRef = useRef<OrbitDB>();
  const kvDbRef = useRef<KeyValueStore<string>>(); // Always string key, we specify string value
  const [kvDbAddr, setKvDbAddr] = useState("");
  const [nodeActive, setNodeActive] = useState(false);
  const [newing, setNewing] = useState(false);
  const [kvDbAddrToOpen, setKvDbAddrToOpen] = useState("");
  const [opening, setOpening] = useState(false);
  const [saving, setSaving] = useState(false);
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
      // Create IPFS node
      ipfsRef.current = await IPFS.create({
        repo: "peer" + Math.random(), // Testing, this node is new peer on each mount
        config: {
          Addresses: {
            Swarm: [config.ipfs.webRtcStarServer],
          },
          Bootstrap: [],
        },
      });
      // Create OrbitDB instance
      orbitDbRef.current = await OrbitDB.createInstance(ipfsRef.current);

      // TODO - move
      setNodeActive(true);
    })();
    return () => {
      if (kvDbRef.current) {
        kvDbRef.current.close().catch((err) => console.log(err));
      }
      if (orbitDbRef.current) {
        orbitDbRef.current.disconnect().catch((err) => console.log(err));
      }
      if (ipfsRef.current) {
        ipfsRef.current
          .stop()
          .catch((err) => console.error(err))
          .finally(() => setNodeActive(false));
      }
    };
  }, []);

  const onNew = useCallback(async () => {
    if (ipfsRef.current) {
      if (orbitDbRef.current) {
        setNewing(true);
        console.log("Creating new database instance");

        // Create database instance
        kvDbRef.current = await orbitDbRef.current.keyvalue<string>("scenekv", {
          accessController: {
            write: ["*"], // For testing any peer can write
          },
        });

        // Set the database address and log
        setKvDbAddr(kvDbRef.current.address.toString());
        console.log(kvDbRef.current.address.toString());

        // Db events logged (DUP'd below)
        kvDbRef.current.events.on("replicated", async (address) => {
          console.log("Db replicated (complete)", address);
          if (kvDbRef.current) {
            console.log("Retriving state...");
            const state = await kvDbRef.current.get("state");
            if (state) {
              console.log("Retrieved state!", state);
              setSceneState(JSON.parse(state));
            } else {
              console.error("No state found!");
            }
          }
        });

        kvDbRef.current.events.on("replicate", (address) => {
          console.log("Db replicate (pending)", address);
        });

        kvDbRef.current.events.on("ready", (dbname, heads) => {
          console.log("Db ready", dbname, heads);
        });

        kvDbRef.current.events.on("peer", (peer) => {
          console.log("Db peer connected", peer);
        });
        setNewing(false);
      }
    }
  }, []);

  const onOpen = useCallback(async () => {
    if (ipfsRef.current) {
      if (orbitDbRef.current) {
        setOpening(true);

        if (kvDbRef.current) {
          console.log("Closing existing database instance...");
          await kvDbRef.current.close();
          console.log("Existing database instance closed!");
        }

        console.log("Opening database instance...");

        kvDbRef.current = (await orbitDbRef.current.open(
          kvDbAddr,
          {}
        )) as KeyValueStore<string>;

        console.log("Database instance opened!");

        // Db events logged (DUP'd below)
        kvDbRef.current.events.on("replicated", async (address) => {
          console.log("Db replicated (complete)", address);
          if (kvDbRef.current) {
            console.log("Retriving state...");
            const state = await kvDbRef.current.get("state");
            if (state) {
              console.log("Retrieved state!", state);
              setSceneState(JSON.parse(state));
            } else {
              console.error("No state found!");
            }
          }
        });

        kvDbRef.current.events.on("replicate", (address) => {
          console.log("Db replicate (pending)", address);
        });

        kvDbRef.current.events.on("ready", (dbname, heads) => {
          console.log("Db ready", dbname, heads);
        });

        kvDbRef.current.events.on("peer", (peer) => {
          console.log("Db peer connected", peer);
        });
      }
    }
  }, []);

  const onSave = useCallback(async () => {
    if (ipfsRef.current) {
      // const { cid } = await ipfsRef.current.add(JSON.stringify(sceneState));
      // const pinnedCid = await ipfsRef.current.pin.add(cid);
      if (kvDbRef.current) {
        setSaving(true);
        await kvDbRef.current.put("state", JSON.stringify(sceneState), {
          pin: true,
        });
        console.log("replication", kvDbRef.current.replicationStatus);
        console.log("Saved state!");
        setSaving(false);
      }
      // setSaveDataCid(pinnedCid.toString());
    }
  }, [sceneState]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="z-10 absolute flex flex-col">
        <div className="flex flex-col m-4 p-4 min-w-max rounded-xl bg-dark text-light bg-opacity-90 shadow-lg">
          <div>IPFS Node {nodeActive ? "✅" : "⚠️"}</div>
          <div className="flex flex-row mt-2">
            <Button mode="light" className="mr-4" onClick={onNew}>
              New Db
            </Button>
            <div>{newing ? "loading..." : ""}</div>
            <div className="ml-2 max-w-xs break-words">{kvDbAddr}</div>
          </div>
          <div className="flex flex-row mt-2">
            <input
              className="p-2 m-2 font-artifakt bg-light text-dark shadow-lg"
              type="text"
              value={kvDbAddr}
              onChange={(e) => setKvDbAddr(e.target.value)}
            />
            <Button mode="light" className="mr-4" onClick={onOpen}>
              Open Db
            </Button>
            <div>{opening ? "opening..." : ""}</div>
          </div>
          <div className="flex flex-row mt-2">
            <Button mode="light" onClick={onSave}>
              Save
            </Button>
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
