import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
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

const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <Icon component={Home} />,
      label: <NavLink to={"/"}>Home</NavLink>,
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

  if (role === "admin") {
    const menus = [...baseItems]

    menus.splice(1,0,{
        key: "/users",
        icon: <Icon component={UserIcon} />,
        label: <NavLink to={"/users"}>Users</NavLink>,
      })
        return menus
  }
};

const Dashboard = () => {
  const { logout, user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation()

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
    return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace={true} />;
  }

   const items = getMenuItems(user.role);

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
            defaultSelectedKeys={[location.pathname]}
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
              <Badge
                text={user.role === "admin" ? "Admin" : user.tenant.name}
                status="success"
              />
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
                        onClick: () => logoutMutate(),
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
          <Content style={{ margin: "16px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Pizza Shop ©{currentYear} Created by Prashant Gupta
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
