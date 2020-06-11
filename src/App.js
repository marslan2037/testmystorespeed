import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Result from './components/Results/Result';

function App() {
    return (
        <>
            <Router>
                <div>
                    <hr />
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route path='/result/performance' component={Result} />
                        <Route path='/result/pages' component={Result} />
                        <Route path='/result/recommendations' component={Result} />
                        <Route path='/result/speed-history' component={Result} />
                        <Route path='/result/hire-developer' component={Result} />
                        <Route path='*' component={Home} />
                    </Switch>
                </div>
            </Router>
        </>
    );
}

export default App;
