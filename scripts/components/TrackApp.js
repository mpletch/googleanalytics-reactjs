import React  from 'react';
import ReactDOM  from 'react-dom';
import ReactI13nGoogleAnalytics from 'react-i13n-ga';
import { setupI13n }  from 'react-i13n';
import App from './App';

var gaplugin = new ReactI13nGoogleAnalytics(['UA-********-1']);

export default(setupI13n(App, {}, [gaplugin.getPlugin()] ));
