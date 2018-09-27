import addons from './addons'

export default (options) => {
    const {inherit='base', extend } = options;

    const create = addons[inherit];

    if ( ! create ){
      return { ...options, inherit }
    }

    return create( options );

}




