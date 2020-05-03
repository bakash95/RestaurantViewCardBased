import React from 'react';
import './App.css';

import apiCaller from 'services/services'
import { performanceDataAction } from 'redux/actions/performanceDataActions'
import { connect } from 'react-redux';
import ListData from 'components/ListData';

function App() {
  return (
    <ListData />
  );
}

class AppErrWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isErrorPresent: false
    }
  }

  componentDidCatch() {
    this.setState({ isErrorPresent: true })
  }

  async componentDidMount() {
    try {
      let response = await apiCaller('initData')
      this.props.performanceDataAction(response);
    } catch (error) {
      throw error;
    }
  }

  render() {
    return (
      this.state.isErrorPresent ? <div>Sorry we have a error</div> :
        <App />
    )
  }
}

export default connect(null, { performanceDataAction })(AppErrWrapper);
