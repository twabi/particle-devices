import React from "react";
//import Particle from "particle-api-js";
import {Layout, Row, Col, Menu, Input, Button, List, Card} from 'antd';
import { Typography } from 'antd';

const { Title } = Typography
const { Header, Content } = Layout;

const MainContent = () => {

    var Particle = require('particle-api-js');
    var particle = new Particle();
    var token;

    //const [token, setToken] = React.useState();
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [deviceArray, setDevices] = React.useState([]);

    const data = [
        {
            title: 'Ant Design Title 1',
        },
        {
            title: 'Ant Design Title 2',
        },
        {
            title: 'Ant Design Title 3',
        },
        {
            title: 'Ant Design Title 4',
        },
    ];

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePass = (e) => {
        setPassword(e.target.value);
    }

    const handleLogin = () => {

        if((email == null) || (password == null)){
            alert("Fields cannot be left empty!");
        } else {

            particle.login({username: email, password: password})
                .then(
                function(data) {
                    setLoggedIn(true);
                    token = (data.body.access_token);

                    //console.log(data);
                    var devicesPr = particle.listDevices({ auth: token });

                    devicesPr.then(
                        function(devices){
                            console.log('Devices: ', devices);
                            //setDevices(devices.body);
                            var tempArray = [];
                            devices.body.map((device) => {
                                var temp = {};
                                temp.name = device.name;
                                temp.id = device.id;
                                temp.status = device.status;
                                temp.last_heard = device.last_heard;

                                particle.getVariable({ deviceId: device.id, name: 'distance', auth: token }).then(function(data) {
                                    console.log('distance:', data);
                                    device.distance = data;
                                    temp.distance = data;
                                }, function(err) {
                                    console.log('An error occurred while getting attrs:', err);
                                });

                                particle.getVariable({ deviceId: device.id, name: 'STU', auth: token }).then(function(data) {
                                    console.log('GPS value:', data);
                                    device.STU = data;
                                    temp.STU = data;
                                }, function(err) {
                                    console.log('An error occurred while getting attrs:', err);
                                });
                            });
                            setDevices(devices.body);
                        },
                        function(err) {
                            console.log('List devices call failed: ', err);
                            alert('List devices call failed: ' + err);
                        }
                    );

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
                            { !loggedIn ?

                                    <div>
                                        <Title className="my-4" level={2}>Log In</Title>

                                        <Input
                                            className="mt-3 mb-1 mx-3"
                                            placeholder="enter particle email"
                                            value={email}
                                            onChange={handleEmail}
                                        />
                                        <Input.Password
                                            className="mt-1 mb-3 mx-3"
                                            placeholder="enter particle password"
                                            value={password}
                                            onChange={handlePass}
                                        />
                                        <Button
                                            onClick={handleLogin}
                                            className="my-3 mx-3"
                                            type="primary">Get Devices</Button>
                                    </div>

                                :

                                <div>
                                    <Title className="my-4" level={2}>Your Devices</Title>
                                    <List
                                        itemLayout="horizontal">
                                        {deviceArray && deviceArray.map((item, key) => (
                                            <List.Item key={key}>
                                                <Card title={item.name} style={{ width: "100%" }}>
                                                    <p>Device ID : {item.id}</p>
                                                    <p>Status : {item.status}</p>
                                                    <p>Last Heard : {item.last_heard}</p>
                                                    <Card type="inner" title="Variables" extra={<a href="#">More</a>}>
                                                        <p>Distance : {item.variables.distance}</p>
                                                        <p>STU : {item.variables.STU}</p>
                                                    </Card>
                                                </Card>
                                            </List.Item>
                                        ))}
                                    </List>
                                </div>}

                        </Col>
                    </Row>
                </Content>
            </Layout>
        </div>
    );
}

export default MainContent;