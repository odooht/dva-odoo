
import baseModel from './models/baseModel';
import resPartner from './models/resPartner';

const modelCreators = {
  'base': baseModel ,
  'res.users':baseModel,
  'res.partner':resPartner,

}

const mockModel = ( options ) => {

  const { records, model='base', extend={} } = options;

  const creator = modelCreators[model] ? modelCreators[model] : baseModel;

  const methods = creator(records);

  return { ...methods, ...extend }
}


export default mockModel


