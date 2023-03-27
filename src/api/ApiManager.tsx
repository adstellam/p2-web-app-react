import axios from 'axios';

const fieldUrl = process.env.REACT_APP_FIELD_API_URL;
const userLandUrl = process.env.REACT_APP_USERLAND_API_URL;
const authUrl = process.env.REACT_APP_AUTH_API_URL;


// TODO: Why do we return all of these as responses rather than
// defining types for each return value? For example getMachineUses
// should return a list of machine uses.

// =============================================================================
// USER AUTH
// =============================================================================

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${authUrl}/auth/signin`, {
      username,
      password,
    });
    await localStorage.setItem('jwt_token', response.data.jwt);
    return { response, error: null };
  } catch (error) {
    return {
      response: null,
      error: error
    };
  }
};

export const signout = async () => {
  await clearCacheDataAtLogout();
};

// =============================================================================
// USER DETAILS
// =============================================================================

export const getUserDetails = async () => {
  console.log('getUserDetails')
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await axios.get(`${userLandUrl}/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // TODO: This is called a bunch of times during startup
    return { response, error: null };
  } catch (error) {
    return {
      response: null,
      error: error,
    };
  }
};

export const getUser = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await axios.get(`${userLandUrl}/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve({ response: response, error: null });
  } catch (error) {
    return Promise.reject({ response: null, error: error });
  }
};

export const updateUser = async (
  userId: string,
  username: string,
  organizationName: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  jobTitle: string,
  role: string,
) => {
  const parameters = {
    user_id: userId,
    username,
    organization: organizationName,
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
    job_title: jobTitle,
    role: { name: role },
  };

  try {
    const token = localStorage.getItem('jwt_token');
    const response = await axios.put(`${userLandUrl}/user/`,
      parameters,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'Application/json',
        },
      },
    );
    return { response, error: null };
  } catch (error) {
    return {
      response: null,
      error: error,
    };
  }
};

// =============================================================================
// CACHE, LOCAL MEMORY
// =============================================================================

const clearCacheDataAtLogout = async () => {
  try {
    localStorage.removeItem('user_id');
    localStorage.removeItem('jwt_token');
  } catch (e) {
    console.log(`Error removing stored keys at logout. Err: ${e}`);
  }
};

// =============================================================================
// WI: Machine Uses
// =============================================================================

export const getMachineUseById = async (
  machineUseId: string,
) => {
  const token = localStorage.getItem('jwt_token');
  if (machineUseId === undefined) {
    return {
      response: null,
      error: 'Machine use id is undefined',
    };
  }
  try {
    const response = await axios.get(
      `${fieldUrl}/machine-use/${machineUseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // The api response models send a datetime object this object
    // does not have the timezone information. All times are UTC.
    response.data.start_time += 'Z';
    response.data.end_time += 'Z';
    response.data.gps_time += 'Z';

    return { response, error: null };
  } catch (error) {
    return {
      response: null,
      error: error
    };
  }
};

export const getMachineUses = async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await axios.get(
      `${fieldUrl}/machine-use/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // The api response models send a datetime object this object
    // does not have the timezone information. All times are UTC.
    response.data.forEach((element: any) => {
      element.start_time += 'Z';
      element.end_time += 'Z';
      element.gps_time += 'Z';
    });

    return { response, error: null };
  } catch (error) {
    return {
      response: null,
      error: error,
    };
  }
};
