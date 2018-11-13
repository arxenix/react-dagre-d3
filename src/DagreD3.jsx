import React from 'react'
import PropTypes from 'prop-types'
import * as dagreD3 from 'dagre-d3'
import * as d3 from 'd3'

import isEqual from 'react-fast-compare'

class DagreD3 extends React.Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        height: "1",
        width: "1",
        graph: {},
        // width and height are defaulted to 1 due to a FireFox bug(?) If set to 0, it complains.
        fit: true,
        interactive: false
    };

    static propTypes = {
        nodes: PropTypes.object.isRequired,
        edges: PropTypes.array.isRequired,
        graph: PropTypes.object,
        interactive: PropTypes.bool,
        fit: PropTypes.bool,
        height: PropTypes.string,
        width: PropTypes.string,
        shapeRenderers: PropTypes.objectOf(PropTypes.func),
        onNodeClick: PropTypes.func,
    };

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
        const { nodes, edges, graph, fit, onNodeClick } = this.props;

        const g = new dagreD3.graphlib.Graph()
            .setGraph({ ...graph }) // Set an object for the graph label
            .setDefaultEdgeLabel({}); // Default to assigining a new object as a label for each new edge

        Object.keys(nodes).forEach((id) => {
            g.setNode(id, nodes[id]);
        })
        
        edges.forEach((e) => {
            e[2] ? g.setEdge(e[0], e[1], e[2]) : g.setEdge(e[0], e[1]) // when props is undefined
        })

        // Set up an SVG group so that we can translate the final graph.
        let svg = d3.select(this.nodeTree);
        let inner = d3.select(this.nodeTreeGroup);

        // set up zoom support
        if (this.props.interactive) {
            let zoom = d3.zoom().on("zoom",
                () => inner.attr("transform", d3.event.transform));
            svg.call(zoom);
        }

        // Create the renderer
        let render = new dagreD3.render();

        // set up custom shape renderers
        if (this.props.shapeRenderers) {
            for (let [shape, renderer] of Object.entries(this.props.shapeRenderers))
                render.shapes()[shape] = renderer;
        }

        // Run the renderer. This is what draws the final graph.
        render(inner, g);

        // TODO add padding?
        if (fit) {
            let { height: gHeight, width: gWidth } = g.graph();
            let { height, width } = this.nodeTree.getBBox();
            let transX = width - gWidth;
            let transY = height - gHeight;
            svg.attr('viewBox', `0 0 ${width} ${height}`); // adaptation
            inner.attr("transform", d3.zoomIdentity.translate(transX, transY));
        }
        
        if (onNodeClick) {
            svg.selectAll('.dagre-d3 .node').on('click',
                    id => onNodeClick(id));
        }
    }

    render() {
        return (
            <svg width="100%" height="100%" className='dagre-d3' ref={(r) => {this.nodeTree = r}}>
                <g ref={(r) => {this.nodeTreeGroup = r}}/>
            </svg>
        );
    }
}

export default DagreD3;