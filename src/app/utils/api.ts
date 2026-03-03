import { projectId, publicAnonKey } from 'supabase/info';

// Konfiguracia API URL
const BASE_URL = 'https://' + projectId + '.supabase.co/functions/v1/make-server-15e718fc';

// Vytvorenie error objektu
const makeAPIError = (response: Response, data: any) => {
  let errorMessage = 'API request failed';
  
  if (data.error) {
    errorMessage = data.error;
  } else if (data.message) {
    errorMessage = data.message;
  }
  
  const error = new Error(errorMessage) as any;
  error.status = response.status;
  error.data = data;
  return error;
};

// Vytvorenie headers pre API requesty
const makeHeaders = (accessToken?: string, skipWarning = false) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'apikey': publicAnonKey,
    'Authorization': 'Bearer ' + publicAnonKey,
  };
  
  if (accessToken) {
    headers['X-Session-Token'] = accessToken;
  } else {
    if (!skipWarning) {
      console.warn('[WARNING] API call made without access token');
    }
  }
  
  return headers;
};

// Fetch s retry mechanikou
async function doFetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let attemptNumber = 0;
  
  while (attemptNumber < maxRetries) {
    try {
      const abortController = new AbortController();
      const timeoutMs = 15000;
      
      const timeout = setTimeout(() => {
        abortController.abort();
      }, timeoutMs);
      
      const requestOptions = {
        ...options,
        signal: abortController.signal
      };
      
      const resp = await fetch(url, requestOptions);
      
      clearTimeout(timeout);
      return resp;
    } catch (err: any) {
      let isTimeout = false;
      
      if (err.name === 'AbortError') {
        isTimeout = true;
      }
      
      if (err.message && err.message.includes('aborted')) {
        isTimeout = true;
      }
      
      let errMsg = err.message;
      if (isTimeout) {
        errMsg = 'Request timeout (15s)';
      }
      
      if (attemptNumber < maxRetries - 1) {
        // Retry pokus pre request
      } else {
        console.error('[ERROR] Request failed after ' + maxRetries + ' attempts for ' + url + ':', errMsg);
      }
      
      if (attemptNumber === maxRetries - 1) {
        if (isTimeout) {
          throw new Error('Request timeout - Server did not respond within 15 seconds. The backend might be slow or unavailable.');
        }
        throw new Error('Network error: ' + (err.message || 'Failed to connect to server'));
      }
      
      // Delay pred dalsim pokusom
      const delayMs = 1000 * (attemptNumber + 1);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
      attemptNumber = attemptNumber + 1;
    }
  }
  
  throw new Error('All retries failed');
}

// Typy
export interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

