import React from "react";
//import Particle from "particle-api-js";
import {Layout, Row, Col, Menu, Input, Button} from 'antd';
import { Typography } from 'antd';

const { Title } = Typography
const { Header, Content } = Layout;

const MainContent = () => {

    var Particle = require('particle-api-js');
    var particle = new Particle();
    //var token;

    const [token, setToken] = React.useState();
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();

    const handleEmail = (e) => {

        console.log(e.target.value);
        setEmail(e.target.value);
    }

    const handlePass = (e) => {

        setPassword(e.target.value);
    }


    React.useEffect(() => {


    }, [particle]);

    const handleLogin = () => {

        if((email == null) || (password == null)){
            alert("Fields cannot be left empty!");
        } else {

            particle.login({username: email, password: password})
                .then(
                function(data) {
                    setToken(data.body.access_token);

                    //console.log(data);

                },
                function (err) {
                    console.log('Could not log in.', err);
                }
            );

        }
    }

    return(
        <div>
            <Layout>
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Title className="text-white" level={1}>Particle Devices</Title>
                    </Menu>
                </Header>
                <Content>
                    <Row className="d-flex justify-content-center align-items-center">
                        <Col span={10}>
                                <Title className="my-4" level={2}>Log In</Title>

                                <Input
                                    className="mt-3 mb-1 mx-3"
                                    placeholder="enter particle email"
                                    value={email}
                                    onChange={handleEmail}
                                />
                                <Input
                                    className="mt-1 mb-3 mx-3"
                                    placeholder="enter particle password"
                                    value={password}
                                    onChange={handlePass}
                                />
                                <Button
                                    onClick={handleLogin}
                                    className="my-3 mx-3"
                                    type="primary">Get Devices</Button>

                        </Col>
                    </Row>
                </Content>
            </Layout>
        </div>
    );
}

export default MainContent;