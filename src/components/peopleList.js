import React, { Component } from 'react'
import axios from 'axios'
import Person from './personView.js'

export default class PeopleList extends Component {
  constructor(props) {
    super(props)

    this.state = {people: [], view: "list", focus: "639fca09157c0d98c539738a"}

    this.renderListView = this.renderListView.bind(this)
    this.renderFamilyView = this.renderFamilyView.bind(this)
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this)
  }

  componentDidMount() {
    this.rerenderParentCallback()
  }

  rerenderParentCallback() {
    axios
      .get('http://localhost:3001/people')
      .then((res) => {
        let people = res.data.people
        let queue = ["63a4d9057cea2c3d48315e9b"] // , "63b8ec53a81fcec3d0514c9e"] // Conrad, Frank
        let hashmap = {"63a4d9057cea2c3d48315e9b": 1}

        // console.log(people)
        let iterations = 0
        while (queue.length && iterations < 150) {
          // iterations += 1
          let focus = queue[0]
          let cur = people.find(t => t._id === focus)

          let print = cur.name === 'Marion Alice Hickernell'
          if (print) console.log("a", cur.name, cur.generation)

          if (cur._id === "63a4d9057cea2c3d48315e9b") cur.generation = 1
          if (!cur.generation) {
            let spouse = cur.spouse.length ? people.find(t => t._id === cur.spouse[0]._id) : null
            let parents = cur.parents.map(r => people.find(t => t._id === r._id))
            let children = people.filter(t => t.parents.map(r => r._id).includes(cur._id))


            if (spouse?.generation) cur.generation = spouse.generation
            else if (parents.some(t => t.generation)) cur.generation = Math.max(...parents.map(t => t.generation + 1))
            else if (children.some(t => t.generation)) cur.generation = Math.min(...children.map(t => t.generation - 1))
            // else {
            //   let parents = cur.parents.map(r => people.find(t => t._id === r._id))
              // if (print) console.log(parents, parents.map(t => 1 + t.generation), Math.max(parents.map(t => 1 + t.generation)))
              // if (print) console.log(parents, parents.some(t => !t.generation))
              // if (parents.some(t => !t.generation)) parents.forEach(r => r.generation = cur.generation - 1)
            //   cur.generation = Math.max(...parents.map(t => 1 + t.generation))
            // }
          }
          if (cur.parents.length) {
            let parents = cur.parents.map(r => people.find(t => t._id === r._id)).filter(t => !hashmap[t._id])
            queue = queue.concat(parents.map(t => t._id))
            parents.forEach(t => hashmap[t._id] = 1)
          }
          if (cur.spouse.length) {
            let spouses = cur.spouse.map(r => people.find(t => t._id === r._id)).filter(t => !hashmap[t._id])
            // spouses.forEach(r => { if (!r.generation) r.generation = cur.generation })
            queue = queue.concat(spouses.map(t => t._id))
            spouses.forEach(t => hashmap[t._id] = 1)
          }
          let children = people.filter(t => t.parents.map(r => r._id).includes(cur._id)).filter(t => !hashmap[t._id])
          queue = queue.concat(children.map(t => t._id))
          children.forEach(t => hashmap[t._id] = 1)

          queue = queue.slice(1)
          // console.log("b", queue)
        }

        people.forEach(p => { if (!p.generation) p.generation = 1 })
        this.setState({people})
      })
      .catch((err) => console.log(err))
  }

  renderListView() {
    const pplList = this.state.people.map(p => ({_id: p._id, name: p.name})).filter(p => p.name)
    const minGen = Math.min(...this.state.people.map(p => p.generation))
    const maxGen = Math.max(...this.state.people.map(p => p.generation))
    const split = []
    for (let i = maxGen; i >= minGen; i--) {
      split.push({index: i, arr: this.state.people.filter(p => p.generation === i)})
    }
    
    return (
      <div>
        { split.map(s => {
          let { index, arr } = s
          return (
            <div key={"div-" + index}>
              <h3>Generation {index}</h3>
              {arr.map(p => <Person key={p._id || p.description} person={p} pplList={pplList} cb={this.rerenderParentCallback} />)}
            </div>
          )
        })}
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
    const pplList = this.state.people.map(p => ({_id: p._id, name: p.name})).filter(p => p.name)
    let template = {
      "name": "",
      "birth": {"date": "", "location": ""},
      "death": {"date": "", "location": "", "burial": ""},
      "exes": [],
      "parents": [],
      "spouse": [],
      "description": "New Person",
      "generation": 14
    }

    return (
      <div className="container pt-3">
        <div className="text-center pb-3">
          <div className="btn-group">
            <button className={cnLBtn} onClick={() => this.setState({view: 'list'})}>List View</button>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#createModal">Create</button>
            <button className={cnFBtn} onClick={() => this.setState({view: 'family'})}>Family View</button>
          </div>
        </div>

        { this.state.view === 'list' ? this.renderListView() : this.renderFamilyView() }

        <div className="modal fade" id="createModal" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Person</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={this.rerenderParentCallback}></button>
              </div>
              <div className="modal-body">
                <Person key="New Person" person={{...template}} pplList={pplList} isNew={true} cb={this.rerenderParentCallback} />
              </div>
              {/* <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
