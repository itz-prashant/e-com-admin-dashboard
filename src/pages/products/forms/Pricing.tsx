import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import type { Category } from "../../../types";

type PircingProps = {
  selectedCategory: string;
};

const Pricing = ({ selectedCategory }: PircingProps) => {
  const category: Category | null = selectedCategory
    ? JSON.parse(selectedCategory)
    : null;

  if (!selectedCategory) {
    return null;
  }

  return (
    <Card title={<Typography>Product Price</Typography>}>
      {Object.entries(category?.priceConfiguration).map(
        ([configurationKey, configurationValue]) => {
          return (
            <div key={configurationKey}>
              <Space vertical size={"large"} style={{ width: "100%" }}>
                <Typography.Text>{`${configurationKey} (${configurationValue.priceType})`}</Typography.Text>

                <Row gutter={20}>
                  {configurationValue.availableOptions.map((option: string) => {
                    return (
                      <Col span={8} key={option}>
                        <Form.Item
                          label={option}
                          name={[
                            "priceConfiguration",
                            JSON.stringify({
                              configurationKey: configurationKey,
                              priceType: configurationValue.priceType,
                            }),
                            option,
                          ]}
                        >
                          <InputNumber addonAfter="₹"/>
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Space>
            </div>
          );
        }
      )}
    </Card>
  );
};

export default Pricing;
