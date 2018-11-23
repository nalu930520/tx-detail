

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import Spinner from '../components/Spinner'
import PageLoading from '../components/PageLoading'
import '../themes/index.less'
import './app.less'

const App = ({ children, app, loading, dispatch }) => {
  return (
    <div>
      <Helmet>
        <title>Mobi Transaction Details</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
      </Helmet>
      <div>
        {React.Children.toArray(children)}
      </div>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  app: PropTypes.object,
  dispatch: PropTypes.func,
}

export default withRouter(connect(({ app, loading, dispatch }) => ({ app, loading, dispatch }))(App))
