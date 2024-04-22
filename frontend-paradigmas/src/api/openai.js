import axios from "./axios";

export const openaiRequest = async (inputValue) => axios.post(`/openai`, inputValue);