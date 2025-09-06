import { Box, Typography, Button } from "@mui/material";
import mainImg from "../../assets/images/main-img.png";

function MainBanner() {
  return (
    <Box
      sx={{
        maxWidth: 1440,
        height: 600,
        margin: "0 auto",
        backgroundImage: `url(${mainImg})`,
        display: "flex",
        flexDirection: "column",

        padding: "80px 0px 0px 0px",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontFamily: "Montserrat",
          fontSize: {
            xs: "48px",
            sm: "64px",
            md: "96px",
          },
          fontWeight: 700,
          lineHeight: "110%",
          padding: "0px 40px 0px 40px",
          letterSpacing: "0",
          color: "#fff",
        }}
      >
        Amazing Discounts <br /> on Pets Products!
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{
          lineHeight: 1.3,
          fontFamily: "Montserrat, sans-serif",
          width: { xs: "180px", sm: "218px" },
          height: { xs: "48px", sm: "58px" },
          fontSize: { xs: "16px", sm: "19px" },
          marginLeft: { xs: "20px", sm: "40px" },
          marginTop: "40px",
          fontWeight: "600",
          padding: "16px 56px",
          textTransform: "none",
          borderRadius: "6px",
        }}
      >
        Check out
      </Button>
    </Box>
  );
}

export default MainBanner;
