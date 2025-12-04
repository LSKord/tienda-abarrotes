const lifeTime = parseInt(import.meta.env.VITE_TOKEN_LIFETIME) * 60 * 1000

export const isTokenExpired = ():boolean => {
    const tokenLifetime = localStorage.getItem("tokenTime");
    if (!tokenLifetime) return true;

    const createdAt = parseInt(tokenLifetime,10);
    const now = Date.now()

    return now - createdAt > lifeTime;
}