import { prisma } from "../config/database.js";
import { SignJWT } from "jose";
import { generateRefreshToken, hashToken } from "../utils/refreshToken.ts";
import { getJwtSecret } from "../utils/auth.utils.ts";
import { ACCESS_TOKEN_EXPIRY } from "../utils/authCookies.ts";

type RotationResult = {
    userId: number;
    accessToken: string;
    refreshToken: string;
};

const recentRotations = new Map<
    string,
    { result: RotationResult; expiresAt: number }
>();
const ROTATION_CACHE_MS = 30_000;

const getCachedRotation = (tokenHash: string): RotationResult | null => {
    const cached = recentRotations.get(tokenHash);
    if (!cached) {
        return null;
    }
    if (cached.expiresAt < Date.now()) {
        recentRotations.delete(tokenHash);
        return null;
    }
    return cached.result;
};

const cacheRotation = (oldTokenHash: string, result: RotationResult) => {
    const entry = { result, expiresAt: Date.now() + ROTATION_CACHE_MS };
    recentRotations.set(oldTokenHash, entry);
    recentRotations.set(hashToken(result.refreshToken), entry);
};

export const rotateRefreshToken = async (
    refreshToken: string,
): Promise<RotationResult | null> => {
    const tokenHash = hashToken(refreshToken);

    const cached = getCachedRotation(tokenHash);
    if (cached) {
        return cached;
    }

    const record = await prisma.refreshToken.findUnique({
        where: { tokenHash },
    });

    if (!record || record.expiresAt < new Date()) {
        return null;
    }

    if (record.revokedAt) {
        return getCachedRotation(tokenHash);
    }

    await prisma.refreshToken.update({
        where: { id: record.id },
        data: { revokedAt: new Date() },
    });

    const newRefreshToken = generateRefreshToken();

    await prisma.refreshToken.create({
        data: {
            userId: record.userId,
            tokenHash: hashToken(newRefreshToken),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isPersistent: record.isPersistent,
        },
    });

    const accessToken = await new SignJWT({ id: record.userId })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(ACCESS_TOKEN_EXPIRY)
        .sign(getJwtSecret());

    const result = {
        userId: record.userId,
        accessToken,
        refreshToken: newRefreshToken,
    };

    cacheRotation(tokenHash, result);
    return result;
};
