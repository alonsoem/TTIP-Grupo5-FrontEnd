import axios from "axios";

const environment = process.env.NODE_ENV;
let server = "";

if (environment === "production") {
  server = "http://TTIP-Grupo5-FrontEnd.herokuapp.com";
} else {
  server = "http://localhost:8080";
}

const authConfig = () => {
  return { Authorization: "Bearer " + localStorage.getItem("token") };
};

const request = (type, path, body, config) =>

  axios
    .request({
      url: `${server}${path}`,
      method: type,
      data: body,
      headers: config,

    })
    .then((req) => req.data);

export const getRule = (id) => request("get", "/rule/"+id, {}, authConfig());
export const getTax = (id) => request("get", "/broker/1/tax/"+id, {}, authConfig());
export const getTaxes = (body) => request("get", "/rate", body, authConfig());
export const getBrokers= (body) => request("get", "/broker", body, authConfig());
export const getFacts= () => request("get", "/facts", {}, authConfig());
export const getBroker= (id) => request("get", "/broker/"+id, {}, authConfig());
export const postCalc = (body) =>
  request("post", "/broker/calculate", body, authConfig());
export const postRegister = (body) => request("post", "/register", body, {});
export const postLogin = (body) =>
  request("post", "/authenticate", body, {
    headers: { "Content-Type": "application/json" },
  });
export const postBrokerCreate = (body) =>
    request("post", "/broker/create", body, authConfig());
export const postTaxCreate = (brokerId,body) =>
    request("post", "/broker/"+brokerId+"/tax", body, authConfig());
export const postRuleCreate = (taxId,body) =>
    request("post", "/tax/"+taxId+"/rule", body, authConfig());
export const putBrokerEdit = (brokerId,body) =>
    request("put", "/broker/"+brokerId, body, authConfig());
export const putTaxEdit = (taxId,body) =>
    request("put", "/broker/999/tax/"+taxId, body, authConfig());