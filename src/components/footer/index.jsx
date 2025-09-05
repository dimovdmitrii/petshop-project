import styles from "./styles.module.css";
import InstagramIcon from "../../assets/icons/ic-instagram.svg";
import WhatsappIcon from "../../assets/icons/ic-whatsapp.svg";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" className={styles.footer}>
      <Typography
        sx={{
          fontFamily: "Montserrat, sans-serif",
          fontSize: "64px",
          fontWeight: 700,
          lineHeight: 1.1,
          marginBottom: "40px",
          fontStyle: "normal",
        }}
        className={styles.title}
      >
        Contact
      </Typography>
      <Box className={styles.infoGrid}>
        <Box className={styles.infoBlock1}>
          <Typography
            component="p"
            sx={{
              color: "#8B8B8B",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "20px",
              fontWeight: 500,
              fontStyle: "normal",
              lineHeight: 1.3,
            }}
          >
            Phone
          </Typography>
          <Typography
            component="p"
            sx={{
              color: "#282828",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "40px",
              fontWeight: 600,
              fontStyle: "normal",
              lineHeight: "1.1",
            }}
          >
            +49 30 915-88492
          </Typography>
        </Box>
        <Box className={styles.infoBlock2}>
          <Typography
            component="p"
            sx={{
              color: "#8B8B8B",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "20px",
              fontWeight: 500,
              fontStyle: "normal",
              lineHeight: 1.3,
            }}
          >
            Socials
          </Typography>
          <Box className={styles.socialIcons}>
            <img src={InstagramIcon} alt="Instagram" className={styles.icon} />
            <img src={WhatsappIcon} alt="WhatsApp" className={styles.icon} />
          </Box>
        </Box>
        <Box className={styles.infoBlock1}>
          <Typography
            component="p"
            sx={{
              color: "#8B8B8B",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "20px",
              fontWeight: 500,
              fontStyle: "normal",
              lineHeight: 1.3,
            }}
          >
            Address
          </Typography>
          <Typography
            component="p"
            sx={{
              color: "#282828",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "40px",
              fontWeight: 600,
              fontStyle: "normal",
              lineHeight: "1.1",
            }}
          >
            Wallstraße 9-13, 10179 Berlin, Deutschland
          </Typography>
        </Box>
        <Box className={styles.infoBlock2}>
          <Typography
            component="p"
            sx={{
              color: "#8B8B8B",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "20px",
              fontWeight: 500,
              fontStyle: "normal",
              lineHeight: 1.3,
            }}
          >
            Working Hours
          </Typography>
          <Typography
            component="p"
            sx={{
              color: "#282828",
              fontFamily: "Montserrat, sans-serif",
              fontSize: "40px",
              fontWeight: 600,
              fontStyle: "normal",
              lineHeight: "1.1",
            }}
          >
            24 hours a day
          </Typography>
        </Box>
      </Box>
      <Box className={styles.mapWrapper}>
        <iframe
          title="IT Career Hub Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.03070014159!2d13.393282716002492!3d52.52064567981153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851d47abf7e05%3A0x78afd5eec2cbd9c2!2sWallstra%C3%9Fe%209-13%2C%2010179%20Berlin%2C%20Germany!5e0!3m2!1sen!2sde!4v1698798312345!5m2!1sen!2sde"
          width="100%"
          height="350"
          style={{ border: 0, borderRadius: 12 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>
    </Box>
  );
};

export default Footer;
