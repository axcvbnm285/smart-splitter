import axios from "axios";

const instance = axios.create({
  baseURL: "https://smart-splitter.onrender.com",
});

export default instance;
