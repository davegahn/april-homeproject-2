import axios from 'axios';

axios.defaults.headers.post['Accept'] = '*/*';

const instance = axios.create({
	baseURL: 'http://lorem-ipsum.online/',
});

const jsonInstance = axios.create({
	baseURL: 'http://lorem-ipsum.online/',
	headers: {'Content-Type': 'application/json'}
});

export const setTokenApi = access_token => {
	instance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
};

export const clearTokenApi = () => {
	instance.defaults.headers.common['Authorization'] = undefined;
};

export const login = ({email, password}) =>
	jsonInstance.post('/user_token', {auth: {email, password}}).then(response => {
		if (response.data.result === 'error') return Promise.reject(response);
		return response;
	});

export const registration = ({email, password}) =>
	instance.post('/users', `email=${email}&password=${password}`).then(response => {
		if (response.data.result === 'error') return Promise.reject(response);
		return response;
	});

/**
 * Currency API calls
 */

export const buyCurrency = (currency, value) =>
	instance.get(`stock/exchange?symbol=${currency}&operation=purchase&sum=${value}`).then(response => {
		if (response.data.result === 'error') return Promise.reject(response.data.message);
		return response;
	});

export const sellCurrency = (currency, value) =>
	instance.get(`stock/exchange?symbol=${currency}&operation=sell&sum=${value}`).then(response => {
		if (response.data.result === 'error') return Promise.reject(response.data.message);
		return response;
	});


export const candles = (symbol, offset) => instance.get('/candles', {params: {symbol, offset}});
export const getCash = () => instance.get('/users/cash');
export const getUserInfo = () => instance.get('/users/me');

export const getUserTransactions = () => instance.get('/transactions?limit=1000');
export const getUserFeedById = id => instance.get(`/history?user_id=${id}`);
export const getFeed = from => instance.get(`/history_all?limit=20` + (from != null ? `&ceil_time=${from}` : ''));