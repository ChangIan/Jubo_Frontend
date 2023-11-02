/**
 * 封裝
 * 表頭
 */

import "./index.css";

const Header = ({ title }) => (
  <div className="header">
    <h1><a href="/">{title}</a></h1>
  </div>
);

export default Header;
