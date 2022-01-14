import React, { useEffect } from "react";
import { TransformControls } from "@react-three/drei";
import { TransformControls as TransformControlsImpl } from "three-stdlib";

export interface SelectableProps {
  onUpdatedPosition: (updatedPosition: THREE.Vector3) => void;
  children?: React.ReactElement<THREE.Object3D>;
}

export const Selectable = ({
  onUpdatedPosition,
  children,
}: SelectableProps): JSX.Element => {
  const ref = React.useRef<TransformControlsImpl>(null);

  useEffect(() => {
    ref.current?.position.set(
      children?.props.position.x ?? 0,
      children?.props.position.y ?? 0,
      children?.props.position.z ?? 0
    );
  }, []);

  return (
    <TransformControls
      ref={ref}
      onChange={(e) => onUpdatedPosition(e?.target.worldPosition)}
    >
      {children}
    </TransformControls>
  );
};
