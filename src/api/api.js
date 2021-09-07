import axios from 'axios';

const environment = process.env.NODE_ENV;
let server ='';

if (environment=='development'){
    server = 'http://localhost:8080';
}else{
    server = 'http://grupoj-2021-backend.herokuapp.com';
}

const config =  {'Authorization': 'Bearer ' + localStorage.getItem("token")};

const request = (type, path, body, config) => axios
      .request({ url: `${server}${path}`, method: type, data: body ,headers:config   })
      .then(req => req.data);

const foreignRequest = (type, fullPath, body, config) => axios
    .request({ url: `${fullPath}`, method: type, data: body ,headers:config })
    .then(req => req.data);

export const getTaxes = body => request('get', '/taxes', body,config);
export const postRegister = body => request('post', '/register', body,{});
export const postLogin = body => request('post', '/authenticate', body,{headers:{'Content-Type':'application/json'}});
