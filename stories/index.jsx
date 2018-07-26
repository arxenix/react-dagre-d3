import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DagreD3 from '../src/DagreD3.jsx';
import * as dagreD3 from 'dagre-d3';
import './styles.scss'


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
    }
};


storiesOf('Dagre-D3', module)
    .add('basic', () => {
        return <DagreD3 nodes={graphs.simple.nodes} edges={graphs.simple.edges}/>
    })
    .add('svg size', () => {
        return <DagreD3 nodes={graphs.simple.nodes} edges={graphs.simple.edges} height={'400'} width={'400'} fit={false}/>
    })
    .add('interactive', () => {
        return <DagreD3 nodes={graphs.simple.nodes} edges={graphs.simple.edges} interactive height={'400'} width={'400'} fit={false}/>
    })
    .add('click events', () => {
        return <DagreD3 nodes={graphs.simple.nodes} edges={graphs.simple.edges} onNodeClick={action('clicked node')}/>
    })
    .add('node classes', () => {
        let classes = JSON.parse(JSON.stringify(graphs.simple));
        classes.nodes['1'].class = 'red';
        classes.nodes['2'].class = 'green';
        return <DagreD3 nodes={classes.nodes} edges={classes.edges}/>
    })
    .add('node shapes', () => {
        let shapes = JSON.parse(JSON.stringify(graphs.simple));
        shapes.nodes['1'].shape = 'circle';
        shapes.nodes['2'].shape = 'diamond';
        shapes.nodes['3'].shape = 'ellipse';
        shapes.nodes['4'].shape = 'rect';
        return <DagreD3 nodes={shapes.nodes} edges={shapes.edges}/>
    })
    .add('combined example', () => {
        let combined = JSON.parse(JSON.stringify(graphs.simple));
        combined.nodes['1'].class = 'clickable red';
        combined.nodes['1'].shape = 'circle';
        combined.nodes['4'].class = 'clickable red';
        combined.nodes['4'].shape = 'circle';
        return <DagreD3 nodes={combined.nodes} edges={combined.edges} onNodeClick={action('clicked node')}/>
    })
    .add('custom shape renderer', () => {
        let house = (parent, bbox, node) => {
            const w = bbox.width, h = bbox.height;
            const points = [
                    { x:   0, y:        0 },
                    { x:   w, y:        0 },
                    { x:   w, y:       -h },
                    { x: w/2, y: -h * 3/2 },
                    { x:   0, y:       -h }
                ];
            let shapeSvg = parent.insert("polygon", ":first-child")
                .attr("points", points.map(function(d) { return d.x + "," + d.y; }).join(" "))
                .attr("transform", "translate(" + (-w/2) + "," + (h * 3/4) + ")");

            node.intersect = (point) => dagreD3.intersect.polygon(node, points, point);
            return shapeSvg;
        };
        let combined = JSON.parse(JSON.stringify(graphs.simple));
        combined.nodes['2'].shape = 'house';
        return <DagreD3 nodes={combined.nodes} edges={combined.edges} shapeRenderers={{house: house}}/>
    });
