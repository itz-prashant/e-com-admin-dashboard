import Title from "antd/es/typography/Title";
import { useAuthStore } from "../store";
import { Button, Card, Col, List, Row, Skeleton, Space, Statistic, Tag } from "antd";
import Icon from "@ant-design/icons";
import type { ComponentType } from "react";
import Text from "antd/es/typography/Text";
import { Link } from "react-router-dom";
import BasketIcon from "../components/icons/BasketIcon";
import { BarChartIcon } from "../components/icons/BarChartIcon";

const list = [
  {
    OrderSummary: "Peperoni, Margarita ...",
    address: "Bandra, Mumbai",
    amount: 1200,
    status: "preparing",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
];

interface CardTitleProps {
  title: string;
  PrefixIcon: ComponentType<unknown>;
}

const CardTitle = ({ title, PrefixIcon }: CardTitleProps) => {
  return (
    <Space>
      <Icon component={PrefixIcon} />
      {title}
    </Space>
  );
};

function HomePage() {
  const { user } = useAuthStore();

  return (
    <div>
      <Title level={4}>Welcome, {user.firstName}😊</Title>
      <Row className="mt-4" gutter={16}>
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card variant="borderless">
                <Statistic title="Total orders" value={52} />
              </Card>
            </Col>
            <Col span={12}>
              <Card variant="borderless">
                <Statistic
                  title="Total sale"
                  value={70000}
                  precision={2}
                  prefix="₹"
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                title={<CardTitle title="Sales" PrefixIcon={BarChartIcon} />}
                variant="borderless"
              ></Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card
            variant="borderless"
            title={<CardTitle title="Recent orders" PrefixIcon={BasketIcon} />}
          >
            <List
              className="demo-loadmore-list"
              loading={false}
              itemLayout="horizontal"
              loadMore={true}
              dataSource={list}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      title={
                        <a href="https://ant.design">{item.OrderSummary}</a>
                      }
                      description={item.address}
                    />
                    <Row style={{ flex: 1 }} justify="space-between">
                      <Col>
                        <Text strong>₹{item.amount}</Text>
                      </Col>
                      <Col>
                        <Tag color="volcano">{item.status}</Tag>
                      </Col>
                    </Row>
                  </Skeleton>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 20 }}>
              <Button type="link">
                <Link to="/orders">See all orders</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
