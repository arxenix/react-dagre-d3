import { configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options'

setOptions({
    name: 'REACT-DAGRE-D3 GITHUB',
    url: 'https://github.com/arxenix/React-DagreD3',
    goFullScreen: false,
    showLeftPanel: true,
    showDownPanel: true,
    showSearchBox: false,
    downPanelInRight: true
});

function loadStories() {
  require('../stories/index.jsx');
}

configure(loadStories, module);
