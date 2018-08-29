import React, { Component } from 'react';
import { render } from 'react-dom';
import * as classService from '../services/classes';

class GoodbyeWorld extends Component {
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        classService.all() // gets all 'classes' from api
        .then(console.log);  // then console.log all the classes
    }

    render() {
        return <h1>Goodbye World!</h1>;
    }
}

export default GoodbyeWorld;