import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DagreD3 from '../src/DagreD3.jsx';
import '../build/styles.scss'

storiesOf('Dagre-D3', module)
    .add('basic', () => {
        let nodes = {
            '1': {
                label: '1',

            },
            '2': {
                label: '2'
            }
        };
        let edges = [
            ['1', '2', {}]
        ];
        return <DagreD3 nodes={nodes} edges={edges}/>
    })
    .add('zoomable', () => {
        let nodes = {
            'A': {
                label: 'A'
            },
            'B': {
                label: 'B'
            }
        };
        let edges = [
            ['A', 'B', {}]
        ];
        return <DagreD3 nodes={nodes} edges={edges} zoom/>
    })
    .add('onClick', () => {
        let nodes = {
            '1': {
                label: 'clickable node 1'
            },
            '2': {
                label: 'clickable node 2'
            }
        };
        let edges = [
            ['1', '2', {}]
        ];
        return <DagreD3 nodes={nodes} edges={edges} onNodeClick={action('clicked node')}/>
    });
