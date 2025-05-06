const API_BASE_URL = 'http://localhost:3000/api';

async function makeApiRequest(endpoint, method = 'GET', data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' // for cookies if using session
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Something went wrong');
    }
    
    return responseData;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export { makeApiRequest };

// Frontend/JavaScript/api.js For Bookmark ButtonOnly
export async function makeApiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('userToken');
  if (!token) {
      throw new Error('Please log in.');
  }

  const headers = {
      'Authorization': token,
      'Content-Type': 'application/json'
  };

  const config = {
      method,
      headers
  };

  if (body) {
      config.body = JSON.stringify(body);
  }

  try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.error || 'Request failed');
      }
      return data;
  } catch (error) {
      throw new Error(error.message || 'An error occurred');
  }
}

// subscription.js file relies on makeApiRequest from api.js


export async function makeApiRequest(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('userToken');
  if (!token) {
      throw new Error('Please log in.');
  }

  const headers = {
      'Authorization': token,
      'Content-Type': 'application/json'
  };

  const config = {
      method,
      headers
  };

  if (body) {
      config.body = JSON.stringify(body);
  }

  try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, config);
      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.error || 'Request failed');
      }
      return data;
  } catch (error) {
      throw new Error(error.message || 'An error occurred');
  }
}