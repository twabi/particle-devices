import React, {useState, useEffect} from "react";
import {Button, Card, Layout, List, Typography} from "antd";
import Firebase from "./Firebase";
import {MDBBox, MDBCard, MDBCardTitle, MDBCol, MDBContainer, MDBIcon, MDBRow} from "mdbreact";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';



const { Title } = Typography
const { Header, Content } = Layout;
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
mapboxgl.accessToken = "pk.eyJ1IjoidHdhYmkiLCJhIjoiY2tlZnZyMWozMHRqdjJzb3k2YzlxZnloYSJ9.FBL3kyXAQ22kEws-y6XbJQ";

var devicesRef = Firebase.database().ref("particle-devices/");
const FirebaseContent = () => {

    const [deviceArray, setDeviceArray] = useState([]);
    const mapContainer = React.useRef(null);
    const [lng, setLng] = useState(35.0168);
    const [lat, setLat] = useState(-15.7667);
    const [zoom, setZoom] = useState(12);



    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });
        var tempArray = [];

        devicesRef.on("child_added", function (snapshot) {
            var devices = snapshot.val();

            tempArray.push(devices);

            console.log(devices);
        });

        console.log(tempArray)
        setDeviceArray(tempArray);

        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        map.on('idle',function(){
            map.resize()
        })

        return () => map.remove();


    }, []);


    return (

        <div>
            <div className="p-5">
                <MDBRow>
                    <MDBCol md="4">
                        <MDBCard >

                            <MDBCardTitle className="mt-3 ml-3 h6 grey-text">Trash-cans</MDBCardTitle>

                            {deviceArray.length == 0 ?
                                <div className="d-flex justify-content-center w-100 p-2">
                                    <div className="spinner-border mx-2 mt-4 indigo-text spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>

                                : null}


                            <div className="scroll">
                                <List
                                    itemLayout="horizontal">
                                    {deviceArray.map((item, key) => (
                                        <List.Item key={key}>
                                            <Card title={item.name} style={{ width: "100%" }}>
                                                <MDBRow>
                                                    <p>Device ID : {item.coreid}</p>
                                                    <p>Last Heard : {item.published_at}</p>
                                                    <p>Distance: {item.distance}</p>
                                                </MDBRow>
                                                <MDBRow>
                                                    <Button type="primary" className="mx-2">
                                                        Edit
                                                    </Button>
                                                    <Button className="mx-2" type="danger" >
                                                        Delete
                                                    </Button>,
                                                </MDBRow>
                                            </Card>

                                        </List.Item>
                                    ))}
                                </List>
                            </div>


                        </MDBCard>
                    </MDBCol>

                    <MDBCol md="8">
                        <div>
                            <div>
                                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                            </div>
                            <div className="map-container border border-primary" ref={mapContainer} />
                        </div>
                    </MDBCol>
                </MDBRow>



            </div>
        </div>
    )
}

export default FirebaseContent;