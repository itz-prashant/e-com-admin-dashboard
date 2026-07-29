import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";

import type { Category, Tenant } from "../../../types";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImage from "./ProductImage";
import { useAuthStore } from "../../../store";

const ProductForm = () => {
  const {user} = useAuthStore()
  const selectedCategory = Form.useWatch("categoryId");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });

  const { data: restaurant } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants();
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space vertical size="large">
          <Card title="Product info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Product name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Product name required",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: "Category is required",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    allowClear={true}
                    placeholder={"Select category"}
                    style={{ width: "100%" }}
                    options={categories?.data.map((category: Category) => ({
                      value: JSON.stringify(category),
                      label: category.name,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Description name required",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    maxLength={100}
                    style={{ resize: null }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Product Image">
            <Row gutter={20}>
              <Col span={12}>
                <ProductImage />
              </Col>
            </Row>
          </Card>

         {user.role !== "manager" && <Card title="Tenant Info">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="Restaurant"
                  name="tenantId"
                  rules={[
                    {
                      required: true,
                      message: "Restaurant is required",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    onChange={() => {}}
                    allowClear={true}
                    placeholder={"Select Restaurant"}
                    style={{ width: "100%" }}
                    options={restaurant?.data?.data.map((tenant: Tenant) => ({
                      label: tenant.name,
                      value: tenant.id,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>}

          {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
          {selectedCategory && (
            <Attributes selectedCategory={selectedCategory} />
          )}

          <Card title="Other Property">
            <Row gutter={24}>
              <Col span={24}>
                <Space>
                  <Form.Item>
                    <Switch
                      onChange={() => {}}
                      defaultChecked={true}
                      checkedChildren="Yes"
                      unCheckedChildren="NO"
                    />
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: "22px", display: "block" }}
                  >
                    Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
