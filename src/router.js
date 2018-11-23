import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect, routerRedux } from 'dva/router'
import dynamic from 'dva/dynamic'
import App from 'routes/app'

const { ConnectedRouter } = routerRedux

const Routers = function ({ history, app }) {
  const routes = [
    {
      path: '/txDetail',
      component: () => import('./routes/txDetail/'),
    },
    {
      path: '/segwitAdress',
      component: () => import('./routes/segwit/segwitAdress.js'),
    },
    {
      path: '/startSegwit',
      component: () => import('./routes/segwit/startSegwit.js'),
    },
    {
      path: '/downPage',
      component: () => import('./routes/downPage/'),
    },
  ]

  return (
    <ConnectedRouter history={history}>
      <App>
        <Switch>
          <Route exact path="/" />
          {
            routes.map(({ path, ...dynamics }, key) => (
              <Route key={key}
                exact
                path={path}
                component={dynamic({
                  app,
                  ...dynamics,
                })}
              />
            ))
          }
        </Switch>
      </App>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
