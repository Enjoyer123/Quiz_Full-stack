import axios from "axios";

export const fetchDataFromApi = async (url) => {
    try {
        const { data } = await axios.get(import.meta.env.VITE_API_URL + url);
        return data;
    } catch (error) {
        console.error("Error:", error);
        return error;
    }
};

export const postData = async (url, formData) => {
    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 201) {
            return response.data;
        } else {
            return { error: 'Failed to create product' };
        }
    } catch (error) {
        console.error("Error:", error);
        return { error: 'An error occurred while creating the product' };
    }
};

export const postDataCart = async (url, data) => {
    try {
        const response = await axios.post(import.meta.env.VITE_API_URL + url, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        } else {
            console.error("Error in Post Data:", response.data);
            return { status: false, msg: "Error in Post Data" };
        }
    } catch (error) {
        console.error("Post Data Error:", error);
        return { status: false, msg: error.message };
    }
};

export const postDataSignIn = async (url, formData) => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

export const editData = async (url, updateData) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_API_URL}${url}`, updateData);
        return data;
    } catch (error) {
        console.error("Error:", error);
        return error;
    }
};

export const deleteData = async (url) => {
    try {
        const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}${url}`);
        return data;
    } catch (error) {
        console.error("Error:", error);
        return error;
    }
};


