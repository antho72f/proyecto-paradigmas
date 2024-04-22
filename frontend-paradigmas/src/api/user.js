import axios from "./axios";

export const getUsersRequest = async () => axios.get("/usuarios");

export const createUserRequest = async (usuario) => axios.post("/usuarios", usuario);

export const updatePasswordRequest = async (usuario) => axios.put(`/usuarios/cambiarContrasena/${usuario._id}`, usuario);

export const updateUserRequest = async (usuario) => axios.put(`/usuarios/${usuario._id}`, usuario);

export const deleteUserRequest = async (id) => axios.delete(`/usuarios/${id}`);

export const getUserRequest = async (id) => axios.get(`/usuarios/${id}`);