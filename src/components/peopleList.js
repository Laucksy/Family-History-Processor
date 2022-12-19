import React, { Component } from 'react'
import axios from 'axios'
import Person from './personView.js'

export default class PeopleList extends Component {
  constructor(props) {
    super(props)

    this.state = {people: []}
  }

  componentDidMount() {
    axios
      .get('http://localhost:3001/people')
      .then((res) => this.setState({people: res.data.people}))
      .catch((err) => console.log(err))
  }

  render() {
    const pplList = this.state.people.map(p => p.name)
    return (
      <div className="container pt-3">
        {
          this.state.people.map(p => <Person key={p._id} person={p} pplList={pplList} />)
        }
      </div>
    )
  }
}
