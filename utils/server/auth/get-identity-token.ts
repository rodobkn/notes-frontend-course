import "server-only";

import { GoogleAuth } from "google-auth-library";

export const getIdentityToken = async (): Promise<string> => {
    const targetUrl = process.env.NOTES_BACKEND_URL;
    if (!targetUrl) {
        throw new Error("NOTES_BACKEND_URL is not configured")
    }

    // caso productivo
    if (process.env.NODE_ENV === "production") {
        const auth = new GoogleAuth();

        const client = await auth.getIdTokenClient(targetUrl);

        const identityToken = await client.idTokenProvider.fetchIdToken(targetUrl);
        return identityToken;
    }

    // caso local
    const localToken = process.env.NOTES_BACKEND_TOKEN;
    if (!localToken) {
        throw new Error("El token de identidad no esta configurado en local")
    }
    return localToken;
}
