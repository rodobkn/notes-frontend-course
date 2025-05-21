/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // reactStrictMode: false, // esto es para asegurar que el useEffect se corra una vez en el renderizado inicial en desarrollo local
};

export default nextConfig;
