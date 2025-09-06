import styles from "./styles.module.css";
import MainBanner from "../../components/mainPageBanner";
import MainPageCategories from "../../components/mainPageCategories";
import MainPageDiscount from "../../components/mainPageDiscount";

function Main() {
  return (
    <div className={styles.container}>
      <MainBanner />
      <MainPageCategories />
      <MainPageDiscount />
    </div>
  );
}
export default Main;
