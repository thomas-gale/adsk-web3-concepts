import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";

export const Dashboard = (): JSX.Element => {
  const router = useRouter();
  return (
    <Box sx={{ m: 1, p: 1 }}>
      <Box>
        Page deployed on IPFS using <a href="https://fleek.co/">fleek</a>
      </Box>
      <Box>
        <Button
          variant="outlined"
          sx={{ m: 1 }}
          onClick={async (): Promise<boolean> => await router.push("/concept1")}
        >
          Concept 1 -Forge Viewer IPFS
        </Button>
        <Button
          variant="outlined"
          sx={{ m: 1 }}
          onClick={async (): Promise<boolean> => await router.push("/concept2")}
        >
          Concept 2 -React Three Editable IPFS
        </Button>
      </Box>
    </Box>
  );
};
