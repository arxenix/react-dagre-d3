import React from 'react';
import PropTypes from 'prop-types'
import * as dagreD3 from "dagre-d3";
import * as d3 from "d3";

import isEqual from 'react-fast-compare';

class DagreD3 extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !isEqual(this.props.nodes, nextProps.nodes) ||
            !isEqual(this.props.edges, nextProps.edges) ||
            !isEqual(this.props.zoom, nextProps.zoom)
    }

    componentDidMount() {
        this.renderDag();
    }

    componentDidUpdate() {
        this.renderDag();
    }

    renderDag() {
        let g = new dagreD3.graphlib.Graph().setGraph({});


        for (let [id, node] of Object.entries(this.props.nodes))
            g.setNode(id, node);

        for (let edge of this.props.edges)
            g.setEdge(edge[0], edge[1], edge[2]); // from, to, props

        // Set up an SVG group so that we can translate the final graph.
        let svg = d3.select(this.nodeTree);
        let inner = d3.select(this.nodeTreeGroup);

        // set up zoom support
        if (this.props.zoom) {
            let zoom = d3.zoom().on("zoom",
                () => inner.attr("transform", d3.event.transform));
            svg.call(zoom);
        }

        // Create the renderer
        let render = new dagreD3.render();

        // set up custom shape renderers
        if (this.props.shapeRenderers)
            for (let [shape, renderer] of Object.entries(this.props.shapeRenderers))
                render.shapes()[shape] = renderer;

        // Run the renderer. This is what draws the final graph.
        render(inner, g);


        // TODO add padding?
        svg.attr("height", g.graph().height);
        svg.attr("width", g.graph().width);

        if (this.props.onNodeClick)
            svg.selectAll('.dagre-d3 .node').on('click',
                    id => this.props.onNodeClick(id));
    }

    render() {
        // width and height are set to 1 due to a FireFox bug(?) If set to 0, it complains.
        return (
            <svg className='dagre-d3' ref={(r) => {this.nodeTree = r}}
                 width="1"
                 height="1">

                <g ref={(r) => {this.nodeTreeGroup = r}}/>
            </svg>
        );
    }
}

DagreD3.propTypes = {
    nodes: PropTypes.object.isRequired,
    edges: PropTypes.array.isRequired,
    zoom: PropTypes.bool,
    shapeRenderers: PropTypes.objectOf(PropTypes.func),
    onNodeClick: PropTypes.func,
};

export default DagreD3;