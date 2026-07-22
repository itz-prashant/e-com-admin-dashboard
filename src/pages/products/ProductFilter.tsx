import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd";

type ProductFilterProps = {
  children?: React.ReactNode;
};

const ProductFilter = ({ children }: ProductFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item name="q">
                <Input.Search
             
                placeholder="Search"
              />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="category">
                <Select
   
                allowClear={true}
                placeholder={"Select category"}
                style={{ width: "100%" }}
                options={[
                  { value: "pizza", label: "Pizza" },
                  { value: "beverages", label: "Beverages" },
                ]}
              />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="category">
                <Select
   
                allowClear={true}
                placeholder={"Select restaurant"}
                style={{ width: "100%" }}
                options={[
                  { value: "pizza-hub", label: "Pizza hub" },
                  { value: "corner", label: "Softy corner" },
                ]}
              />
              </Form.Item>
            </Col>

            <Col span={6}>
               <Space>
                 <Switch defaultChecked onChange={()=>{}} />
                <Typography.Text>Show only published</Typography.Text>
               </Space>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductFilter;
