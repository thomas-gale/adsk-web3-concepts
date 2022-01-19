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

import { bufferToHex } from "ethereumjs-util";
import { encrypt } from "@metamask/eth-sig-util";
import * as IPFS from "ipfs";
import OrbitDB from "orbit-db";
import KeyValueStore from "orbit-db-kvstore";
import Identities, { Identity } from "orbit-db-identity-provider";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

export const Viewport = (): JSX.Element => {
  const {
    account,
    connector,
    library: provider,
  } = useWeb3React<Web3Provider>();
  const ipfsRef = useRef<IPFS.IPFS>();
  const orbitDbRef = useRef<OrbitDB>();
  const kvDbRef = useRef<KeyValueStore<string>>(); // Always string key, we specify string value
  const kvDbBaseName = "scenekv";
  const kvStateKey = "state";
  const [kvDbName, setKvDbName] = useState("");
  const [nodeActive, setNodeActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replicationStatus, setReplicationStatus] = useState<{
    progress: number;
    max: number;
  }>({ progress: 0, max: 0 });
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

  // Test
  useEffect(() => {
    console.log(replicationStatus);
  }, [replicationStatus]);

  const load = useCallback(async () => {
    if (kvDbRef.current) {
      setLoading(true);
      setReplicationStatus({
        progress: kvDbRef.current.replicationStatus.progress,
        max: kvDbRef.current.replicationStatus.max,
      });
      const dbState = await kvDbRef.current.get(kvStateKey);
      if (dbState) {
        // Decrypt
        if (provider && account) {
          const decryptedState = await provider.send("eth_decrypt", [
            dbState,
            account,
          ]);
          const newState = JSON.parse(decryptedState);
          if (newState) {
            setSceneState(newState);
            setLoading(false);
          } else {
            console.error("Error parsing state, failed decryption?");
          }
        }
      }
    }
  }, [account, provider]);

  const onSave = useCallback(async () => {
    if (kvDbRef.current) {
      setLoading(false);
      setSaving(true);

      // Encrypt
      if (provider && account) {
        const encryptionPublicKey = await provider.send(
          "eth_getEncryptionPublicKey",
          [account]
        );
        const encryptedSceneState = bufferToHex(
          Buffer.from(
            JSON.stringify(
              encrypt({
                publicKey: encryptionPublicKey,
                data: JSON.stringify(sceneState),
                version: "x25519-xsalsa20-poly1305",
              })
            ),
            "utf8"
          )
        );
        await kvDbRef.current.put(kvStateKey, encryptedSceneState, {
          pin: true,
        });
        setReplicationStatus({
          progress: kvDbRef.current.replicationStatus.progress,
          max: kvDbRef.current.replicationStatus.max,
        });
        setSaving(false);
      }
    }
  }, [account, provider, sceneState]);

  useEffect(() => {
    (async () => {
      // Orbit DB experiments
      ipfsRef.current = await IPFS.create({
        repo: "web3-concepts",
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
      if (connector && provider) {
        const signer = provider.getSigner();
        console.log("Creating user identity...");
        identity = await Identities.createIdentity({
          type: "ethereum",
          wallet: signer,
        });
      }

      // Create OrbitDB instance
      orbitDbRef.current = await OrbitDB.createInstance(ipfsRef.current, {
        identity: identity,
      });

      // Log Identity
      console.log("Orbit user identity", identity?.id);

      // Create Db instance
      kvDbRef.current = await orbitDbRef.current.keyvalue(kvDbBaseName, {
        accessController: {
          write: [identity?.id ?? ""], // For testing any peer can write
        },
      });

      setKvDbName(kvDbRef.current.address.toString());

      // Subscribe to changes
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      kvDbRef.current.events.on("ready", async (dbname, heads) => {
        // Don't await loading in the case of a fresh db.
        await load();

        // Node active and Db is ready
        setNodeActive(true);
      });

      kvDbRef.current.events.on(
        "replicate.progress",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (address, hash, entry, progress, have) => {
          setReplicationStatus({
            progress: progress,
            max: have,
          });
        }
      );

      kvDbRef.current.events.on("replicated", async (address) => {
        console.log("Db replicated with another peer! :)", address);
        await load();
      });

      kvDbRef.current.events.on("peer", async (peer) => {
        console.log("Db peer connected", peer);
      });

      kvDbRef.current.events.on(
        "peer.exchanged",
        async (peer, address, heads) => {
          console.log("peer.exchanged", peer, address, heads);
          await load();
        }
      );

      // Trigger loading of db
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
  }, [connector, provider, load]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <div className="z-10 absolute flex flex-col">
        <div className="flex flex-col m-4 p-4 min-w-max rounded-xl bg-dark text-light bg-opacity-90 shadow-lg">
          <div>IPFS Node {nodeActive ? "✅" : "⚠️"}</div>
          <div className="flex flex-row mt-2">
            {kvDbName === "" && (
              <div>
                computing db address... (please sign your db in metamask)
              </div>
            )}
            <div className="break-words max-w-xs">{kvDbName}</div>
          </div>
          {replicationStatus.progress !== replicationStatus.max &&
            replicationStatus.max > 0 && (
              <div className="flex flex-row mt-2">
                <div>{`replicating... ${(
                  (replicationStatus.progress / replicationStatus.max) *
                  100
                ).toFixed(0)}%`}</div>
              </div>
            )}
          {nodeActive && (
            <div className="flex flex-row mt-2">
              <Button mode="light" onClick={onSave}>
                Save
              </Button>
            </div>
          )}
          {loading && (
            <div className="flex flex-row mt-2">
              <div>
                loading... (please authorize metamask to decrypt state or if
                this is fresh db, you can save to initialize)
              </div>
            </div>
          )}
          {saving && (
            <div className="flex flex-row mt-2">
              <div>
                saving... (please authorize metamask to have your encryption
                key)
              </div>
            </div>
          )}
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
