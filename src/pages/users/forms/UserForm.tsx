import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "../../../types";

const UserForm = () => {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((res) => res.data);
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space vertical size="large">
          <Card title="Basic info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="First name" name="firstName">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last name" name="lastName">
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Security info">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Password" name="passsword">
                  <Input.Password size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Role">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Role" name="role">
                  <Select
                    size="large"
                    onChange={() => {}}
                    allowClear={true}
                    placeholder={"Select Role"}
                    style={{ width: "100%" }}
                    options={[
                      { value: "admin", label: "Admin" },
                      { value: "user", label: "Manager" },
                      { value: "customer", label: "Customer" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Restaurant" name="tenantId">
                  <Select
                    size="large"
                    onChange={() => {}}
                    allowClear={true}
                    placeholder={"Select Restaurant"}
                    style={{ width: "100%" }}
                    options={tenants.map((tenant:Tenant) => ({
                      label: tenant.name,
                      value: tenant.id,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
