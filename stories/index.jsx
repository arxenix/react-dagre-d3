import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';
import DagreD3 from '../src/DagreD3.jsx';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';
import './styles.scss';


let graphs = {
    simple: {
        nodes: {
            '1': {
                label: 'Node 1'
            },
            '2': {
                label: 'Node 2'
            },
            '3': {
                label: 'Node 3'
            },
            '4': {
                label: 'Node 4'
            }
        },
        edges: [
            ['1', '2', {}],
            ['1', '3', {}],
            ['2', '4', {}],
            ['3', '4', {}]
        ]
    },
    medium: {
        nodes: {
            '1': {}, '2': {}, '3': {}, '4': {}, '5': {},
            '6': {},
        },
        edges: [
            ['1', '2', {}],
            ['1', '3', {}],
            ['2', '4', {}],
            ['3', '4', {}],
            ['4', '5', {}],
            ['1', '6', {}],
            ['5', '6', {}]
        ]
    },
    large: {
        nodes: {
            '1': {}, '2': {}, '3': {}, '4': {}, '5': {}, '6': {},
            '7': {}, '8': {}, '9': {}, '10': {}, '11': {}, '12': {}
        },
        edges: [
            ['1', '2', {}],
            ['1', '5', {}],
            ['2', '3', {}],
            ['3', '4', {}],
            ['5', '6', {}],
            ['5', '7', {}],
            ['5', '8', {}],
            ['6', '9', {}],
            ['7', '10', {}],
            ['2', '9', {}],
            ['2', '10', {}],
            ['9', '11', {}],
            ['10', '11', {}],
            ['11', '12', {}]
        ]
    }
};


storiesOf('Basic Settings', module)
    .add('basic graph',
        withInfo(`
        A simple 4 node graph
        `)(() => {
        return <DagreD3 nodes={graphs.simple.nodes} edges={graphs.simple.edges}/>
    }))
    .add('svg size', withInfo(`
        Setting the size of the svg
        `)(() => {
        return <DagreD3 nodes={graphs.simple.nodes} edges={graphs.simple.edges} height={'400'} width={'400'}
                        fit={false}/>
    }))
    .add('interactive', withInfo(`
        Make the graph interactive (zoomable and draggable)
        `)(() => {
        return <DagreD3 nodes={graphs.simple.nodes} edges={graphs.simple.edges} interactive height={'400'} width={'400'}
                        fit={false}/>
    }))
    .add('another graph', withInfo(`
        A slightly more complex graph
        `)(() => {
        return <DagreD3 nodes={graphs.medium.nodes} edges={graphs.medium.edges}/>
    }))
    .add('complex graph', withInfo(`
        A more complex graph
        `)(() => {
        return <DagreD3 nodes={graphs.large.nodes} edges={graphs.large.edges}/>
    }));

storiesOf('Node Settings', module)
    .add('click events', withInfo(`
        Click handlers on nodes
        `)(() => {
        return <DagreD3 nodes={graphs.simple.nodes} edges={graphs.simple.edges} onNodeClick={action('clicked node')}/>
    }))
    .add('node classes', withInfo(`
        Attach classes to specific nodes
        `)(() => {
        let classes = JSON.parse(JSON.stringify(graphs.simple));
        classes.nodes['1'].class = 'red';
        classes.nodes['2'].class = 'green';
        return <DagreD3 nodes={classes.nodes} edges={classes.edges}/>
    }))
    .add('node shapes', withInfo(`
        Set custom node shapes (rect, ellipse, circle, diamond)
        `)(() => {
        let shapes = JSON.parse(JSON.stringify(graphs.simple));
        shapes.nodes['1'].shape = 'circle';
        shapes.nodes['2'].shape = 'diamond';
        shapes.nodes['3'].shape = 'ellipse';
        shapes.nodes['4'].shape = 'rect';
        return <DagreD3 nodes={shapes.nodes} edges={shapes.edges}/>
    }))
    .add('combined example', withInfo(`
        Example showing all of the above
        `)(() => {
        let combined = JSON.parse(JSON.stringify(graphs.simple));
        combined.nodes['1'].class = 'clickable red';
        combined.nodes['1'].shape = 'circle';
        combined.nodes['4'].class = 'clickable red';
        combined.nodes['4'].shape = 'circle';
        return <DagreD3 nodes={combined.nodes} edges={combined.edges} onNodeClick={action('clicked node')}/>
    }))
    .add('custom shape renderer', withInfo(`
        A custom shape renderer
        `)(() => {
        let house = (parent, bbox, node) => {
            const w = bbox.width, h = bbox.height;
            const points = [
                {x: 0, y: 0},
                {x: w, y: 0},
                {x: w, y: -h},
                {x: w / 2, y: -h * 3 / 2},
                {x: 0, y: -h}
            ];
            let shapeSvg = parent.insert("polygon", ":first-child")
                .attr("points", points.map(function (d) {
                    return d.x + "," + d.y;
                }).join(" "))
                .attr("transform", "translate(" + (-w / 2) + "," + (h * 3 / 4) + ")");

            node.intersect = (point) => dagreD3.intersect.polygon(node, points, point);
            return shapeSvg;
        };
        let combined = JSON.parse(JSON.stringify(graphs.simple));
        combined.nodes['2'].shape = 'house';
        return <DagreD3 nodes={combined.nodes} edges={combined.edges} shapeRenderers={{house: house}}/>
    }));

storiesOf('Edge Settings', module)
    .add('edge classes', withInfo(`
        Attaching classes to specific edges
        `)(() => {
        let curve = JSON.parse(JSON.stringify(graphs.simple));
        curve.edges[1][2].class = 'dashed';
        curve.edges[2][2].class = 'dashed';
        return <DagreD3 nodes={curve.nodes} edges={curve.edges}/>
    }))
    .add('custom edge renderer', withInfo(`
        An example of using d3's default curveBasis renderer
        `)(() => {
        let curve = JSON.parse(JSON.stringify(graphs.simple));
        for (let edge of curve.edges) {
            edge[2].curve = d3.curveBasis;
        }
        return <DagreD3 nodes={curve.nodes} edges={curve.edges}/>
    }));
