import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("eslint:recommended"),
    {
        rules: {
            quotes: ["error", "double"],
            semi: ["error", "always"],
            indent: ["error", 4],
            "linebreak-style": ["error", "unix"]
        },
        files: [
            "**/*.ts",
            "**/*.cts",
            "**/*.mts"
        ],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                console: "readonly", // Define `console` como uma variável global
                window: "readonly",  // Caso precise em ambientes de navegador
                process: "readonly"  // Caso precise em ambientes Node.js
            }
        }
    }
];
