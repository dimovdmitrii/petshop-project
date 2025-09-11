import { Link } from "react-router-dom";
import { Typography, Button, Box } from "@mui/material";
import img404 from "../../assets/images/404.png";
import styles from "./styles.module.css";

// Common styles
const commonStyle = {
  fontFamily: 'Montserrat, sans-serif',
  textAlign: 'center'
};

function NotFounPage() {
  return (
    <div className={styles.container}>
      <Box className={styles.content}>
        <img src={img404} alt="404" className={styles.image} />
        
        <Typography 
          variant="h1" 
          className={styles.title}
          sx={{
            ...commonStyle,
            fontSize: { xs: "32px", sm: "48px", md: "64px" },
            fontWeight: 700,
            color: "#282828",
            marginBottom: "20px",
            whiteSpace: "nowrap"
          }}
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1" 
          className={styles.description}
          sx={{
            ...commonStyle,
            fontSize: { xs: "16px", sm: "18px", md: "20px" },
            color: "#8B8B8B",
            marginBottom: "40px",
            maxWidth: "664px",
            lineHeight: 1.6
          }}
        >
          We're sorry, the page you requested could not be found. Please
          go back to the homepage.
        </Typography>
        
        <Button
          component={Link}
          to="/"
          variant="contained"
          className={styles.button}
          sx={{
            background: "#0D50FF",
            color: "white",
            fontFamily: 'Montserrat, sans-serif',
            fontSize: "16px",
            fontWeight: 600,
            padding: { xs: "12px 24px", lg: "16px 56px" },
            width: { xs: "auto", lg: "209px" },
            height: { xs: "auto", lg: "58px" },
            borderRadius: "6px",
            textTransform: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": { background: "#0B45E6" }
          }}
        >
          Go Home
        </Button>
      </Box>
    </div>
  );
}

export default NotFounPage;
