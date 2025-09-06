import styles from "./styles.module.css";
import MainBanner from "../../components/mainPageBanner";
import MainPageCategories from "../../components/mainPageCategories";
import MainPageDiscount from "../../components/mainPageDiscount";
import MainPageSales from "../../components/mainPageSales";

function Main() {
  return (
    <div className={styles.container}>
      <MainBanner />
      <MainPageCategories />
      <MainPageDiscount />
      <MainPageSales />
    </div>
  );
}
export default Main;
