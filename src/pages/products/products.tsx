import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import ProductFilter from "./ProductFilter";


const Products = () => {
  const [filterForm] = Form.useForm();
  return (
    <>
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
      </Space>

      <Form form={filterForm} onFieldsChange={()=>{}}>
        <ProductFilter>
          <Button
            onClick={() => {}}
            type="primary"
            icon={<PlusOutlined />}
          >
            Add Product
          </Button>
        </ProductFilter>
      </Form>
    </>
  );
};

export default Products;
