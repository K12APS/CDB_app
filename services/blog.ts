import axios from 'axios';

const ADDRESS = "api.coderdojobrianza.it";
const PORT = "3131";

export const blog = async () => {
    try {
        const response = await axios.post(`https://${ADDRESS}:${PORT}/blog`);

        const allBlog = response.data;

        return allBlog;
    } catch (error) {
        console.error("Errore durante la chiamata API:", error);
        throw new Error("Impossibile recuperare i dati dal server");
    }
};
