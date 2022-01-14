import React, { useEffect, useRef, useState } from "react";
import * as IPFS from "ipfs-core";

export const Ipfs = (): JSX.Element => {
  const [nodeActive, setNodeActive] = useState(false);
  const ipfsRef = useRef<IPFS.IPFS>();

  useEffect(() => {
    (async () => {
      const ipfs = await IPFS.create();
      ipfsRef.current = ipfs;
      setNodeActive(true);
      const { cid } = await ipfs.add("Hello world");
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

  return <div>IPFS Node {nodeActive ? "✅" : "⚠️"}</div>;
};
