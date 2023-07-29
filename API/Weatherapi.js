import axios from "react-native-axios"
const forecastEndPoints = params => `http://api.weatherapi.com/v1/forecast.json?key=4eee1005463b4af19d4134902232907&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`
const locationEndPoints = params => `http://api.weatherapi.com/v1/search.json?key=4eee1005463b4af19d4134902232907&q=${params.cityName}`

const apicall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log('error', err);
        return null;

    }
}

export const fetchWeatherForecase = params => {
    return apicall(forecastEndPoints(params));
}
export const fetchLoactions = params => {
    return apicall(locationEndPoints(params));
}