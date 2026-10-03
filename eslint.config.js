import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{ ignores: ["dist", "node_modules"] },
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			react.configs.flat.recommended,
			reactHooks.configs.flat.recommended,
			jsdoc.configs["flat/recommended-typescript"],
			jsxA11y.flatConfigs.recommended
		],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: { ...globals.browser, ...globals.node }
		},
		plugins: { "@stylistic": stylistic },
		settings: { react: { version: "detect" } },
		rules: {
			"@stylistic/indent": ["error", "tab", { SwitchCase: 0 }],
			"@stylistic/linebreak-style": ["error", "unix"],
			"@stylistic/quotes": ["error", "double"],
			"@stylistic/semi": ["error", "always"],
			"@typescript-eslint/no-explicit-any": "warn",
			"no-empty-function": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@stylistic/array-bracket-spacing": 1,
			"arrow-body-style": [1, "as-needed"],
			"@stylistic/arrow-parens": [1, "as-needed"],
			"@stylistic/arrow-spacing": 1,
			"@stylistic/brace-style": 1,
			"@stylistic/block-spacing": 1,
			"@stylistic/comma-style": 1,
			curly: 1,
			"@stylistic/comma-dangle": 1,
			"@stylistic/comma-spacing": 1,
			"@stylistic/computed-property-spacing": 1,
			"@stylistic/eol-last": 1,
			eqeqeq: 1,
			"@stylistic/function-call-spacing": 1,
			"func-style": 1,
			"@stylistic/jsx-quotes": 1,
			"@stylistic/key-spacing": 1,
			"@stylistic/keyword-spacing": 1,
			"@stylistic/lines-around-comment": 1,
			"no-lone-blocks": 1,
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": 1,
			"@stylistic/object-curly-spacing": ["warn", "always"],
			"prefer-const": 1,
			"prefer-template": 1,
			"@stylistic/space-before-function-paren": [1, "always"],
			// React/JSX specific rules
			"react/jsx-boolean-value": [1, "always"],
			"@stylistic/jsx-closing-tag-location": 1,
			"@stylistic/jsx-closing-bracket-location": [1, "after-props"],
			"@stylistic/jsx-curly-newline": 1,
			"@stylistic/jsx-equals-spacing": 1,
			"@stylistic/jsx-first-prop-new-line": [1, "multiline"],
			"@stylistic/jsx-indent-props": [1, "tab"],
			"@stylistic/jsx-max-props-per-line": ["warn", { maximum: 1 }],
			"react/jsx-no-constructed-context-values": 1,
			"@stylistic/jsx-one-expression-per-line": [2, { allow: "none" }],
			"@stylistic/jsx-pascal-case": 1,
			"react/react-in-jsx-scope": 0,
			"@stylistic/jsx-tag-spacing": 1,
			"react/no-access-state-in-setstate": 1,
			"react/self-closing-comp": 1,
			"react/style-prop-object": 1
		}
	}
);
