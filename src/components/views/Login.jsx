import { Form, Input, Button, Row, Col, notification } from "antd";
import { useNavigate } from "react-router";
import useBackend from "../../hooks/useBackend";
import useLocalStorage from "use-local-storage";
import { useEffect } from "react";

export default function Login() {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");
    const { sendRequest } = useBackend();

    const onFinish = (values) => {
        sendRequest("/users/get-token", "POST", values)
            .then(response => {
                if (!response.hasOwnProperty("access_token")) {
                    notification.error({
                        message: 'Wrong username or password'
                    });
                    return;
                }

                notification.success({
                    message: 'Logged in'
                });
                setAccessToken(response.access_token)
            })
    };

    useEffect(() => {
        // TODO check if invalidated token
        if (accessToken)
            navigate("/");
    }, [accessToken])

    return (
        <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Col span={4}>
                <h1>Login</h1>
                <Form
                    name="basic"
                    layout="vertical"
                    initialValues={{ username: "", password: "" }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Login</Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}