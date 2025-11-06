export let accessToken: string;

export function updateAccessToken(token: string) {
  accessToken = token;
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const MOBILE_API_URL = process.env.EXPO_PUBLIC_API_MOBILE_URL;
