import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Result from './components/Results/Result';

function App() {
    return (
        <>
            <Router>
                <div>
                {/* <h2>Welcome to React Router Tutorial</h2>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav mr-auto">
                    <li><Link to={'/'} className="nav-link"> Home </Link></li>
                    <li><Link to={'/performance'} className="nav-link">Contact</Link></li>
                </ul>
                </nav> */}
                <hr />
                <Switch>
                    <Route exact path='/' component={Home} />
                    {/* <Route exact path='/home' component={Home} /> */}
                    <Route path='/result' component={Result} />
                    <Route path='*' component={Home} />
                </Switch>
                </div>
            </Router>
        </>
    );
}

export default App;
