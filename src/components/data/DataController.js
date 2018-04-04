import React from 'react';
import socketIOClient from 'socket.io-client';
import Graph from '../graph/Graph';

class DataController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            endpoint: "http://127.0.0.1:4001",
        };
    }

    componentDidMount() {
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        socket.on("FromAPI", data => {
            this.setState({ data });
        });
        socket.on("disconnect", () => {
            console.log('disconnect');
        });
    }

    render() {
        return (
            <div>
                <button
                    onClick={this.stopReceiving}>
                    START
                </button>
                <button
                    onClick={this.stopReceiving} >
                    STOP
                </button>
                <Graph data={this.state.data} />
            </div>
        );
    }
}

export default DataController;