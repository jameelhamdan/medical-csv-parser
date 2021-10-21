import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {Container} from "react-bootstrap";
import Navigation from "./components/navigation";
import {urls} from "./urls";
import "./index.css";


export default function App() {
    return (
        <div className="App">
            <Router>
                <Navigation/>
                <Switch>
                    <Container>
                        {urls.map(url =>
                            <Route key={url.path} exact path={url.path} component={url.component}/>
                        )}
                    </Container>
                </Switch>
            </Router>
        </div>
    );
}
