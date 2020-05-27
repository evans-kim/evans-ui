import ErrorHandler from './ErrorHandler'
import store from "../store";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

axios.interceptors.response.use(
    (res)=>{
        if( res.headers.hasOwnProperty('x-front-version') ){
            store.commit('setFrontVersion', { version: res.headers['x-front-version'] });
        }
        return res;
    },
    ErrorHandler
);

export default axios;
