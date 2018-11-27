    
    dva model = {
        namespace : userssss
        state: {
            wwwww,
            sssss
        }
        
        effect:{
            *query(payload,{put,call}){
                user_cls = odoo.model('res.users')
                domain = payload
                users = yield user_cls.search(domain,)
                put({ type: save1 payload: {users} })
                us = yield users.lookup()
                put({ type: save2, payload: {us} })
                tbls = yield users[1].attr( do_tables, 1 )
                wwww = yield us[1].attr('board_ids',1 )
                yield put({ type: save2, payload: {www} })
            }
        }
        
        reducer:{
            save1(state, payload){
                return {...state, ...payload}
            }
            save2(state, payload){
                return {...state, ...payload}
            }
        }
    
    }
    

//
    
    mount()
       dispatch({
           type: userssss/query
           payload: {}
       })
    
    
    render()
        wwwww = this.userssss.wwwww
        <div>{www}</div>






query = async (payload,{put,call}){
                user_cls = odoo.model('res.users')
                domain = payload
                users = await user_cls.search(domain,)
                setState ({ type: save1 payload: {users} })
                us = await users.lookup()
                setState ({ type: save2, payload: {us} })
                tbls = await users[1].attr( do_tables, 1 )
                wwww = await us[1].attr('board_ids',1 )
                setState ({ type: save2, payload: {www} })
}