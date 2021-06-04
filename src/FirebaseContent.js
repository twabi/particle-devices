import React, {useState, useEffect} from "react";
import {Button, Card, Col, Input, List, Modal, Row} from "antd";
import Firebase from "./Firebase";
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
import Select from 'react-select';
import bin from "./trash.png";
import {DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined} from "@ant-design/icons";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
mapboxgl.accessToken = "pk.eyJ1IjoidHdhYmkiLCJhIjoiY2tlZnZyMWozMHRqdjJzb3k2YzlxZnloYSJ9.FBL3kyXAQ22kEws-y6XbJQ";

var devicesRef = Firebase.database().ref("particle-devices/");
var cansRef = Firebase.database().ref("Trash-cans/");
const FirebaseContent = () => {

    const [deviceArray, setDeviceArray] = useState([]);
    const [canArray, setCanArray] = useState([]);
    const mapContainer = React.useRef(null);
    const [lng, setLng] = useState(35.0168);
    const [lat, setLat] = useState(-15.7667);
    const [zoom, setZoom] = useState(10);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editID, setEditID] = useState(null);
    const [selectedCan, setSelectedCan] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const handleDevice = (selectedOption) => {
        setSelectedDevice(selectedOption);
    };

    const handleModal = () => {
        setVisible(!visible);
    };

    const getTrashcans = () => {
        setCanArray([]);
        cansRef.on("child_added", function (snapshot) {
            var device = snapshot.val();
            device.label = device.canName;
            setCanArray(canArray => [...canArray, device]);
        });
    }


    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        setDeviceArray([])
        devicesRef.on("child_added", function (snapshot) {
            var device = snapshot.val();
            device.label = device.coreid;
            setDeviceArray(deviceArray => [...deviceArray, device]);
        });

        var tempArray = [];
        var geoLocArray = [];
        setCanArray([]);
        cansRef.on("child_added", function (snapshot) {
            var trashCan = snapshot.val();
            devicesRef.child(trashCan.particleID).on('value', function (snapshot){
                if(snapshot.exists()){
                    var particleDevice = snapshot.val();
                    trashCan.canLevel = particleDevice.distance;
                }
            });
            trashCan.label = trashCan.canName;
            tempArray.push(trashCan);
            geoLocArray.push(
                {
                    "type": "Feature",
                    "properties": {
                        "canName": trashCan.canName,
                        "canID" : trashCan.canID,
                        "iconSize": [60, 60],
                        "canLevel" : trashCan.canLevel,
                        "particleID" : trashCan.particleID,
                        "longitude" : trashCan.longitude,
                        "latitude" : trashCan.latitude
                    },

                    "geometry": {
                        "type": "Point",
                        "coordinates": [trashCan.longitude, trashCan.latitude]
                    }
                }
            );
            setCanArray([...tempArray]);
        });

        map.on('move', () => {
            setLng(map.getCenter().lng.toFixed(4));
            setLat(map.getCenter().lat.toFixed(4));
            setZoom(map.getZoom().toFixed(2));
        });

        map.on('idle',function(){
            map.resize()
        })


        map.on("load", function() {
            map.loadImage(
                bin,
                function(error, image) {
                    map.addImage("custom-marker", image);

                    //dummy location data and mechanic locations
                    var geojson = {
                        "type": "FeatureCollection",
                        "features": geoLocArray
                    };

                    map.addSource("mechPoints", {
                        "type": "geojson",
                        "data": geojson
                    });

                    map.addLayer({
                        "id": "mechSymbols",
                        "type": "symbol",
                        "source": "mechPoints",
                        "layout": {
                            "icon-image": "custom-marker"
                        }
                    });

                    // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
                    map.on("click", "mechSymbols", function(e) {
                        console.log(e.features[0]);
                        var trashcan = {
                            "canName": e.features[0].properties.canName,
                            "canID" : e.features[0].properties.canID,
                            "canLevel" : e.features[0].properties.canLevel,
                            "particleID" : e.features[0].properties.particleID,
                            "longitude" : e.features[0].properties.longitude,
                            "latitude" : e.features[0].properties.latitude

                        }

                        showCanDetails(trashcan);
                    });

                    map.on("mouseenter", "mechSymbols", function() {
                        map.getCanvas().style.cursor = "pointer";
                        //alert("some mechanic");
                    });

                    map.on("mouseleave", "mechSymbols", function() {
                        map.getCanvas().style.cursor = "";
                    });
                }
            );
        });


        return () => map.remove();
    }, []);


    const handleNewTrashcan = () => {

        var canName = document.getElementById("name").value;
        var latitude = document.getElementById("latitude").value;
        var longitude = document.getElementById("longitude").value;

        if(canName.length === 0 || selectedDevice == null || latitude == null || longitude == null){
            alert("Fields cannot be left empty");
        } else {
            setLoading(true);

            var canID = canName + "-" + selectedDevice.coreid;

            cansRef.child(canID)
                .set({'canName': canName, 'latitude': latitude, 'longitude': longitude, 'canID' : canID,
                    'canLevel': selectedDevice.distance, 'particleID' : selectedDevice.coreid})
                .then(() => {
                    alert("Trash-can added successfully");
                    setLoading(false);
                    handleModal();
                    getTrashcans();
                })
                .catch((error) => {
                    alert("Unable to add trash-can due to an error: " + error);
                })

        }

    }

    const startEdit = (trashcanID) => {
        handleModal();
        setShowEdit(true);
        setEditID(trashcanID);
    }

    const handleEditTrashcan = () => {

        console.log(editID);

        var canName = document.getElementById("name").value;
        var latitude = document.getElementById("latitude").value;
        var longitude = document.getElementById("longitude").value;

        if(canName.length === 0 || latitude == null || longitude == null){
            alert("Fields cannot be left empty");
        } else {
            setLoading(true);

            cansRef.child(editID)
                .update({'canName': canName, 'latitude': latitude, 'longitude': longitude})
                .then(() => {
                    alert("Trash-can edited successfully");
                    setLoading(false);
                    handleModal();
                    getTrashcans();
                })
                .catch((error) => {
                    alert("Unable to edit trash-can due to an error: " + error);
                })

        }

    }

    const handleDeleteTrashcan = (deleteID) => {

// eslint-disable-next-line no-restricted-globals
        var confirmation = confirm("Are you sure you want to delete Trash-can??");
        if(confirmation) {
            console.log(deleteID);

            cansRef.child(deleteID).remove()
                .then(() => {
                    alert("Trash-can deleted Successfully");
                    window.location.reload();
                })
                .catch((error) => {
                    alert("Unable to add trash-can due to an error: " + error);
                })

        }
    }

    const showCanDetails = (trashcan) => {
        console.log(trashcan)
        var trashcanID = trashcan.particleID;

        devicesRef.child(trashcanID).on('value', function (snapshot){
            var device = snapshot.val();
            console.log(device);
            var isCharging = device.isCharging;
            var level = device.distance;
            var batteryLife = device.batteryLife;
            var hasPower = device.hasPower;
            var status =  device.status;

            console.log(hasPower, isCharging);

            if(hasPower == 1){
                trashcan.hasPower = "true";
            } else {
                trashcan.hasPower = "false";
            }

            if(isCharging == 1){
                trashcan.isCharging = "true";
            } else {
                trashcan.isCharging = "false";
            }

            console.log(trashcan.hasPower, trashcan.isCharging);
            trashcan.canLevel = level;
            trashcan.batteryLife = batteryLife;
            trashcan.status = status;

        });

        setSelectedCan(trashcan);
        setIsModalVisible(true);
    }

    return (

        <div className="no-scroll">
            <div className="p-4">
                <Modal title="Trash-can Details" visible={isModalVisible} onOk={() => {setIsModalVisible(false)}} cancelButtonProps={false} onCancel={() => {setIsModalVisible(false)}}>

                    <div className="ml-3">
                        <Row>
                            <p><b>Trash-can Name</b> : {selectedCan && selectedCan.canName}</p>
                        </Row>
                        <Row>
                            <p><b>Latitude</b> : {selectedCan && selectedCan.latitude}</p>
                        </Row>
                        <Row>
                            <p><b>Longitude</b> : {selectedCan && selectedCan.longitude}</p>
                        </Row>
                        <Row>
                            <p><b>Trash-can Level</b> : {selectedCan && selectedCan.canLevel}</p>
                        </Row>

                        <Row>
                            <Card>
                                <>

                                    <h6 className="indigo-text"><b>Particle Device Details</b></h6>
                                    <hr/>

                                    <div className="ml-3 mt-2 mr-2">
                                        <Row>
                                            <p><b>Particle ID</b> : {selectedCan && selectedCan.particleID}</p>
                                        </Row>
                                        <Row>
                                            <p><b>Status</b> :  <b className={selectedCan && selectedCan.status === "Online" ? "text-success" : "text-danger"}>{selectedCan && selectedCan.status}</b></p>
                                        </Row>
                                        <Row>
                                            <p><b>Charging</b>: <b className={selectedCan && selectedCan.isCharging === "true" ? "text-success" : "text-danger"}>{selectedCan && selectedCan.isCharging}</b></p>
                                        </Row>
                                        <Row>
                                            <p><b>Battery Level</b>: {selectedCan && selectedCan.batteryLife}%</p>
                                        </Row>
                                        <Row>
                                            <p><b>Power Connected</b>: <b className={selectedCan && selectedCan.hasPower === "true" ? "text-success" : "text-danger"}> {selectedCan && selectedCan.hasPower}</b></p>
                                        </Row>
                                    </div>

                                </>

                            </Card>

                        </Row>
                    </div>

                </Modal>
                <Modal
                    title={showEdit ? "Edit Trash-can details" : "Add Trash-can"}
                    centered
                    visible={visible}
                    onCancel={handleModal}
                    footer={[
                        <Button key="back" onClick={handleModal}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={showEdit ? handleEditTrashcan : handleNewTrashcan}>
                            {showEdit ? <>Edit</> : <>Create</>}
                        </Button>]}
                    width={500}>

                    <form>
                        <div className="grey-text">
                            <Input
                                placeholder="enter trash-can name"
                                icon="trash"
                                group
                                id="name"
                                type="text"
                                validate
                                outline
                                error="wrong"
                                success="right"
                            />

                            {!showEdit ? <div className="d-flex mt-4 justify-content-center align-items-center">
                                <Select
                                    className="w-100"
                                    placeholder="select particle device on trash-can"
                                    onChange={handleDevice}
                                    options={deviceArray}
                                />
                            </div>: null}


                            <Input
                                placeholder="enter the latitude"
                                icon="map-marker-alt"
                                group
                                outline
                                className="mt-4"
                                id="latitude"
                                type="number"
                                validate
                                error="wrong"
                                success="right"
                            />

                            <Input
                                placeholder="enter the longitude"
                                icon="map-marker-alt"
                                group
                                outline
                                id="longitude"
                                className="mt-4"
                                type="number"
                                validate
                                error="wrong"
                                success="right"
                            />

                        </div>
                    </form>

                </Modal>
                <Row>
                    <Col span={7} className="mr-3">
                        <Card className="mr-3">
                            <Row>
                                <Col span={18}>
                                    <b className=" h6 float-left grey-text">TRASH-CANS</b>
                                </Col>
                                <Col span={6}>
                                    <Button style={{float: "right", marginLeft: "auto", marginRight: 30 }} className="d-flex justify-content-center"
                                            type="primary" onClick={() => {setShowEdit(false); handleModal();}}>
                                        <PlusOutlined/>
                                    </Button>
                                </Col>
                            </Row>


                            {canArray.length === 0 ?
                                <div className="d-flex justify-content-center w-100 p-2">
                                    <div className="spinner-border mx-2 mt-4 indigo-text spinner-border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>

                                : null}


                            <div className="scroll">
                                <List
                                    itemLayout="horizontal">
                                    {canArray.map((item, key) => (
                                        <List.Item key={key}>
                                            <Card title={item.name} className="pl-1" style={{ width: "100%" }}>
                                                <Row>
                                                    <p><b>Trash-can Name</b> : {item.canName}</p>
                                                </Row>
                                                <Row>
                                                    <p><b>Latitude</b> : {item.latitude}</p>
                                                </Row>
                                                <Row>
                                                    <p><b>Longitude</b> : {item.longitude}</p>
                                                </Row>
                                                <Row>
                                                    <p><b>Trash-can Level</b> : {item.canLevel}</p>
                                                </Row>
                                                <Row>
                                                    <p><b>Particle ID</b>: {item.particleID}</p>
                                                </Row>
                                                <Row>
                                                    <Button type="default" className="d-flex justify-content-center" onClick={() => {showCanDetails(item)}}>
                                                        <EyeOutlined />
                                                    </Button>
                                                    <Button type="primary" className="ml-2 d-flex justify-content-center" onClick={() => {startEdit(item.canID)}}>
                                                        <EditOutlined />
                                                    </Button>
                                                    <Button type="danger" className="ml-2 d-flex justify-content-center" onClick={() => {handleDeleteTrashcan(item.canID)}}>
                                                        <DeleteOutlined />
                                                    </Button>
                                                </Row>
                                            </Card>

                                        </List.Item>
                                    ))}
                                </List>
                            </div>


                        </Card>
                    </Col>

                    <Col span={16}>
                        <div className="height-max">
                            <div>
                                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                            </div>
                            <div className="map-container border border-primary" ref={mapContainer} />
                        </div>
                    </Col>
                </Row>



            </div>
        </div>
    )
}

export default FirebaseContent;