import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "../../store";
import React, { useState } from "react";
import TenantFilter from "./TenantFilter";
import { createTenant, getTenants } from "../../http/api";
import TenantForm from "./forms/TenantForm";
import type { createTenantData, FieldData } from "../../types";
import { PER_PAGE } from "../../constants";
import { debounce } from "lodash";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const Tenants = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [form] = Form.useForm();

  const [tenantFilterForm] = Form.useForm();

  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const {
    token: { colorBgLayout },
  } = theme.useToken();
  const {
    data: tenants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: () => {
      const filterParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filterParams as unknown as Record<string, string>
      ).toString();

      return getTenants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenant-register"],
    mutationFn: async (data: createTenantData) =>
      await createTenant(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  const { user } = useAuthStore();

  const onHandleSubmit = async () => {
    await form.validateFields();
    tenantMutate(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };

  const debounceQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({
        ...prev,
        q: value,
        currentPage: 1,
      }));
    }, 500);
  }, []);

  const onFilterChange = (changedFiled: FieldData[]) => {
    const changedFilterField = changedFiled
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changedFilterField) {
      debounceQUpdate(changedFilterField.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterField,
        currentPage: 1,
      }));
    }
  };

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space vertical size="large" style={{ width: "100%" }}>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Tenants" },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        <Form form={tenantFilterForm} onFieldsChange={onFilterChange}>
          <TenantFilter
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add Restaurant
            </Button>
          </TenantFilter>
        </Form>

        <Table
          pagination={{
            total: tenants?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]} - ${range[1]} of ${total} items`;
            },
          }}
          columns={columns}
          dataSource={tenants?.data}
          rowKey={"id"}
        />

        <Drawer
          title="Create restaurant"
          size={720}
          destroyOnHidden={true}
          open={drawerOpen}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          onClose={() => {
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenants;
