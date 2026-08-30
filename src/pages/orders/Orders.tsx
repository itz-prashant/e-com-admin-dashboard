import { Breadcrumb, Flex, Space, Table, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../http/api";
import { format } from "date-fns";
import { colorMapping } from "../../constants";
import { capitalizeFirst } from "../products/helper";
import { useEffect } from "react";
import socket from "../../lib/socket";
import { useAuthStore } from "../../store";

const columns = [
  {
    title: "Order Id",
    dataIndex: "_id",
    key: "_id",
    render: (_text: string, record) => {
      return <Typography.Text>{record._id}</Typography.Text>;
    },
  },
  {
    title: "Customer",
    dataIndex: "CustomerId",
    key: "customerId._id",
    render: (_text: string, record) => {
      if (!record.categoryId) return "null";
      return (
        <Typography.Text>
          {record.customerId.firstName + " " + record.customerId.lastName}
        </Typography.Text>
      );
    },
  },
  {
    title: "Addredd",
    dataIndex: "address",
    key: "address",
    render: (_text: string, record) => {
      return <Typography.Text>{record.address}</Typography.Text>;
    },
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (_text: string, record) => {
      return <Typography.Text>{record.comment}</Typography.Text>;
    },
  },
  {
    title: "Payment Mode",
    dataIndex: "paymentMode",
    key: "paymentMode",
    render: (_text: string, record) => {
      return <Typography.Text>{record.paymentMode}</Typography.Text>;
    },
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    render: (_text: string, record) => {
      return (
        <Tag bordered={false} color={colorMapping[record.orderStatus]}>
          {capitalizeFirst(record.orderStatus)}
        </Tag>
      );
    },
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text: string) => {
      return <Typography.Text>{text}</Typography.Text>;
    },
  },
  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy HH:mm")}
        </Typography.Text>
      );
    },
  },
  {
    title: "Actions",
    render: (_, record) => {
      return <Link to={`/orders/${record._id}`}>Details</Link>;
    },
  },
];

const TENANT_ID = 7;
const Orders = () => {
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.tenant) {
      socket.on("order-update", (data)=>{
        console.log("data received", data)
      })

      socket.on("join", (data)=>{
        console.log("user joined in:", data.roomId)
      })
      socket.emit("join", {
        tenantId: user.tenant.id,
      });
    }

    return ()=>{
      socket.off("join")
      socket.off("order-update")
    }
  }, []);

  const { data: orders } = useQuery({
    queryKey: ["order"],
    queryFn: async () => {
      // If admin user then make sure to send tenant id for selected user
      const queryString = new URLSearchParams({
        tenantId: String(TENANT_ID),
      }).toString();
      return getOrders(queryString).then((res) => res.data);
    },
  });
  return (
    <Space style={{ width: "100%" }} size={"large"} vertical>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: "Products" },
          ]}
        />
      </Flex>

      <Table columns={columns} rowKey={"_id"} dataSource={orders} />
    </Space>
  );
};

export default Orders;
