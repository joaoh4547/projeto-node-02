import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        rules:{
            quotes: ["error", "double"],
            semi: ["error", "always"],
            indent: ["error", 4],
            "linebreak-style": ["error", "unix"]
        }
    }
);