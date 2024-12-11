import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // To test over wifi
        // host: true,
        // port: 3000,
        // proxy: {
        //     "/api": {
        //         target: "https://games.ugatngkalusugan.org/public/",
        //         changeOrigin: true,
        //         headers: {
        //             Accept: "application/json",
        //             "Content-Type": "application/json",
        //         },
        //     },
        // },
    },
});
