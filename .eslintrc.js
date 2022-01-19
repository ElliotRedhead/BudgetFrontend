module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:jsdoc/recommended"
	],
	"overrides": [
		{
			"files": ["**/*.ts", "**/*.tsx"],
			"extends": [
				"eslint:recommended",
				"plugin:react/recommended",
				"plugin:@typescript-eslint/eslint-recommended",
				"plugin:@typescript-eslint/recommended",
				"plugin:jsdoc/recommended"
			],
			"parser": "@typescript-eslint/parser",
			"parserOptions": {
				"ecmaFeatures": { "jsx": true },
				"ecmaVersion": 2021,
				"sourceType": "module",
				"project": "tsconfig.json"
			},
			"plugins": ["react", "@typescript-eslint"],
			"rules": {
				"indent": [
					"error",
					"tab"
				],
				"linebreak-style": [
					"error",
					"unix"
				],
				"quotes": [
					"error",
					"double"
				],
				"semi": [
					"error",
					"always"
				],
				"no-empty-function": "off",
				"@typescript-eslint/no-empty-function": "off",
				"array-bracket-spacing": 1,
				"arrow-body-style": [1, "as-needed"],
				"arrow-parens": [1, "as-needed"],
				"arrow-spacing": 1,
				"brace-style": 1,
				"block-spacing": 1,
				"comma-style": 1,
				"curly": 1,
				"comma-dangle": 1,
				"comma-spacing": 1,
				"computed-property-spacing": 1,
				"eol-last": 1,
				"eqeqeq": 1,
				"func-call-spacing": 1,
				"func-style": 1,
				"jsx-quotes": 1,
				"key-spacing": 1,
				"keyword-spacing": 1,
				"lines-around-comment": 1,
				"no-lone-blocks": 1,
				"no-unused-vars": 1,
				"object-curly-spacing": ["warn", "always"],
				"prefer-const": 1,
				"prefer-template": 1,
				"space-before-function-paren": [1, "always"],
				// React/JSX specific rules
				"react/jsx-boolean-value": [1, "always"],
				"react/jsx-closing-tag-location": 1,
				"react/jsx-closing-bracket-location": [1, "after-props"],
				"react/jsx-curly-newline": 1,
				"react/jsx-equals-spacing": 1,
				"react/jsx-first-prop-new-line": [1, "multiline"],
				"react/jsx-indent": [2, "tab"],
				"react/jsx-indent-props": [1, "tab"],
				"react/jsx-max-props-per-line": ["warn", { "maximum": 1 }],
				"react/jsx-no-constructed-context-values": 1,
				"react/jsx-one-expression-per-line": [2, { "allow": "none" }],
				"react/jsx-pascal-case": 1,
				"react/react-in-jsx-scope": 0,
				"react/jsx-tag-spacing": 1,
				"react/no-access-state-in-setstate": 1,
				"react/self-closing-comp": 1,
				"react/style-prop-object": 1,
				"valid-jsdoc": [
					1,
					{
						"requireParamDescription": true,
						"requireReturnDescription": true,
						"requireReturn": true
					}
				]
			}
		}
	],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 2021,
		"sourceType": "module"
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"array-bracket-spacing": 1,
		"arrow-body-style": [1, "as-needed"],
		"arrow-parens": [1, "as-needed"],
		"arrow-spacing": 1,
		"brace-style": 1,
		"block-spacing": 1,
		"comma-style": 1,
		"curly": 1,
		"comma-dangle": 1,
		"comma-spacing": 1,
		"computed-property-spacing": 1,
		"eol-last": 1,
		"eqeqeq": 1,
		"func-call-spacing": 1,
		"func-style": 1,
		"jsx-quotes": 1,
		"key-spacing": 1,
		"keyword-spacing": 1,
		"lines-around-comment": 1,
		"no-lone-blocks": 1,
		"no-unused-vars": 1,
		"object-curly-spacing": ["warn", "always"],
		"prefer-const": 1,
		"prefer-template": 1,
		"space-before-function-paren": [1, "always"],
		// React/JSX specific rules
		"react/jsx-boolean-value": [1, "always"],
		"react/jsx-closing-tag-location": 1,
		"react/jsx-closing-bracket-location": [1, "after-props"],
		"react/jsx-curly-newline": 1,
		"react/jsx-equals-spacing": 1,
		"react/jsx-first-prop-new-line": [1, "multiline"],
		"react/jsx-indent": [2, "tab"],
		"react/jsx-indent-props": [1, "tab"],
		"react/jsx-max-props-per-line": ["warn", { "maximum": 1 }],
		"react/jsx-no-constructed-context-values": 1,
		"react/jsx-one-expression-per-line": [2, { "allow": "none" }],
		"react/jsx-pascal-case": 1,
		"react/react-in-jsx-scope": 0,
		"react/jsx-tag-spacing": 1,
		"react/no-access-state-in-setstate": 1,
		"react/self-closing-comp": 1,
		"react/style-prop-object": 1,
		"valid-jsdoc": [
			1,
			{
				"requireParamDescription": true,
				"requireReturnDescription": true,
				"requireReturn": true
			}
		]
	}
};
