import React  from 'react';
import ReactDOM  from 'react-dom';
import { ReactI13n }  from 'react-i13n';


//export default class App extends React.Component {
class App extends React.Component {

  componentDidMount() {
    ReactI13n.getInstance().execute('pageview', {
      url: '/home',
      title: 'ga test homepage'
    });
  }

  render() {
    return (
      <div>
        Hello World
      </div>
      )
  }
}
export default App;