import API from "../api/axios";

export const generatePortfolio = async (fileOrData) => {
    let payload = fileOrData;
    let config = {};

    if (fileOrData instanceof File) {
        const formData = new FormData();
        formData.append("resume", fileOrData);
        payload = formData;
        config.headers = { "Content-Type": "multipart/form-data" };
    } else if (typeof fileOrData === "string") {
        payload = { resumeId: fileOrData };
    }

    const response = await API.post("/portfolio/generate", payload, config);
    return response.data;
};


export const publishPortfolio = async (template) => {
    const response = await API.post("/portfolio/publish", { template });
    return response.data;
};


export const getPublicPortfolio = async (slug) => {
    const response = await API.get(`/portfolio/public/${slug}`);
    return response.data;
};