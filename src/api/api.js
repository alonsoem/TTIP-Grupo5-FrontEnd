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

export const getTaxes = (body) => request("get", "/tax", body, authConfig());
export const postCalc = (body) =>
  request("post", "/tax/calculate", body, authConfig());
export const postRegister = (body) => request("post", "/register", body, {});
export const postLogin = (body) =>
  request("post", "/authenticate", body, {
    headers: { "Content-Type": "application/json" },
  });
