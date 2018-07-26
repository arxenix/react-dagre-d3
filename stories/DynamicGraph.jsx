import React from "react";
import DagreD3 from '../src/DagreD3.jsx';

class DynamicGraph1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: {},
            edges: [],
            index: 0
        };
    }

    componentDidMount() {
        this.update();
        this.timerID = setInterval(
            () => this.update(),
            1500
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    update() {
        let nodes = {};
        let edges = [];
        nodes['input'] = {};
        nodes['output'] = {};

        for (let i = 0; i < this.state.index + 1; i++) {
            nodes[`${i}`] = {
                label: `Task ${i}`
            };
            edges.push(['input', `${i}`, {}]);
            edges.push([`${i}`, 'output', {}]);
        }

        this.setState({nodes: nodes, edges: edges, index: (this.state.index + 1) % 5});
    }

    render() {
        return <DagreD3 nodes={this.state.nodes} edges={this.state.edges}/>
    }
}

class DynamicGraph2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: {},
            edges: [],
            index: 0
        };
    }

    componentDidMount() {
        this.update();
        this.timerID = setInterval(
            () => this.update(),
            10
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    RGB2Color(r,g,b) {
        return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
    }

    update() {
        let nodes = {};
        let edges = [];
        nodes['input'] = {};
        nodes['output'] = {};


        edges.push(['input', 'color', {}]);
        edges.push(['color', 'output', {}]);

        let center = 128;
        let width = 127;
        let frequency = Math.PI*2/360;
        let red   = Math.sin(frequency*this.state.index+2) * width + center;
        let green = Math.sin(frequency*this.state.index+0) * width + center;
        let blue  = Math.sin(frequency*this.state.index+4) * width + center;
        nodes['color'] = {
            label: 'taste the rainbow',
            style: `fill: ${this.RGB2Color(red, green, blue)};`
        };
        this.setState({nodes: nodes, edges: edges, index: (this.state.index + 1) % 360})
    }

    render() {
        return <DagreD3 nodes={this.state.nodes} edges={this.state.edges}/>
    }
}

export {DynamicGraph1, DynamicGraph2} ;