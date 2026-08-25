import { Breadcrumb, Flex, Space } from "antd"
import { Link } from "react-router-dom"
import { RightOutlined } from "@ant-design/icons";

const SingleOrder = () => {
  return (
    <Space style={{ width: "100%" }} size={"large"} vertical>
      <Flex justify="space-between">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: <Link to={"/orders"}>Orders</Link> },
            { title: `Order - #127878eu38u` },
          ]}
        />
      </Flex>
    </Space>
  )
}

export default SingleOrder
