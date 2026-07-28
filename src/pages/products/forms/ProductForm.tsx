import {
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
  type UploadProps,
} from "antd";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import { PlusOutlined } from "@ant-design/icons";
import type { Category, Tenant } from "../../../types";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import { useState } from "react";

const ProductForm = () => {
  const selectedCategory = Form.useWatch("categoryId");
  const [messageApi, contextHolder] = message.useMessage();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const form = Form.useFormInstance();

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

  const uploaderConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        messageApi.error("You can upload only Jpeg or Png");
      }

      setImageUrl(URL.createObjectURL(file));
        form.setFieldValue("image", {
    file: file,
  });
      return false;
    },
  };

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
                <Form.Item
                  label=""
                  name="image"
                  rules={[
                    {
                      required: true,
                      message: "Please upload a product image",
                    },
                  ]}
                >
                  {contextHolder}
                  <Upload listType="picture-card" {...uploaderConfig}>
                    {imageUrl ? (
                      <img src={imageUrl} alt="product-image" height={100} />
                    ) : (
                      <Space vertical>
                        <PlusOutlined />
                        <Typography.Text>Upload</Typography.Text>
                      </Space>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Tenant Info">
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
          </Card>

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
