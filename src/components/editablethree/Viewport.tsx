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
import Identities, { Identity } from "orbit-db-identity-provider";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export const Viewport = (): JSX.Element => {
  const { connector, library } = useWeb3React<Web3Provider>();
  const ipfsRef = useRef<IPFS.IPFS>();
  const orbitDbRef = useRef<OrbitDB>();
  const kvDbRef = useRef<KeyValueStore<string>>(); // Always string key, we specify string value
  const kvDbBaseName = "scenekv";
  const kvStateKey = "state";
  const [nodeActive, setNodeActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replicationStatus, setReplicationStatus] = useState("");
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
      // Orbit DB experiments
      ipfsRef.current = await IPFS.create({
        // repo: "peer" + Math.random(), // Testing, this node is new peer on each mount
        repo: "web3-concepts", // Fixed peer id.
        start: true,
        preload: {
          enabled: false,
        },
        EXPERIMENTAL: {
          pubsub: true,
        },
        config: {
          Addresses: {
            Swarm: [config.ipfs.webRtcStarServer],
          },
        },
      });

      // Create OrbitDB identity
      let identity: Identity | undefined = undefined;
      if (connector && library) {
        // const provider = await connector?.getProvider();
        // console.log("Library Provider:", library);
        const wallet = library.getSigner();
        console.log("Creating identity...");
        identity = await Identities.createIdentity({
          type: "ethereum",
          wallet,
        });
        console.log("Created");
      }

      // Create OrbitDB instance
      orbitDbRef.current = await OrbitDB.createInstance(ipfsRef.current, {
        identity: identity,
      });

      // Log Identity
      console.log("Orbit Identity", identity?.id);

      // Create Db instance
      kvDbRef.current = await orbitDbRef.current.keyvalue(kvDbBaseName, {
        accessController: {
          write: [identity?.id ?? ""], // For testing any peer can write
        },
      });

      // Subscribe to changes
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      kvDbRef.current.events.on("ready", async (dbname, heads) => {
        if (kvDbRef.current) {
          setReplicationStatus(
            `${kvDbRef.current.replicationStatus.progress}/${kvDbRef.current.replicationStatus.max}`
          );
          const dbState = await kvDbRef.current.get(kvStateKey);
          if (dbState) {
            setSceneState(JSON.parse(dbState));
            console.log("Loaded existing scene state from local indexed db");
          }
        }

        // // Log Identity
        // if (orbitDbRef.current) {
        //   console.log("Orbit ID", orbitDbRef.current.id);
        // }

        // Node active and Db is ready
        setNodeActive(true);
      });

      kvDbRef.current.events.on(
        "replicate.progress",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (address, hash, entry, progress, have) => {
          setReplicationStatus(`${progress}/${have}`);
        }
      );

      kvDbRef.current.events.on("replicated", async (address) => {
        console.log("Db replicated with another peer! :)", address);
        if (kvDbRef.current) {
          setLoading(true);
          console.log("Retrieving state...");
          const state = await kvDbRef.current.get(kvStateKey);
          if (state) {
            console.log("Retrieved state!");
            setSceneState(JSON.parse(state));
            setLoading(false);
          } else {
            console.error("No state found! Try again...?");
          }
        }
      });

      kvDbRef.current.events.on("peer", async (peer) => {
        console.log("Db peer connected", peer);
      });

      kvDbRef.current.events.on(
        "peer.exchanged",
        async (peer, address, heads) => {
          console.log("peer.exchanged", peer, address, heads);
          if (kvDbRef.current) {
            setReplicationStatus(
              `${kvDbRef.current.replicationStatus.progress}/${kvDbRef.current.replicationStatus.max}`
            );
            setLoading(true);
            console.log("Retrieving state...");
            const state = await kvDbRef.current.get(kvStateKey);
            if (state) {
              console.log("Retrieved state!");
              setSceneState(JSON.parse(state));
              setLoading(false);
            } else {
              console.error("No state found! Try again...?");
            }
          }
        }
      );

      // Loading db
      await kvDbRef.current.load();
    })();
    // Clean-up
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
  }, [connector, library]);

  const onSave = useCallback(async () => {
    if (ipfsRef.current) {
      if (kvDbRef.current) {
        setSaving(true);
        await kvDbRef.current.put(kvStateKey, JSON.stringify(sceneState), {
          pin: true,
        });
        console.log("replication", kvDbRef.current.replicationStatus);
        setReplicationStatus(
          `${kvDbRef.current.replicationStatus.progress}/${kvDbRef.current.replicationStatus.max}`
        );
        console.log("Saved state!");
        setSaving(false);
      }
    }
  }, [sceneState]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="z-10 absolute flex flex-col">
        <div className="flex flex-col m-4 p-4 min-w-max rounded-xl bg-dark text-light bg-opacity-90 shadow-lg">
          <div>IPFS Node {nodeActive ? "✅" : "⚠️"}</div>
          <div className="flex flex-row mt-2">
            <div>{loading ? "loading... " : ""}</div>
            <div>{`replication: ${replicationStatus}`}</div>
          </div>
          <div className="flex flex-row mt-2">
            <Button mode="light" onClick={onSave}>
              Save
            </Button>
            <div>{saving ? "saving..." : ""}</div>
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
