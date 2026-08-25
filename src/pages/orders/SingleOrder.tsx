import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { capitalizeFirst } from "../products/helper";
import { useQuery } from "@tanstack/react-query";
import { getSingleOrder } from "../../http/api";
import { colorMapping } from "../../constants";
import type { Order } from "../../types";

const SingleOrder = () => {
  const params = useParams();
  const orderId = params.orderId;
  const { data: order } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => {
      const queryString = new URLSearchParams({
        fileds:
          "cart,address, paymentMode,tenantId,total,comment,orderStatus,paymentStatus",
      }).toString();
      return getSingleOrder(orderId, queryString).then((res) => res.data);
    },
  });
  if (!order) {
    return;
  }
  return (
    <Space style={{ width: "100%" }} size={"large"} vertical>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: <Link to={"/orders"}>Orders</Link> },
            { title: `Order - #${order?._id}` },
          ]}
        />
      </Flex>

      <Row gutter={24}>
        <Col span={14}>
          <Card
            title="Order Details"
            extra={
              <Tag
                style={{ border: 0 }}
                color={colorMapping[order.orderStatus] ?? "processing"}
              >
                {capitalizeFirst(order.orderStatus)}
              </Tag>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={order.cart}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image} />}
                    title={item.name}
                    //
                    description={item.chosenConfiguration.selectedToppings[0]
                      .map((topping) => topping.name)
                      .join(", ")}
                  />
                  <Space size={"large"}>
                    <Typography.Text>
                      {Object.values(
                        item.chosenConfiguration.priceConfiguration
                      ).join(", ")}
                    </Typography.Text>
                    <Typography.Text>
                      {item.qty} Item{item.qty > 1 ? "s" : ""}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Order Details">Customer detail</Card>
        </Col>
      </Row>
    </Space>
  );
};

export default SingleOrder;
