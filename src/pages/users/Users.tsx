import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import type { CreateUserData, FieldData, User } from "../../types";
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
  const [form] = Form.useForm();

  const [filterForm] = Form.useForm()
  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const {
    data: getUser,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      const filterParams = Object.fromEntries(Object.entries(queryParams).filter((item)=> !!item[1]))
      const queryString = new URLSearchParams(
        filterParams as unknown as Record<string, string>
      ).toString();

      return getUsers(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const { mutate: userMutate } = useMutation({
    mutationKey: ["user-register"],
    mutationFn: async (data: CreateUserData) =>
      await createUser(data).then((res) => res.data),
    onSuccess: async () => {
      queryclient.invalidateQueries({ queryKey: ["users"] });
    },
  });


  const onHandleSubmit = async () => {
    await form.validateFields();
    userMutate(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };

  const onFilterChange = async (changedFields: FieldData[])=>{
    const chanedFilterFileds = changedFields.map((item)=> ({
       [item.name[0]]: item.value
    })).reduce((acc,item)=> ({...acc, ...item}),{})

    setQueryParams((prev)=>({
      ...prev,
      ...chanedFilterFileds
    }))
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space style={{ width: "100%" }} size={"large"} vertical>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to={"/"}>Dashboard</Link> },
              { title: "Users" },
            ]}
          />
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
          {isFetching && (
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UserFilter>
            <Button
              onClick={() => setDrawerOpen(true)}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add user
            </Button>
          </UserFilter>
        </Form>

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
