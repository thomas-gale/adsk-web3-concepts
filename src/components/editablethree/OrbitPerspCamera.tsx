import { MapControls, PerspectiveCamera } from "@react-three/drei";

export const MapCamera = (): JSX.Element => {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 0]}
        up={[0, 0, 1]}
        zoom={1.5}
      />
      <MapControls
        panSpeed={1}
        rotateSpeed={1}
        zoomSpeed={1}
        minDistance={200}
        maxDistance={400}
        target={[-291, 274, 113]}
        maxPolarAngle={Math.PI / 4}
      />
    </>
  );
};


