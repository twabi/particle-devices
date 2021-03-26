import React from "react";
//import Particle from "particle-api-js";
import { Layout, Row, Col, Menu, Input } from 'antd';

const { Header, Footer, Content } = Layout;

const MainContent = () => {

    var Particle = require('particle-api-js');
    var particle = new Particle();
    //var token;

    const [variableData, setVariables] = React.useState([]);
    const [token, setToken] = React.useState();
    const [inputValue, setInputValue] = React.useState();

    const handleChange = (e) => {

        console.log(e.target.value);
    }

    React.useEffect(() => {

        particle.login({username: 'itwabi@gmail.com', password: 'jaggerjackgrimm123'}).then(
            function(data) {
                setToken(data.body.access_token);

                //console.log(data);

            },
            function (err) {
                console.log('Could not log in.', err);
            }
        );
    }, [particle])

    return(
        <div>
            <Layout>
                <Header>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <Row>

                        <Col span={14}>
                            <Content
                                className="site-layout-background d-flex align-items-center"
                                style={{
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 280,
                                }}>
                                <Input
                                    placeholder="Basic usage"
                                    value={inputValue}
                                    onChange={handleChange}
                                />
                            </Content>

                        </Col>
                    </Row>
                </Content>
                <Footer>Footer</Footer>
            </Layout>
        </div>
    );
}

export default MainContent;