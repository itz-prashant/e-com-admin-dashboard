import { Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/Logo";
import { useMutation } from "@tanstack/react-query";
import type { Credentials } from "../../types";
import { login } from "../../http/api";

const loginUser = async (userData: Credentials) => {
  // server call login
  const { data } = await login(userData);
  return data;
};

const LoginPage = () => {

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      console.log("Login Successful");
    },
  });

  return (
    <>
      <Layout
        style={{ height: "100vh", display: "grid", placeItems: "center" }}
      >
        <Space vertical align="center" size={"large"}>
          <Layout.Content
            style={{
              display: '"flex',
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Logo />
          </Layout.Content>
          <Card
            variant="borderless"
            style={{ width: 300 }}
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: "16px",
                  justifyContent: "center",
                }}
              >
                <LockFilled />
                Sign in
              </Space>
            }
          >
            <Form
              onFinish={(values) => {
                mutate({ email: values.username, password: values.password });
                console.log("v", values);
              }}
              initialValues={{ remember: true }}
            >
              {
                isError && <Alert style={{marginBottom: 18}} type="error" title={error.message}/>
              }
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username",
                  },
                  {
                    type: "email",
                    message: "Email is not valid",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
              <Flex style={{ justifyContent: "space-between" }}>
                <Form.Item name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a id="login-form-forgom" href="#">
                  Forgot password
                </a>
              </Flex>
              <Form.Item name="username">
                <Button
                  loading={isPending}
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
};

export default LoginPage;
