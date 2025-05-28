import axios from 'axios';

const ADDRESS = "api.coderdojobrianza.it";
const PORT = "3131"

interface inte{ 
    size: number;
}
export const api = async (size : inte) => {
    //console.log(size);
    try {
    const response = await axios.post(`https://${ADDRESS}:${PORT}/api/events`, {
      page_size: size // Passa il valore desiderato
    });
    const allEvents: Event[] = response.data;
    //console.log(allEvents);
    //console.log(allEvents[0].name.text)
    return { events: allEvents, error: null }
    } catch (error : any) {
        console.error('Errore durante la chiamata al server:', error.message);
        //setError('Impossibile caricare gli eventi. Riprova più tardi.');
        return { events: [], error: 'Impossibile caricare gli eventi. Riprova più tardi.' }
    }
}