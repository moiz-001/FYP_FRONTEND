export const BASE_URL = 'http://192.168.100.28:5000';

const handleResponse = async (response) => {
    if (!response.ok) {
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            throw data || response.statusText;
        } catch (e) {
            throw text || response.statusText;
        }
    }
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
};

export const signup = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

export const login = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

export const citiess = async (provienceId) => {
    try {
        const res = await fetch(`${BASE_URL}/getCities/${provienceId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await handleResponse(res);
    } catch (error) {
        throw error;
    }
}

export const getLands = async (fId) => {
    try {
        const res = await fetch(`${BASE_URL}/getFarmerAllLands/${fId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await handleResponse(res);
    } catch (error) {
        throw error;
    }
}

export const addLand = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/addFarmerLand`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

export const updateLand = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/editFarmerLand`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

export const GetCurrentSessionOfFarmer = async (lId) => {
    try {
        const res = await fetch(`${BASE_URL}/CurrentSessionOfFarmer/${lId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await handleResponse(res);
    } catch (error) {
        throw error;
    }
}

export const getLandsbyFarmerName = async (Name) => {
    try {
        const res = await fetch(`${BASE_URL}/GetallLandsBYFarmersName/${Name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await handleResponse(res);
    } catch (error) {
        throw error;
    }
}

export const getFarmer = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/getFarmerById/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const getAllSessionsOfFarmerLand = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/getAllSessionsOfFarmerLand/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const updateFarmer = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/FarmerSetting`, {
            method: 'PUT',
            body: data,
        });
        return await handleResponse(response);
    } catch (error) {
        throw error;
    }
};

export const getAllCrops = async () => {
    try {
        const res = await fetch(`${BASE_URL}/getAllCrops`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const getSuggestedCrops = async (landId) => {
    try {
        const res = await fetch(`${BASE_URL}/recommend-crop/${landId}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const addFarmerCropSession = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/addFarmerCropSession`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) { throw error; }
};

export const getLandsWithCurrentSession = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/getLandsWithCurrentSession/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const getActivitiesList = async () => {
    try {
        const res = await fetch(`${BASE_URL}/getActivitiesList`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const getSuggestedActivities = async (sessionId) => {
    try {
        const res = await fetch(`${BASE_URL}/getSuggestedActivities/${sessionId}`);
        return await handleResponse(res);
    } catch (error) {
        throw error;
    }
}

export const getReminders = async (landId) => {
    try {
        const res = await fetch(`${BASE_URL}/getReminders/${landId}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const getAllActivitiesOfFarmer = async (farmerId) => {
    try {
        const res = await fetch(`${BASE_URL}/getAllActivitiesOfFarmer/${farmerId}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

// =======================
// Neighbour API Endpoints
// =======================

export const searchNeighbouringLands = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/seacrhNeighbouringLand`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) { throw error; }
};

export const addNeighbour = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/addNeighbour`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) { throw error; }
};

export const getNeighbourRequest = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/getNeighbourRequest/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const getNotifications = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/getNotifications/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const acceptNeighbourRequest = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/acceptNeighbourRequest/${id}`, { method: 'POST' });
        return await handleResponse(response);
    } catch (error) { throw error; }
};

export const rejectNeighbourRequest = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/rejectNeighbourRequest/${id}`, { method: 'DELETE' });
        return await handleResponse(response);
    } catch (error) { throw error; }
};

export const getAllLandsOfNeighbour = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/getAllLandsOfNeighbour/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const addNeighbourCropSession = async (data) => {
    try {
        // Since data is FormData containing "session" and "Activities"
        const response = await fetch(`${BASE_URL}/addNeighbourCropSession`, {
            method: 'POST',
            body: data,
        });
        return await handleResponse(response);
    } catch (error) { throw error; }
};

export const GetAllNeighboursWithLatestCrop = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/GetAllNeighboursWithLatestCrop/${id}`, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const GetAllNeighboursWithAllCorps = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/GetAllNeighboursWithAllCorps/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const ProfitableCropOfLandNeigbours = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/ProfitableCropOfLandNeigbours/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const getMostProfitableNeighbour = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/getMostProfitableNeighbour/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const getAllCropsOfNeighbour = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/getAllCropsOfNeighbour/${id}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const accountdate = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/HandleAccountDate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        });
        return await handleResponse(response);
    } catch (error) { throw error; }
};

export const HandlePublicSession = async (sessionId) => {
    try {
        const response = await fetch(`${BASE_URL}/HandlePublicSession/${sessionId}`, {
            method: 'POST',
        });
        return await handleResponse(response);
    } catch (error) { throw error; }
};

export const getSessionPerformedActivities = async (sessionId) => {
    try {
        const res = await fetch(`${BASE_URL}/getSessionPerformedActivities/${sessionId}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};


// Chat API Endpoints

export const getChatBySession = async (sessionId) => {
    try {
        const res = await fetch(`${BASE_URL}/getChatBySession/${sessionId}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const sendChat = async (data) => {
    try {
        const response = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await handleResponse(response);
    } catch (error) { throw error; }
};

export const getChatHistory = async (farmerId) => {
    try {
        const res = await fetch(`${BASE_URL}/getChats/${farmerId}`);
        return await handleResponse(res);
    } catch (error) { throw error; }
};

export const createChatSession = async (farmerId) => {
    try {
        const response = await fetch(`${BASE_URL}/createChatSession`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Farmer_id: farmerId }),
        });
        return await handleResponse(response);
    } catch (error) { throw error; }
};