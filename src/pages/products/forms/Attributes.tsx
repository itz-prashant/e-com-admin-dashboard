import { Card, Col, Form, Radio, Row, Switch, Typography } from "antd";
import type { Category } from "../../../types";

type PircingProps = {
  selectedCategory: string;
};

const Attributes = ({ selectedCategory }: PircingProps) => {
  const category: Category | null = selectedCategory
    ? JSON.parse(selectedCategory)
    : null;

  if (!selectedCategory) {
    return null;
  }

  return (
    <Card title={<Typography>Attributes</Typography>}>
      {category.attributes.map((attribute) => {
        return (
          <div key={attribute.name}>
            {attribute.widgetType === "radio" ? (
              <Form.Item
                label={attribute.name}
                name={["attribute", attribute.name]}
                initialValue={attribute.defaultValue}
                rules={[
                  {
                    required: true,
                    message: "Attribute name is required",
                  },
                ]}
              >
                <Radio.Group>
                  {attribute.availableOptions.map((option) => {
                    return (
                      <Radio.Button value={option} key={option}>
                        {option}
                      </Radio.Button>
                    );
                  })}
                </Radio.Group>
              </Form.Item>
            ) : attribute.widgetType === "switch" ? (
              <Row>
                <Col>
                  <Form.Item label={attribute.name} name={["attributes", attribute.name]} valuePropName="checked" initialValue={attribute.defaultValue}>
                    <Switch  checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </div>
        );
      })}
    </Card>
  );
};

export default Attributes;
