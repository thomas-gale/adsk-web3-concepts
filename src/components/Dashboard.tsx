import { Box, Button } from "@mui/material";
import { useRouter } from "next/router";

export const Dashboard = (): JSX.Element => {
  const router = useRouter();
  return (
    <Box sx={{ m: 1, p: 1 }}>
      <Button
        variant="outlined"
        onClick={async (): Promise<boolean> => await router.push("/concept1")}
      >
        Concept 1 - IPFS Forge Viewer
      </Button>
    </Box>
  );
};
