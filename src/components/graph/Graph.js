import React from 'react';


const graphLineColors = {
    cpuUsage: "#f44242",
    memUsage: "#5a37e8",
}

const topBotCanvasPadding = 25;
const canvasTextWidth = 30;
const labelFontSize = 12;


class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.arrayLen = 25;
        this.canvas = null;
        this.canvasHeight = 300;
        this.canvasWidth = getCanvasWidth();
        this.canvasCtx = null;
        this.state = {};

        this.drawLine = this.drawLine.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.drawGraphLabels = this.drawGraphLabels.bind(this);
        this.drawGrid = this.drawGrid.bind(this);

        this.graphLabels = [
            '    0%',
            '  25%',
            '  50%',
            '  75%',
            '100%',
        ];

        this.labelsDrawn = false;
    }

    drawLine(nodeIndex, val1, val2, propName) {
        // dobiti x poziciju
        let x1 = Math.floor((this.canvasWidth / this.arrayLen) * nodeIndex) + canvasTextWidth;
        let y1 = getYCoord(this.canvasHeight, val1);
        let x2 = Math.floor((this.canvasWidth / this.arrayLen) * (nodeIndex + 1)) + canvasTextWidth;
        let y2 = getYCoord(this.canvasHeight, val2);

        this.canvasCtx.lineWidth = 3;
        this.canvasCtx.lineJoin = "round";
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(x1, y1);
        this.canvasCtx.lineTo(x2, y2);
        this.canvasCtx.strokeStyle = graphLineColors[propName];
        this.canvasCtx.stroke();
    }

    drawGraphLabels() {
        const labelSpaceSize = this.canvasHeight - (2 * topBotCanvasPadding);
        const rowHeight = (labelSpaceSize / (this.graphLabels.length - 1));

        this.canvasCtx.fillStyle = "silver";
        this.canvasCtx.fillRect(0, 0, canvasTextWidth + 25, this.canvasHeight);

        this.canvasCtx.rect(0, 0, canvasTextWidth, 25);
        this.canvasCtx.rect(0, this.canvasHeight - 25, canvasTextWidth, this.canvasHeight);
        this.canvasCtx.stroke();

        for (let i = 0; i < this.graphLabels.length; i++) {
            this.canvasCtx.font = labelFontSize + "px Arial";
            let labelCoords = getLabelCoords(this.canvasHeight, rowHeight, i);

            this.canvasCtx.rect(labelCoords.x, labelCoords.y, canvasTextWidth, rowHeight);
            this.canvasCtx.stroke();

            this.canvasCtx.fillStyle = "black";
            this.canvasCtx.fillText(this.graphLabels[i], labelCoords.x, labelCoords.y);
        }
        this.labelsDrawn = true;
    }

    drawGrid() {
        const rowHeight = ((this.canvas.height - 2 * topBotCanvasPadding) / this.graphLabels.length);
        for (let i = 0; i < this.graphLabels.length; i++) {
            let coords = getLabelCoords(this.canvasHeight, rowHeight, i);
            this.canvasCtx.lineWidth = 1;
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(canvasTextWidth, coords.y);
            this.canvasCtx.lineTo(this.canvasWidth, coords.y);
            this.canvasCtx.strokeStyle = "silver"
            this.canvasCtx.stroke();
        }
    }

    updateCanvas() {
        if (!this.canvasCtx) return;
        // clear
        this.canvasCtx.clearRect(canvasTextWidth + 15, 0, this.canvasWidth, this.canvasHeight)
        this.drawGrid();

        for (let prop in this.state) {
            if (this.state[prop].length >= 2) {
                for (let i = 0, arrLen = this.state[prop].length - 1; i < arrLen; i++) {
                    let nodeIndex = getNodeIndex(arrLen, this.arrayLen, i);
                    this.drawLine(nodeIndex, this.state[prop][i], this.state[prop][i + 1], prop);
                }
            }
        }
    }

    componentDidMount() {
        this.canvasCtx = this.canvas.getContext('2d');
    }

    componentDidUpdate(prevProps) {
        if (!this.labelsDrawn) this.drawGraphLabels();

        if (prevProps.data !== this.props.data) {
            for (let prop in this.props.data) {

                if (typeof this.state[prop] === 'undefined') {
                    this.setState({ [prop]: [this.props.data[prop]] });
                } else {
                    let dataArr = this.state[prop].slice();

                    if (dataArr.length >= this.arrayLen) dataArr.shift();
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
                <div style={{ textAlign: "center" }}>
                    <canvas
                        style={{ border: "1px solid silver" }}
                        ref={elem => this.canvas = elem}
                        width={this.canvasWidth}
                        height={this.canvasHeight}
                    />
                </div>
            </div>
        )
    }
}

export default Graph;



function getCanvasWidth() {
    return 0.6 * window.innerWidth;
}

function getNodeIndex(currLen, maxLen, index) {
    // shift tocaka ako array nije pun
    if (currLen === maxLen) return index;
    else return maxLen - currLen + index;
}

function getYCoord(canvasHeight, value) {
    // posto canvasov koordinatni sustav koristi cetvrti kvadrant kartezijevog
    const paddedCanvasHeight = canvasHeight - (topBotCanvasPadding * 2);
    return canvasHeight - (Math.floor((value / 100) * paddedCanvasHeight)) - topBotCanvasPadding;
}

function getLabelCoords(canvasHeight, rowHeight, labelIndex) {
    // vraca x,y coord labela
    let x = 0.3 * canvasTextWidth;
    let y = canvasHeight - (((labelIndex + 1) * (rowHeight))) + labelFontSize + 29; 

    return {
        x,
        y
    }
}