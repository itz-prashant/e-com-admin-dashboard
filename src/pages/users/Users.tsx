import { Breadcrumb, Space, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import type { User } from "../../types";
import { useAuthStore } from "../../store";

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
  const {user} = useAuthStore()  

  const {
    data: getUser,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => res.data);
    },
  });


  if(user.role !== "admin"){
    return <Navigate to="/" replace={true}/>
  }

  return (
    <>
      <Space style={{width: "100%"}} size={"large"} vertical>
        <Breadcrumb
        separator={<RightOutlined />}
        items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Users" }]}
      />
      {isLoading && <div>Loading....</div>}
      {isError && <div>{error.message}</div>}

      <Table dataSource={getUser} columns={columns} />
      </Space>
    </>
  );
};

export default Users;
