import baseModel from './baseModel';


const partner = (records) => { return {
  findOrCreate: (email) => {
    const ids = Object.keys(records)
    const id = Math.max(...ids) + 1;
    records[id] = { id, name:email }
    return id
  },

}}

export default (records) => {
  return {...baseModel(records), ...partner(records) }
}

