import React from 'react';


// podatci u propsima, bavi se njihovim prikazom

class Graph extends React.Component {
    constructor(props) {
        super();
        this.canvas = null;
        this.canvasHeight = 200;
        this.canvasWidth = 500;
        this.state = {};

        this.graphData = {};

    }

    drawLine(nodeNum, point1, point2) {
        console.log(nodeNum + ": [" + point1 + ", " + point2 + "]");
    }

    updateCanvas() {
        if (!this.canvasCtx) return;

        this.canvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

        for (let prop in this.state) {
            if (this.state[prop].length >= 2) {
                for (let i = 0; i < this.state[prop].length - 1; i++) {
                    this.drawLine(i, this.state[prop][i], this.state[prop][i + 1]);
                }
            }
        }

        this.canvasCtx.fillRect(0, 0, this.props.data.cpuUsage, 100);
    }
    componentDidMount() {
        this.canvasCtx = this.canvas.getContext('2d');
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            for (let prop in this.props.data) {

                if (typeof this.state[prop] === 'undefined') {
                    this.setState({ [prop]: [this.props.data[prop]] });
                } else {
                    let dataArr = this.state[prop].slice();

                    if (dataArr.length >= 10) dataArr.shift();
                    dataArr.push(this.props.data[prop]);
                    this.setState({ [prop]: dataArr });
                }
            }
        }
        this.updateCanvas();
    }

    render() {

        return (
            <div>
                <span>TEST</span>
                <canvas
                    ref={elem => this.canvas = elem}
                    width={this.canvasWidth}
                    height={this.canvasHeight}
                />
            </div>
        )
    }
}

export default Graph;