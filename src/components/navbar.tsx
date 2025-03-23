import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Button, Drawer, Typography } from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import toast from "react-hot-toast";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { User } from "../types/types";

const { Header } = Layout;

interface PropsType {
  user: User | null;
}

const { Title } = Typography;
const Navbar = ({ user }: PropsType) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const logOutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      setDrawerOpen(false);
    } catch (err) {
      toast.error("Sign out failed");
    }
  };

  const navMenuItems = [
    { label: <Link to="/">Home</Link>, key: "home", icon: <HomeOutlined /> },
    {
      label: <Link to="/search">Search</Link>,
      key: "search",
      icon: <SearchOutlined />,
    },
    {
      label: <Link to="/cart">Cart</Link>,
      key: "cart",
      icon: <ShoppingCartOutlined />,
    },
  ];

  return (
    <Header className="navbar">
      <div className="logo">
        <Title level={2} style={{ marginBottom: "0px" }}>
          <Link to="/">Zenith Store</Link>
        </Title>
      </div>

      <nav className="desktop-menu">
        <Menu
          mode="horizontal"
          items={navMenuItems}
          style={{ minWidth: "300px", justifyContent: "flex-end" }}
        />
      </nav>

      <div className="right-menu">
        {user?._id ? <p>Hello</p> : <Button type="primary">Login</Button>}
      </div>

      <Button
        className="mobile-menu-btn"
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setDrawerOpen(true)}
      />

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}>
        <Menu mode="vertical" items={navMenuItems} />
        {user?._id && (
          <Button
            block
            icon={<LogoutOutlined />}
            onClick={logOutHandler}
            style={{ marginTop: "10px" }}>
            Logout
          </Button>
        )}
      </Drawer>
    </Header>
  );
};

export default Navbar;
