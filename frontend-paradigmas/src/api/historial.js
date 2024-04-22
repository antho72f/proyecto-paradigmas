import axios from "./axios";

export const addMessageToHistoryRequest = async (mensaje) => axios.post("/historial", mensaje);

export const getMessagesByHistoryIdRequest = async (id) => axios.get(`/historial/${id}`)

export const deleteHistoryRequest = async (id) => axios.delete(`/historial/${id}`);

export const getHistoryByUserIdRequest = async (id) => axios.get(`/historial/usuario/${id}`);
