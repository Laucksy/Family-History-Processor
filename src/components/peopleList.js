import React, { Component } from 'react'
import axios from 'axios'
import Person from './personView.js'

export default class PeopleList extends Component {
  constructor(props) {
    super(props)

    this.state = {people: [], view: "list", focus: "639fca09157c0d98c539738a"}

    this.onCreate = this.onCreate.bind(this)
    this.renderListView = this.renderListView.bind(this)
    this.renderFamilyView = this.renderFamilyView.bind(this)
  }

  componentDidMount() {
    axios
      .get('http://localhost:3001/people')
      .then((res) => this.setState({people: res.data.people}))
      .catch((err) => console.log(err))
  }

  onCreate() {
    let template = {
      "name": "",
      "birth": {"date": "", "location": ""},
      "death": {"date": "", "location": "", "burial": ""},
      "exes": [],
      "parents": [],
      "spouse": [],
      "description": "New Person"
    }

    this.setState({people: [...this.state.people, template]})
  }

  renderListView() {
    const pplList = this.state.people.map(p => ({_id: p._id, name: p.name})).filter(p => p.name)

    return (
      <div>
        { this.state.people.map(p => <Person key={p._id || p.description} person={p} pplList={pplList} />) }
        <button className="btn btn-sm w-25 btn-outline-secondary mt-3" type="button" onClick={this.onCreate}>Create</button>
      </div>
    )
  }

  renderFamilyView() {
    const pplList = this.state.people.map(p => ({_id: p._id, name: p.name})).filter(p => p.name)
    const cnLab = "mb-2 fw-bold"

    const focus = this.state.people
                    .find(p => p._id === this.state.focus)
    const parents = this.state.people
                    .filter(p => focus.parents.map(q => q._id).includes(p._id))
    const children = this.state.people
                    .filter(p => p.parents.map(q => q._id).includes(focus._id))
    const siblings = this.state.people
                    .filter(p => focus.parents.map(q => q._id).some(id => p.parents.map(q => q._id).includes(id)))
                    .filter(p => p._id !== focus._id)

    const generateRow = (person) => (
        <div key={"div" + person._id}>
          <div className="w-90 d-inline-block"><Person key={person._id} person={person} pplList={pplList} /></div>
          <button className="btn btn-secondary w-10 ms-2" onClick={() => this.setState({focus: person._id})}>-&gt;</button>
        </div>
    )

    return (
      <div>
        <label className={cnLab}>Focus Person: </label>
        { generateRow(focus) }
        <label className={cnLab}>Parents: </label>
        { parents.length ? parents.map(p => generateRow(p)) : <br/> }
        <label className={cnLab}>Children: </label>
        { children.length ? children.map(p => generateRow(p)) : <br/> }
        <label className={cnLab}>Siblings: </label>
        { siblings.length ? siblings.map(p => generateRow(p)) : <br/> }
      </div>
    )
  }

  render() {
    const cnLBtn = "btn " + (this.state.view === 'list' ? "btn-secondary" : "btn-light")
    const cnFBtn = "btn " + (this.state.view === 'family' ? "btn-secondary" : "btn-light")

    return (
      <div className="container pt-3">
        <div className="text-center pb-3">
          <div className="btn-group">
            <button className={cnLBtn} onClick={() => this.setState({view: 'list'})}>List View</button>
            <button className={cnFBtn} onClick={() => this.setState({view: 'family'})}>Family View</button>
          </div>
        </div>

        { this.state.view === 'list' ? this.renderListView() : this.renderFamilyView() }
      </div>
    )
  }
}
