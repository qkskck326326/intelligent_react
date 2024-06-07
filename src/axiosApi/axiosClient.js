import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:9999"
});

export {axiosClient};