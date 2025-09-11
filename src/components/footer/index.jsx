import styles from "./styles.module.css";
import InstagramIcon from "../../assets/icons/ic-instagram.svg";
import WhatsappIcon from "../../assets/icons/ic-whatsapp.svg";
import { Box, Typography } from "@mui/material";

const CONTACT_DATA = [
  { label: "Phone", value: "+49 30 915-88492" },
  { label: "Socials", value: "socials", isSocial: true },
  { label: "Address", value: "Wallstraße 9-13, 10179 Berlin, Deutschland" },
  { label: "Working Hours", value: "24 hours a day" },
];

const SOCIAL_ICONS = [
  { src: InstagramIcon, alt: "Instagram" },
  { src: WhatsappIcon, alt: "WhatsApp" },
];

const COMMON_STYLES = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 500,
  lineHeight: 1.3,
};

const TITLE_STYLES = {
  ...COMMON_STYLES,
  fontSize: "64px",
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: "40px",
};

const LABEL_STYLES = {
  ...COMMON_STYLES,
  color: "#8B8B8B",
  fontSize: "20px",
};

const VALUE_STYLES = {
  ...COMMON_STYLES,
  color: "#282828",
  fontSize: "40px",
  fontWeight: 600,
  lineHeight: 1.1,
};

const Footer = () => {
  const renderContactBlock = (item, index) => (
    <Box key={index} className={styles.infoBlock}>
      <Typography component="p" sx={LABEL_STYLES}>
        {item.label}
      </Typography>
      {item.isSocial ? (
        <Box className={styles.socialIcons}>
          {SOCIAL_ICONS.map((icon, i) => (
            <img key={i} src={icon.src} alt={icon.alt} className={styles.icon} />
          ))}
        </Box>
      ) : (
        <Typography component="p" sx={VALUE_STYLES}>
          {item.value}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box component="footer" className={styles.footer}>
      <Typography sx={TITLE_STYLES} className={styles.title}>
        Contact
      </Typography>
      <Box className={styles.infoGrid}>
        {CONTACT_DATA.map(renderContactBlock)}
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
        />
      </Box>
    </Box>
  );
};

export default Footer;
