import React from 'react';


const graphLineColors = {
    cpuUsage: "#f44242",
    memUsage: "#5a37e8",
}

const topBotCanvasPadding = 25;
const canvasTextWidth = 50;
const labelFontSize = 12;

const graphBorderSize = 1;


class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.arrayLen = 10;
        this.canvas = null;
        this.canvasHeight = 250;
        this.canvasWidth = getCanvasWidth();
        this.canvasCtx = null;
        this.state = {};

        this.drawLine = this.drawLine.bind(this);
        this.updateCanvas = this.updateCanvas.bind(this);
        this.drawGraphLabels = this.drawGraphLabels.bind(this);
        this.drawBoardFrame = this.drawBoardFrame.bind(this);

        this.labelCoordinates = null;

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
        let x1 = Math.floor((this.canvasWidth / (this.arrayLen - 1)) * (nodeIndex - 1)) + canvasTextWidth;
        let y1 = getYCoord(this.canvasHeight, val1);
        let x2 = Math.floor((this.canvasWidth / (this.arrayLen - 1)) * (nodeIndex)) + canvasTextWidth;
        let y2 = getYCoord(this.canvasHeight, val2);

        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = graphLineColors[propName];
        this.canvasCtx.lineJoin = "round";
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(x1, y1);
        this.canvasCtx.lineTo(x2, y2);
        this.canvasCtx.stroke();
    }

    drawGraphLabels() {
        let labelCoordinates = getLabelYCoordinates(this.canvasHeight, this.graphLabels);
        let labelLinesCoordinates = getLabelLinesYCoordinates(this.canvasHeight, this.graphLabels);

        for (let i = 0; i < this.graphLabels.length; i++) {
            this.canvasCtx.font = labelFontSize + "px Arial";
            this.canvasCtx.fillStyle = "black";
            this.canvasCtx.fillText(this.graphLabels[i], 0.3 * canvasTextWidth, labelCoordinates[i]);

            this.canvasCtx.lineWidth = 2;
            this.canvasCtx.strokeStyle = graphLineColors[propName];
            this.canvasCtx.lineJoin = "round";
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(x1, y1);
            this.canvasCtx.lineTo(x2, y2);
            this.canvasCtx.stroke();
        }

        this.labelsDrawn = true;
    }

    updateCanvas() {
        if (!this.canvasCtx) return;
        // clear
        this.canvasCtx.clearRect(canvasTextWidth, 0, this.canvasWidth, this.canvasHeight);

        for (let prop in this.state) {
            if (this.state[prop].length >= 2) {
                for (let i = 0, arrLen = this.state[prop].length - 1; i < arrLen; i++) {
                    let nodeIndex = getNodeIndex(arrLen, this.arrayLen, i);
                    this.drawLine(nodeIndex, this.state[prop][i], this.state[prop][i + 1], prop);
                }
            }
        }
        this.drawBoardFrame();
    }

    drawBoardFrame() {
        this.canvasCtx.rect(canvasTextWidth - graphBorderSize, 0 + graphBorderSize, this.canvasWidth - canvasTextWidth, this.canvasHeight - graphBorderSize);
        this.canvasCtx.strokeStyle = 'green';
        this.canvasCtx.lineWidth = graphBorderSize;
        this.canvasCtx.stroke();
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
    return 0.7 * window.innerWidth;
}

function getNodeIndex(currLen, maxLen, index) {
    // shift tocaka ako array nije pun
    if (currLen === maxLen) return index;
    else return maxLen - currLen + index;
}

function getYCoord(canvasHeight, value) {
    // posto canvasov koordinatni sustav koristi cetvrti kvadrant kartezijevog
    const paddedCanvasHeight = canvasHeight - (2 * topBotCanvasPadding);
    return canvasHeight - (Math.floor((value / 100) * paddedCanvasHeight)) - topBotCanvasPadding;
}

function getLabelYCoordinates(canvasHeight, graphLabels) {
    let numOfLabels = graphLabels.length;
    let coords = [];
    let canvasAvailableHeight = canvasHeight - 2 * topBotCanvasPadding;
    let percentPerLabel = 1 / (numOfLabels - 1);

    for (let i = graphLabels.length; i > 0; i--) {
        coords.push(
            (((i - 1) * percentPerLabel) * canvasAvailableHeight) + topBotCanvasPadding + (labelFontSize / 3)
        );
    }

    return coords;
}

function getLabelLinesYCoordinates(canvasHeight, graphLabels) {
    let numOfLabels = graphLabels.length;
    let coords = [];
    let canvasAvailableHeight = canvasHeight - 2 * topBotCanvasPadding;
    let percentPerLabel = 1 / (numOfLabels - 1);

    for (let i = graphLabels.length; i > 0; i--) {
        coords.push(
            (((i - 1) * percentPerLabel) * canvasAvailableHeight) + topBotCanvasPadding
        );
    }

    return coords;
}