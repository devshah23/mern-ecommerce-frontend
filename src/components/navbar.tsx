import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Typography,
  Dropdown,
  MenuProps,
} from "antd";
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
import { FaClipboardList } from "react-icons/fa";

const { Header } = Layout;

interface PropsType {
  user: User | null;
}

const { Title } = Typography;
const Navbar = ({ user }: PropsType) => {
  //Use effect to delay by one second
  useEffect(() => {
    setTimeout(() => {
      console.log("Loading");
    }, 1000);
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

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
  const items: MenuProps["items"] = [
    {
      key: "logout",
      label: "Logout",
      onClick: logOutHandler,
    },
  ];
  if (user?.role === "admin") {
    items.unshift({
      key: "admin",
      label: "Admin Panel",
      onClick: () => {
        navigate("/admin/dashboard");
      },
    });
  }
  //Add orders if user is logged in
  if (user?._id) {
    navMenuItems.push({
      label: <Link to="/orders">Orders</Link>,
      key: "orders",
      icon: <FaClipboardList />,
    });
  }
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
          style={{ minWidth: "400px", justifyContent: "flex-end" }}
        />
      </nav>

      <div className="right-menu">
        {user?._id ? (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button
              shape="circle"
              variant="outlined"
              style={{ textAlign: "center", verticalAlign: "middle" }}>
              {user?.name?.substring(0, 1)}
            </Button>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            onClick={() => {
              navigate("/login");
            }}>
            Login
          </Button>
        )}
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
        <Menu
          mode="vertical"
          // items={navMenuItems}
          items={navMenuItems.map((item) => ({
            ...item,
            onClick: () => setDrawerOpen(false), // Close drawer when clicked
          }))}
        />
        {user?._id ? (
          <Button
            block
            icon={<LogoutOutlined />}
            onClick={logOutHandler}
            style={{ marginTop: "10px" }}>
            Logout
          </Button>
        ) : (
          <Button
            type="primary"
            style={{ marginTop: "10px", width: "100%", alignSelf: "center" }}
            onClick={() => {
              navigate("/login");
            }}>
            Login
          </Button>
        )}

        {user?.role === "admin" && (
          <Button
            block
            style={{ marginTop: "10px" }}
            onClick={() => {
              navigate("/admin/dashboard");
            }}>
            Admin Panel
          </Button>
        )}
      </Drawer>
    </Header>
  );
};

export default Navbar;
