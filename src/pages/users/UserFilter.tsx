import { Card, Col, Input, Row, Select } from "antd";

type UserFilterProps = {
    children: React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
};

const UserFilter = ({ onFilterChange, children }: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Input.Search
                onChange={(e) =>
                  onFilterChange("searchFilter", e.target.value)
                }
                placeholder="Search"
              />
            </Col>

            <Col span={8}>
              <Select
                onChange={(selectItem) =>
                  onFilterChange("roleFilter", selectItem)
                }
                allowClear={true}
                placeholder={"Select Role"}
                style={{ width: "100%" }}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "user", label: "Manager" },
                  { value: "customer", label: "Customer" },
                ]}
              />
            </Col>

            <Col span={8}>
              <Select
                onChange={(selectItem) =>
                  onFilterChange("statusFilter", selectItem)
                }
                placeholder={"Status"}
                style={{ width: "100%" }}
                options={[
                  { value: "ban", label: "Ban" },
                  { value: "active", label: "Active" },
                ]}
              />
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

export default UserFilter;
