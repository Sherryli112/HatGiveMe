const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

interface RequestOptions extends RequestInit {
  headers?: HeadersInit;
}

// 建立帶有 API Key 的 fetch 請求
async function apiRequest(
  endpoint: string,
  options: RequestOptions = {}
): Promise<Response> {
  const url = `${API_URL}/api${endpoint}`;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  // 加入 x-api-key header
  if (API_KEY) {
    headers.set('x-api-key', API_KEY);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

// GET 請求
export async function apiGet<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
  const response = await apiRequest(endpoint, {
    ...options,
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// POST 請求
export async function apiPost<T = any>(
  endpoint: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  const response = await apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// PUT 請求
export async function apiPut<T = any>(
  endpoint: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  const response = await apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// DELETE 請求
export async function apiDelete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
  const response = await apiRequest(endpoint, {
    ...options,
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// 登入 API
export async function login(email: string, password: string) {
  return apiPost<{ access_token: string; user: any }>('/auth/login', {
    email,
    password,
  });
}

// 註冊 API
export async function register(data: { email: string; password: string; name?: string }) {
  return apiPost<{ access_token: string; user: any }>('/auth/register', data);
}
