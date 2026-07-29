import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import type { Category } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";

type PircingProps = {
  selectedCategory: string;
};

const Pricing = ({ selectedCategory }: PircingProps) => {
  const {data: fetchCategory} = useQuery<Category>({
    queryKey: ['category', selectedCategory],
    queryFn: ()=>{
      return getCategory(selectedCategory).then(res=> res.data)
    },
    staleTime: 1000 * 60 * 5
  })
  // const category: Category | null = selectedCategory
  //   ? JSON.parse(selectedCategory)
  //   : null;

  if (!fetchCategory) {
    return null;
  }

  return (
    <Card title={<Typography>Product Price</Typography>}>
      {Object.entries(fetchCategory?.priceConfiguration).map(
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
