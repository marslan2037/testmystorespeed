import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Result from './components/Results/Result';

function App() {
    return (
        <>
            // <Router>
            //     <div>
            //     <Switch>
            //         <Route exact path='/' component={Home} />
            //         <Route path='/result' component={Result} />
            //         <Route path='*' component={Home} />
            //     </Switch>
            //     </div>
            // </Router>

            <Home />
        </>
    );
}

export default App;
