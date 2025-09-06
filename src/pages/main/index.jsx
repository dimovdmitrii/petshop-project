import styles from "./styles.module.css";
import MainBanner from "../../components/mainPageBanner";
import MainPageCategories from "../../components/mainPageCategories";

function Main() {
  return (
    <div className={styles.container}>
      <MainBanner />
      <MainPageCategories />
    </div>
  );
}
export default Main;
