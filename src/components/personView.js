import React, { Component } from 'react'
import Select from 'react-select'
import axios from 'axios'

export default class Person extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: props.person.name === "",
      new: props.person.name === "",
      person: props.person,
      original: props.person
    }

    this.updateState = this.updateState.bind(this)
    this.updateSelect = this.updateSelect.bind(this)
    this.getGeneration = this.getGeneration.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onCancel = this.onCancel.bind(this)
  }

  updateState(field, e, subfield) {
    if (subfield)
      this.setState({
        person: {
          ...this.state.person,
          [field]: {
            ...this.state.person[field],
            [subfield]: e.target.value
          }
        }
      })
    else
      this.setState({
        person: {
          ...this.state.person,
          [field]: e.target.value
        }
      })
  }

  updateSelect(field, options) {
    this.setState({
      person: {
        ...this.state.person,
        [field]: options.map(opt => ({_id: opt.value, name: opt.label}))
      }
    })
  }

  getGeneration(p, print = false) {      
    let checks = []
    if (p.parents.length) {
      let parents = p.parents.map(t => this.props.pplList.find(r => r._id === t._id))
      // if (print) console.log("a", parents)
      checks = checks.concat(parents.map(t => 1 + this.getGeneration(t)))
    }
    if (p.spouse.length) {
      let spouse = this.props.pplList.find(r => r._id === p.spouse[0]._id)
      // if (print) console.log("b", spouse)
      if (spouse.parents.length) {
        let spouseParents = spouse.parents.map(t => this.props.pplList.find(r => r._id === t._id))
        checks = checks.concat(spouseParents.map(t => 1 + this.getGeneration(t)))
      }
    }

    // if (print) console.log(p.name, checks)
    return Math.max(1, ...checks)
  }

  onEdit() {
    this.setState({editable: true})
  }

  onSubmit() {
    const data = {...this.state.person}
    data['spouse'] = data.spouse.map(t => t._id)
    data['exes'] = data.exes.map(t => t._id)
    data['parents'] = data.parents.map(t => t._id)

    this.setState({new: false})
    axios
      .post('http://localhost:3001/people', data)
      .then((res) => {
        this.setState({editable: false, original: this.state.person})
        this.props.cb()
      })
      .catch((err) => console.log(err))
  }

  onCancel() {
    this.setState({editable: false, person: this.state.original})
  }

  renderReadOnly(p) {
    return (
      <div className="card card-body">
        Birth: {p.birth?.date} {p.birth?.location ? ' in ' + p.birth?.location : ''}<br/>
        Death: {p.death?.date} {p.death?.location ? ' in ' + p.death?.location : ''}<br/>
        Burial: {p.death?.burial}<br/>
        Spouse: {(p.spouse || []).reduce((tot, cur) => tot + ", " + cur.name, "").substring(2)}<br/>
        {/* {(p.exes || []).length ? 'Former Marriages: ' + (p.exes || []).reduce((tot, cur) => tot + ", " + cur.name, "").substring(2) + '<br/>' : ''} */}
        Parents: {(p.parents || []).reduce((tot, cur) => tot + ", " + cur.name, "").substring(2)}<br/>
        Notes: {p.description.replace(/<tab>/g, '&nbsp;&nbsp;&nbsp;&nbsp;').replace(/\n/g, '<br/>')}
        <button className="btn btn-sm w-25 btn-outline-secondary" type="button" onClick={this.onEdit}>Edit</button>
      </div>
    )
  }

  renderEditable(p) {
    const cnLab = "w-15 mb-2"
    const cnLabR = "w-15 mb-2 ms-4"
    const cnSel = "w-50 d-inline-block mb-2"
    const format = (arr) => arr.map(a => ({label: a.name, value: a._id}))

    return (
      <div className="card card-body">
        <div className="form-group">
          {/* Name */}
          <label className={cnLab}>Name: </label>
          <input type="text" className="w-25" value={p.name} onChange={(e) => this.updateState('name', e)} />
          <br/>
          {/* Birth */}
          <label className={cnLab}>Birth: </label>
          <input type="text" className="w-25" value={p.birth?.date} onChange={(e) => this.updateState('birth', e, 'date')} />
          <label className={cnLabR}>Location: </label>
          <input type="text" className="w-25" value={p.birth?.location} onChange={(e) => this.updateState('birth', e, 'location')} />
          <br/>
          {/* Death */}
          <label className={cnLab}>Death: </label>
          <input type="text" className="w-25" value={p.death?.date} onChange={(e) => this.updateState('death', e, 'date')} />
          <label className={cnLabR}>Location: </label>
          <input type="text" className="w-25" value={p.death?.location} onChange={(e) => this.updateState('death', e, 'location')} />
          <br/>
          <label className={cnLab}>Burial: </label>
          <input type="text" className="w-25" value={p.death?.burial} onChange={(e) => this.updateState('death', e, 'burial')} />
          <br/>
          {/* Spouse */}
          <label className={cnLab}>Spouse: </label>
          <Select isMulti className={cnSel} defaultValue={format(p.spouse)} options={format(this.props.pplList)} onChange={(e) => this.updateSelect('spouse', e)} />
          <br/>
          {/* Exes */}
          <label className={cnLab}>Exes: </label>
          <Select isMulti className={cnSel} defaultValue={format(p.exes)} options={format(this.props.pplList)} onChange={(e) => this.updateSelect('exes', e)} />
          <br/>
          {/* Parents */}
          <label className={cnLab}>Parents: </label>
          <Select isMulti className={cnSel} defaultValue={format(p.parents)} options={format(this.props.pplList)} onChange={(e) => this.updateSelect('parents', e)} />
          <br/>
          {/* Notes */}
          <label className={cnLab}>Notes: </label>
          <textarea className="w-100" rows={5} value={p.description} onChange={(e) => this.updateState('description', e)} />
        </div>
        <div className="form-group">
          {/* <input type="submit" value="Save" className="btn w-25 btn-outline-secondary" /> */}
          <button className="btn w-25 btn-outline-secondary" onClick={this.onSubmit}>Submit</button>
          <button className="btn w-25 btn-outline-secondary" onClick={this.onCancel}>Cancel</button>
        </div>
      </div>
    )
  }

  render() {
    let p = this.state.person
    let cnCollapse = 'collapse' + (this.state.new ? ' show' : '')
    let gen = this.getGeneration(p, p.name.includes("Norman"))

    return (
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <button
              className="btn w-100 text-start"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={"#collapse-" + p._id}
            >Person - {p.name} - Generation {gen}</button>
          </h5>
        </div>

        <div className={cnCollapse} id={"collapse-" + p._id}>
          {this.state.editable ? this.renderEditable(p) : this.renderReadOnly(p)}
        </div>
      </div>
    )
  }
}
