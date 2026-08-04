import type { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "strict" : "lax") as "strict" | "lax",
  path: "/",
};

export const ACCESS_TOKEN_EXPIRY = "1m";
export const SESSION_TOKEN_EXPIRY = "1m";
export const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
export const SESSION_TOKEN_MAX_AGE = 24 * 60 * 60 * 1000;
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

export const setAccessTokenCookie = (
  res: Response,
  token: string,
  maxAge = ACCESS_TOKEN_MAX_AGE,
) => {
  res.cookie("token", token, {
    ...baseCookieOptions,
    maxAge,
  });
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
};

export const clearAccessTokenCookie = (res: Response) => {
  res.clearCookie("token", baseCookieOptions);
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken", baseCookieOptions);
};

export const clearAuthCookies = (res: Response) => {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);
};
