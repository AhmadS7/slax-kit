import React from "react";
import Styles from "../styles/ContentWrapper.module.css";
export default function ContentWrapper({ children }) {
  return <div className={Styles.container}>{children}</div>;
}
