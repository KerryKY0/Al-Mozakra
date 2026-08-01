import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const geminiApiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || "";
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL || "";
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || "";

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(geminiApiKey),
      "process.env.GEMINI_API_KEY": JSON.stringify(geminiApiKey),
      "process.env.VITE_GEMINI_API_KEY": JSON.stringify(geminiApiKey),
      "process.env.SUPABASE_URL": JSON.stringify(supabaseUrl),
      "process.env.SUPABASE_ANON_KEY": JSON.stringify(supabaseAnonKey),
      "process.env.VITE_SUPABASE_URL": JSON.stringify(supabaseUrl),
      "process.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(supabaseAnonKey),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            // React core - يُحمَّل أولاً وبسرعة
            "react-core": ["react", "react-dom", "react-router-dom"],
            // مكتبة PDF الضخمة - تُحمَّل فقط عند فتح ملف PDF
            "pdf-viewer": ["react-pdf", "pdfjs-dist"],
            // Supabase - يُحمَّل عند الدخول للمنصة فقط
            "supabase": ["@supabase/supabase-js"],
            // Gemini AI - يُحمَّل عند استخدام الذكاء الاصطناعي
            "ai-sdk": ["@google/genai"],
            // الرسوم البيانية
            "charts": ["recharts"],
            // أيقونات lucide
            "icons": ["lucide-react"],
          },
        },
      },
    },
  };
});
