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
    }

    render() {
        return (
            <Graph data={this.state.data} />
        );
    }
}

export default DataController;