import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import Sider from "antd/es/layout/Sider";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Icon, { BellFilled } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import UserIcon from "../components/icons/User";
import { FoodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../http/api";

const items = [
  {
    key: "/",
    icon: <Icon component={Home} />,
    label: <NavLink to={"/"}>Home</NavLink>,
  },
  {
    key: "/users",
    icon: <Icon component={UserIcon} />,
    label: <NavLink to={"/users"}>Users</NavLink>,
  },
  {
    key: "/restaurants",
    icon: <Icon component={FoodIcon} />,
    label: <NavLink to={"/restaurants"}>Restaurants</NavLink>,
  },
  {
    key: "/products",
    icon: <Icon component={BasketIcon} />,
    label: <NavLink to={"/products"}>Products</NavLink>,
  },
  {
    key: "/promos",
    icon: <Icon component={GiftIcon} />,
    label: <NavLink to={"/promos"}>Promos</NavLink>,
  },
];

const Dashboard = () => {
  const { logout } = useAuthStore();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      return;
    },
  });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (user === null) {
    return <Navigate to={"/auth/login"} replace={true} />;
  }

  const currentYear = new Date().getFullYear();

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={["/"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              background: colorBgContainer,
            }}
          >
            <Flex gap="medium" align="start" justify="space-between">
              <Badge text="Global" status="success" />
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: ()=> logoutMutate()
                      },
                    ],
                  }}
                  placement="topRight"
                  arrow={{ pointAtCenter: true }}
                >
                  <Avatar style={{ backgroundColor: "#fde3cf" }}>U</Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Pizza Shop ©{currentYear} Created by Prashant Gupta
          </Footer>
        </Layout>
      </Layout>
      <Outlet />
    </div>
  );
};

export default Dashboard;
