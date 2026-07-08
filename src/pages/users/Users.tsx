import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import type { CreateUserData, User } from "../../types";
import { useAuthStore } from "../../store";
import UserFilter from "./UserFilter";
import { useState } from "react";
import UserForm from "./forms/UserForm";
import { PER_PAGE } from "../../constants";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
  //   {
  //     title: "Action",
  //     dataIndex: "action",
  //     key: "action",
  //     render: () => {
  //       return (
  //         <div>
  //           <Link to={"/users/edit"}>Edit</Link>
  //         </div>
  //       );
  //     },
  //   },
];

const Users = () => {
  const { user } = useAuthStore();
  const queryclient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const {
    data: getUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {

      const queryString = new URLSearchParams(queryParams as unknown as Record<string,string>).toString()

      return getUsers(queryString).then((res) => res.data);
    },
  });

  const { mutate: userMutate } = useMutation({
    mutationKey: ["user-register"],
    mutationFn: async (data: CreateUserData) =>
      await createUser(data).then((res) => res.data),
    onSuccess: async () => {
      queryclient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const [form] = Form.useForm();

  const onHandleSubmit = async () => {
    await form.validateFields();
    userMutate(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };

  if (user.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space style={{ width: "100%" }} size={"large"} vertical>
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to={"/"}>Dashboard</Link> },
            { title: "Users" },
          ]}
        />
        {isLoading && <div>Loading....</div>}
        {isError && <div>{error.message}</div>}

        <UserFilter
          onFilterChange={(filterName, filterValue) => {
            console.log("fn", filterName);
            console.log("fv", filterValue);
          }}
        >
          <Button
            onClick={() => setDrawerOpen(true)}
            type="primary"
            icon={<PlusOutlined />}
          >
            Add user
          </Button>
        </UserFilter>

        <Table
          pagination={{
            total: getUser?.total,
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
          }}
          dataSource={getUser?.data}
          columns={columns}
          rowKey={"id"}
        />

        <Drawer
          title="Create user"
          size={720}
          styles={{ body: { background: colorBgLayout } }}
          destroyOnHidden={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  form.resetFields();
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
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
