import React from 'react'
import {BrowserRouter as Router,Route} from 'react-router-dom'
import Login from './login/login'
import Info from './info/info'
import Admin from './admin/admin'
function RouterPage(){
    return (<Router>
        <Route path='/login' component={Login} />
        <Route path='/info' component={Info} />
        <Route path='/admin' component={Admin} />
    </Router>)
}

export default RouterPage