import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd";
import { getCategories, getTenants } from "../../http/api";
import type { Category, Tenant } from "../../types";
import { useAuthStore } from "../../store";

type ProductFilterProps = {
  children?: React.ReactNode;
};

const ProductFilter = ({ children }: ProductFilterProps) => {

  const {user} = useAuthStore()

    const {data:restaurants} = useQuery({
        queryKey:["tenants"],
        queryFn: ()=>{
           return getTenants(`perPage=100&currentPage=1`)
        },
    })

    const {data:categories} = useQuery({
        queryKey:["categories"],
        queryFn: ()=>{
           return getCategories()
        },
    })

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
              <Form.Item name="categoryId">
                <Select
   
                allowClear={true}
                placeholder={"Select category"}
                style={{ width: "100%" }}
                options={categories?.data.map((category: Category)=>({
                    value: category._id,
                    label:category.name
                }))}
              />
              </Form.Item>
            </Col>
            {user.role === "admin" && <Col span={6}>
              <Form.Item name="tenantId">
                <Select
   
                allowClear={true}
                placeholder={"Select restaurant"}
                style={{ width: "100%" }}
                options={restaurants?.data.data.map((restaurant:Tenant)=>({
                    value: restaurant.id,
                    label: restaurant.name
                }))}
              />
              </Form.Item>
            </Col>}

            <Col span={6}>
               <Space>
                 <Form.Item name="isPublished">
                  <Switch onChange={()=>{}} />
                 </Form.Item>
                <Typography.Text style={{marginBottom: "22px", display: "block"}}>Show only published</Typography.Text>
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
