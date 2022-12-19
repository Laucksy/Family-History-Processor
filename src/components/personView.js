import React, { Component } from 'react'
import Select from 'react-select'

export default class Person extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editable: false,
      person: props.person
    }

    this.updateState = this.updateState.bind(this)
    this.onEdit = this.onEdit.bind(this)
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
        [field]: options.map(opt => opt.value)
      }
    })
  }

  onEdit() {
    this.setState({editable: true})
  }

  onCancel() {
    this.setState({editable: false, person: this.props.person})
  }

  renderReadOnly(p) {
    return (
      <div className="card card-body">
        Birth: {p.birth?.date} {p.birth?.location ? ' in ' + p.birth?.location : ''}<br/>
        Death: {p.death?.date} {p.death?.location ? ' in ' + p.death?.location : ''}<br/>
        {p.death?.burial ? 'Burial: ' + p.death?.burial + '<br/>' : ''}
        Spouse: {(p.spouse || []).reduce((tot, cur) => tot + ", " + cur.name, "").substring(2)}<br/>
        {(p.exes || []).length ? 'Former Marriages: ' + (p.exes || []).reduce((tot, cur) => tot + ", " + cur.name, "").substring(2) + '<br/>' : ''}
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
    const format = (arr) => arr.map(a => ({label: a.name || a, value: a.name || a}))

    return (
      <div className="card card-body">
        <form onSubmit={this.onSubmit}>
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
            {/* <select className="selectpicker" multiple={true} data-live-search="true" value={p.spouse.map(t => t.name)} onChange={(e) => this.updateState('spouse', e)}>
              {
                this.props.pplList.map(name => <option key={name} value={name}>{name}</option>)
              }
            </select> */}
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
            <input type="submit" value="Save" className="btn w-25 btn-outline-secondary" />
            <button className="btn w-25 btn-outline-secondary" onClick={this.onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    )
  }

  render() {
    let p = this.state.person
    
    return (
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <button
              className="btn w-100 text-start"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={"#collapse-" + p._id}
            >Person - {p.name}</button>
          </h5>
        </div>

        <div className="collapse" id={"collapse-" + p._id}>
          {this.state.editable ? this.renderEditable(p) : this.renderReadOnly(p)}
        </div>
      </div>
    )
  }
}
