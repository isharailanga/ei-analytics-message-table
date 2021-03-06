/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
module.exports = {
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
        }
    },
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "airbnb",
    "rules": {
        "max-len": ["error", 120],
        "require-jsdoc": ["warn", {
            "require": {
                "FunctionDeclaration": true,
                "MethodDefinition": true,
                "ClassDeclaration": true
            }
        }],
        "valid-jsdoc": ["warn", {
            "requireReturn": false
        }],
        "indent": ["error", 4, {"SwitchCase": 1}],
        "import/no-extraneous-dependencies": ["off", {
            "devDependencies": false,
            "optionalDependencies": false,
            "peerDependencies": false
        }],
        "import/no-unresolved": ["off"],
        "import/extensions": ["off"],
        "import/no-named-as-default": ["off"],
        "import/no-named-as-default-member": ["off"],
        "no-underscore-dangle": ["error", {
            "allowAfterThis": true
        }],
        "no-param-reassign": ["off"],
        "no-restricted-syntax": ["off"],
        "no-plusplus": ["off"],
        "func-names": ["off"],
        "class-methods-use-this": ["off"],
        "arrow-body-style": "off",
        "prefer-template": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "react/prefer-stateless-function": ["off"],
        "no-mixed-operators": ["error", {"allowSamePrecedence": true}],
        "jsx-quotes": ["off"],
        "no-else-return": "off",
    },
    "plugins": [
        "react"
    ]
};
