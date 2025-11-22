import { api } from "./axios"

//create new short link
export const createLinks = async (payload)=>{
   const res = await api.post("/api/links",payload); 
   return res.data;
}

// get all links
export const getAllLinks = async()=>{
    const res = await api.get("/api/links");
    return res.data;
}

// get single link stats
export const getLinkStats = async(code)=>{
    const res = await api.get(`/api/links/${code}`);
    return res.data;
}

// delete link
export const deleteLink = async(code)=>{
    const res = await api.delete(`/api/links/${code}`);
    return res.data;
}

// health
export const getHealth = async () => {
  const res = await api.get("/healthz");
  return res.data;
};