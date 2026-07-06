import { Breadcrumb } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import type { User } from "../../types";

const Users = () => {
  const { data: getUser, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => res.data);
    },
  });

  return (
    <>
      <Breadcrumb
        separator={<RightOutlined />}
        items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Users" }]}
      />
      {isLoading && <div>Loading....</div>}
      {getUser && (
        <div>
          <h1>Users</h1>
          <ul>
            {getUser.map((user:User) => (
              <li key={user.id}>{user.firstName}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Users;
