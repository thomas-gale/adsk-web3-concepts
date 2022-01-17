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
import { Message } from "ipfs-core-types/src/pubsub";

// import * as IPFS from "ipfs";
// import * as IPFS from "ipfs-core";
// import * as OrbitDB from "orbit-db";
// import { Message } from "ipfs-core-types/src/pubsub";

export const Viewport = (): JSX.Element => {
  const ipfsRef = useRef<IPFS.IPFS>();
  const orbitDbRef = useRef<OrbitDB>();
  const kvDbRef = useRef<KeyValueStore<string>>(); // Always string key, we specify string value
  const [nodeActive, setNodeActive] = useState(false);
  const [loadDataCid, setLoadDataCid] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
      // Orbit DB experiments

      ipfsRef.current = await IPFS.create({
        // repo: "peer" + Math.random(), // Testing, this node is new peer on each mount
        repo: "web3-concepts", // Testing, this node is new peer on each mount
        preload: { enabled: false },
        config: {
          Addresses: {
            Swarm: [config.ipfs.webRtcStarServer],
          },
          Bootstrap: [],
        },
      });

      // Show Peer ID
      // if (ipfsRef.current) {
      //   const id = await ipfsRef.current.id();
      //   console.log("IPFS ID:", id);
      // }

      // Create OrbitDB instance
      orbitDbRef.current = await OrbitDB.createInstance(ipfsRef.current);

      // Create database instance
      // kvDbRef.current = (await orbitDbRef.current.open("scenekv", {
      //   create: true,
      //   type: "keyvalue",
      //   // accessController: {
      //   //   write: ["*"], // For testing any peer can write
      //   // },
      // })) as KeyValueStore<string>;

      kvDbRef.current = await orbitDbRef.current.keyvalue("scenekv", {
        accessController: {
          write: ["*"], // For testing any peer can write
        },
      });

      // Loading db
      await kvDbRef.current.load();
      console.log(kvDbRef.current.address.toString());

      // Set initial state
      const dbState = await kvDbRef.current.get("scene");
      if (dbState) {
        setSceneState(JSON.parse(dbState));
        console.log("Loaded initial scene state");
      }

      // Db events logged
      kvDbRef.current.events.on("replicated", async (address) => {
        console.log("Db replicated (push)", address);
        if (kvDbRef.current) {
          setLoading(true);
          console.log("Retriving state...");
          const state = await kvDbRef.current.get("state");
          if (state) {
            console.log("Retrieved state!", state);
            setSceneState(JSON.parse(state));
            setLoading(false);
          } else {
            console.error("No state found! Try again...?");
          }
        }
      });

      kvDbRef.current.events.on("replicate", (address) => {
        console.log("Db replicate (pull)", address);
      });

      kvDbRef.current.events.on("ready", (dbname, heads) => {
        console.log("Db ready", dbname, heads);
      });

      kvDbRef.current.events.on("peer", async (peer) => {
        console.log("Db peer connected", peer);
        if (kvDbRef.current) {
          setLoading(true);
          console.log("Retriving state...");
          const state = await kvDbRef.current.get("state");
          if (state) {
            console.log("Retrieved state!", state);
            setSceneState(JSON.parse(state));
            setLoading(false);
          } else {
            console.error("No state found! Try again...?");
          }
        }
      });

      // Where to add this?
      setNodeActive(true);

      // const ipfs = await IPFS.create({
      //   repo: "ok" + Math.random(), // random so we get a new peerid every time, useful for testing
      //   // repo: "adsk-web3-concepts", // should this be somehow related to the user metamask public key?
      //   config: {
      //     // Identity: {
      //     // PeerID: "peer" + Math.random(),
      //     // PrivKey: "priv" + Math.random(),
      //     // },
      //     Addresses: {
      //       Swarm: [config.ipfs.webRtcStarServer],
      //     },
      //     Bootstrap: [],
      //     // Bootstrap: [
      //     //   "/ip4/127.0.0.1/tcp/44005/p2p/12D3KooWKaiCtkjaHEi747QpcxCp3co3Xqq34J1hH1vnW9vuQP2a",
      //     // ],
      //     // Routing: {
      //     // Type: "none",
      //     // },
      //   },
      // });
      // ipfsRef.current = ipfs;
      // console.log("stats bitswap", await ipfsRef.current.stats.bitswap());
      // console.log("stats repo", await ipfsRef.current.stats.repo());
      // const id = await ipfsRef.current.id();
      // console.log("ipfs id", id.id);
      // console.log("peers", await ipfsRef.current.swarm.peers());
      // console.log("peer addrs", await ipfsRef.current.swarm.addrs());
      // processes a circuit-relay announce over pubsub
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // const processAnnounce = async (addr: any) => {
      //   console.log("announce", addr);
      //   // get our peerid
      //   const me = await ipfs.id();
      //   // me = me.id;
      //   // not really an announcement if it's from us
      //   if (addr.from == me.id) {
      //     return;
      //   }
      //   // if we got a keep-alive, nothing to do
      //   if (addr == "keep-alive") {
      //     console.log(addr);
      //     return;
      //   }
      //   const peer = addr.split("/")[9];
      //   console.log("Peer: " + peer);
      //   console.log("Me: " + me);
      //   if (peer == me) {
      //     // return if the peer being announced is us
      //     return;
      //   }
      //   // get a list of peers
      //   const peers = await ipfs.swarm.peers();
      //   for (const i in peers) {
      //     // if we're already connected to the peer, don't bother doing a
      //     // circuit connection
      //     if (peers[i].peer == peer) {
      //       return;
      //     }
      //   }
      //   // log the address to console as we're about to attempt a connection
      //   console.log(addr);
      //   // connection almost always fails the first time, but almost always
      //   // succeeds the second time, so we do this:
      //   try {
      //     await ipfs.swarm.connect(addr);
      //   } catch (err) {
      //     console.log(err);
      //     await ipfs.swarm.connect(addr);
      //   }
      // };
      // // process announcements over the relay network, and publish our own
      // // keep-alives to keep the channel alive
      // await ipfs.pubsub.subscribe("announce-circuit", processAnnounce);
      // setInterval(function () {
      //   ipfs.pubsub.publish("announce-circuit", "peer-alive");
      // }, 15000);

      let id = "";
      if (ipfsRef.current) {
        id = (await ipfsRef.current.id()).id;
      }

      // Handshaking
      if (ipfsRef.current) {
        ipfsRef.current.pubsub.subscribe("handshake", (message: Message) => {
          // Ignore from me

          if (message.from == id) return;
          console.log("handshake from ", message.from);
          // if (ipfsRef.current) {
          //   // ipfsRef.current.swarm.peers().then((peers) => console.log(peers));
          //   ipfsRef.current.swarm.addrs().then((addrs) => console.log(addrs));
          //   ipfsRef.current.swarm.connect(message.1);
          //   ipfsRef.current.pin.remote.service.add()
          //   setNodeActive(true);
          // }
        });
      }
      setInterval(function () {
        if (ipfsRef.current) {
          ipfsRef.current.pubsub.publish(
            "handshake",
            new TextEncoder().encode(`hello from ${id}`)
          );
        }
      }, 2000);
      // if (ipfsRef.current) {
      //   while ((await ipfsRef.current.swarm.peers()).length === 0) {
      //     await new Promise((resolve) => setTimeout(resolve, 1000));
      //   }
      //   setNodeActive(true);
      // }
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

  const onLoad = useCallback(async () => {
    if (ipfsRef.current) {
      // const stream = ipfsRef.current.cat(loadDataCid);
      // let data = "";
      // for await (const chunk of stream) {
      //   // chunks of data are returned as a Buffer, convert it back to a string
      //   data += chunk.toString();
      // }

      // console.log("Setting database instance");

      if (kvDbRef.current) {
        setLoading(true);
        console.log("Retriving state...");
        console.log("replication", kvDbRef.current.replicationStatus);
        const state = await kvDbRef.current.get("state");
        if (state) {
          console.log("Retrieved state!", state);
          setSceneState(JSON.parse(state));
          setLoading(false);
        } else {
          console.error("No state found! Try again...?");
        }
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
          {/* <div className="flex flex-row mt-2">
            <input
              className="p-2 m-2 font-artifakt bg-light text-dark shadow-lg"
              type="text"
              value={loadDataCid}
              onChange={(e) => setLoadDataCid(e.target.value)}
            />
            <Button mode="light" className="mr-4" onClick={onLoad}>
              Load
            </Button>
            <div>{loading ? "loading..." : ""}</div>
          </div> */}
          <div className="flex flex-row mt-2">
            <Button mode="light" onClick={onSave}>
              Save
            </Button>
            <div>{saving ? "saving..." : ""}</div>
            {/* <div className="ml-2 max-w-xs break-words">{saveDataCid}</div> */}
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
