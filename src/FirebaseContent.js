import React, {useState, useEffect} from "react";
import {Card, Layout, List, Typography} from "antd";
import Firebase from "./Firebase";
const { Title } = Typography
const { Header, Content } = Layout;

var devicesRef = Firebase.database().ref("particle-devices/");
const FirebaseContent = () => {

    const [deviceArray, setDeviceArray] = useState([]);


    useEffect(() => {
        var tempArray = [];
        devicesRef.on("child_added", function (snapshot) {
            var devices = snapshot.val();

            tempArray.push(devices);

            console.log(devices);
        })

        setDeviceArray(tempArray);

    }, []);


    return (

        <div>
            <div>
                <Title className="my-4" level={2}>Your Devices</Title>
                <List
                    itemLayout="horizontal">
                    {deviceArray && deviceArray.map((item, key) => (
                        <List.Item key={key}>
                            <Card title={item.name} style={{ width: "100%" }}>
                                <p>Device ID : {item.coreid}</p>
                                <p>Last Heard : {item.published_at}</p>
                                <p>Distance: {item.distance}</p>
                            </Card>
                        </List.Item>
                    ))}
                </List>
            </div>
        </div>
    )
}

export default FirebaseContent;