// AUTH API
export const authAPI = {
  signUp: async (params: SignUpParams) => {
    const url = BASE_URL + '/auth/signup';
    const headers = makeHeaders(undefined, true);
    const body = JSON.stringify(params);
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  signIn: async (params: SignInParams) => {
    const url = BASE_URL + '/auth/signin';
    const headers = makeHeaders(undefined, true);
    const body = JSON.stringify(params);
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  signOut: async (accessToken: string) => {
    const url = BASE_URL + '/auth/signout';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw makeAPIError(response, data);
    }

    return data;
  },

  getSession: async (accessToken: string) => {
    const url = BASE_URL + '/auth/session';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    return data;
  },
};

// PROFILE API
export const profileAPI = {
  getProfile: async (accessToken: string) => {
    const url = BASE_URL + '/profile';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.profile;
  },

  updateProfile: async (accessToken: string, updates: any) => {
    const url = BASE_URL + '/profile';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify(updates);
    
    const response = await doFetchWithRetry(url, {
      method: 'PUT',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.profile;
  },

  changeEmailDirect: async (accessToken: string, newEmail: string) => {
    const url = BASE_URL + '/profile/change-email-direct';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify({ newEmail: newEmail });
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  changePasswordDirect: async (accessToken: string, currentPassword: string, newPassword: string) => {
    const url = BASE_URL + '/profile/change-password-direct';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify({ 
      currentPassword: currentPassword, 
      newPassword: newPassword 
    });
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },
};

// PROGRESS API
export const progressAPI = {
  getProgress: async (accessToken: string) => {
    const url = BASE_URL + '/progress';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.progress;
  },

  updateProgress: async (accessToken: string, progress: any) => {
    const url = BASE_URL + '/progress';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify(progress);
    
    const response = await doFetchWithRetry(url, {
      method: 'PUT',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.progress;
  },

  getIslands: async (accessToken: string) => {
    const url = BASE_URL + '/islands';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.islands;
  },

  updateIslands: async (accessToken: string, islands: any) => {
    const url = BASE_URL + '/islands';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify(islands);
    
    const response = await doFetchWithRetry(url, {
      method: 'PUT',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.islands;
  },

  getExerciseData: async (accessToken: string) => {
    const url = BASE_URL + '/exercise-data';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    let exerciseData = data.exerciseData;
    if (!exerciseData) {
      exerciseData = {};
    }
    
    return exerciseData;
  },

  updateExerciseData: async (accessToken: string, exerciseData: any) => {
    const url = BASE_URL + '/exercise-data';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify(exerciseData);
    
    const response = await doFetchWithRetry(url, {
      method: 'PUT',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.exerciseData;
  },

  getStreak: async (accessToken: string) => {
    const url = BASE_URL + '/streak';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return { 
      count: data.streak, 
      activeToday: data.activeToday 
    };
  },

  incrementStreak: async (accessToken: string) => {
    const url = BASE_URL + '/streak';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return { 
      count: data.streak, 
      activeToday: data.activeToday 
    };
  },
};

// MISTAKES API
export const mistakesAPI = {
  getMistakes: async (accessToken: string) => {
    const url = BASE_URL + '/mistakes';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.mistakes;
  },

  addMistake: async (accessToken: string, mistake: any) => {
    const url = BASE_URL + '/mistakes';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify({ mistakes: mistake });
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.mistakes;
  },
};

// ADMIN API
export const adminAPI = {
  checkAdmin: async (accessToken: string) => {
    const url = BASE_URL + '/admin/check';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.isAdmin;
  },

  getAllUsers: async (accessToken: string) => {
    const url = BASE_URL + '/admin/users';
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data.users;
  },

  setAdminStatus: async (accessToken: string, userId: string, isAdmin: boolean) => {
    const url = BASE_URL + '/admin/set-admin';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify({ 
      userId: userId, 
      isAdmin: isAdmin 
    });
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  deleteUser: async (accessToken: string, userId: string) => {
    const url = BASE_URL + '/admin/delete-user';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify({ userId: userId });
    
    const response = await doFetchWithRetry(url, {
      method: 'DELETE',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  resetUserData: async (accessToken: string, userId: string) => {
    const url = BASE_URL + '/admin/reset-user-data';
    const headers = makeHeaders(accessToken);
    const body = JSON.stringify({ userId: userId });
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  getIslandImage: async (level: string, theme: string) => {
    const url = BASE_URL + '/island-image/' + level + '/' + theme;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': publicAnonKey,
      'Authorization': 'Bearer ' + publicAnonKey,
    };
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  uploadIslandImage: async (accessToken: string, level: string, theme: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('level', level);
    formData.append('theme', theme);
    formData.append('image', imageFile);

    const url = BASE_URL + '/admin/island-image';
    const headers = {
      'Authorization': 'Bearer ' + publicAnonKey,
      'apikey': publicAnonKey,
      'X-Session-Token': accessToken,
    };
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  deleteIslandImage: async (accessToken: string, level: string, theme: string) => {
    const url = BASE_URL + '/admin/island-image/' + level + '/' + theme;
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'DELETE',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  uploadContentImage: async (accessToken: string, level: string, theme: string, imageIndex: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('level', level);
    formData.append('theme', theme);
    formData.append('imageIndex', imageIndex);
    formData.append('image', imageFile);

    const url = BASE_URL + '/admin/content-image';
    const headers = {
      'Authorization': 'Bearer ' + publicAnonKey,
      'apikey': publicAnonKey,
      'X-Session-Token': accessToken,
    };
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  deleteContentImage: async (accessToken: string, level: string, theme: string, imageIndex: string) => {
    const url = BASE_URL + '/admin/content-image/' + level + '/' + theme + '/' + imageIndex;
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'DELETE',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  getContentImage: async (level: string, theme: string, imageIndex: string) => {
    const url = BASE_URL + '/admin/content-image/' + level + '/' + theme + '/' + imageIndex;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': publicAnonKey,
      'Authorization': 'Bearer ' + publicAnonKey,
    };
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  uploadKeywordImage: async (accessToken: string, level: string, theme: string, keywordIndex: string, imageFile: File) => {
    const formData = new FormData();
    formData.append('level', level);
    formData.append('theme', theme);
    formData.append('keywordIndex', keywordIndex);
    formData.append('image', imageFile);
    
    const url = BASE_URL + '/admin/keyword-image';
    const headers = {
      'Authorization': 'Bearer ' + publicAnonKey,
      'apikey': publicAnonKey,
      'X-Session-Token': accessToken,
    };
    
    const response = await doFetchWithRetry(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  deleteKeywordImage: async (accessToken: string, level: string, theme: string, keywordIndex: string) => {
    const url = BASE_URL + '/admin/keyword-image/' + level + '/' + theme + '/' + keywordIndex;
    const headers = makeHeaders(accessToken);
    
    const response = await doFetchWithRetry(url, {
      method: 'DELETE',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },

  getKeywordImage: async (level: string, theme: string, keywordIndex: string) => {
    const url = BASE_URL + '/admin/keyword-image/' + level + '/' + theme + '/' + keywordIndex;
    const headers = {
      'Content-Type': 'application/json',
      'apikey': publicAnonKey,
      'Authorization': 'Bearer ' + publicAnonKey,
    };
    
    const response = await doFetchWithRetry(url, {
      method: 'GET',
      headers: headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw makeAPIError(response, data);
    }
    
    return data;
  },
};