"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const VUE_PACKAGE_PATH = path_1.default.join(__dirname, '../../packages/vue');
const copyPackageFile = async () => {
    const packageStr = await promises_1.default.readFile(`${VUE_PACKAGE_PATH}/package.json`, { encoding: 'utf-8' });
    const _package = JSON.parse(packageStr);
    const newPackage = {
        name: _package.name,
        version: _package.version,
        types: './index.d.ts',
        main: './index.js',
        devDependencies: _package.devDependencies,
        keywords: _package.keywords,
        author: _package.author,
        homepage: _package.homepage,
        repository: _package.repository,
        license: _package.license,
        sideEffects: _package.sideEffects,
        exports: {
            './package.json': './package.json',
            '.': './index.js',
        },
    };
    await promises_1.default.writeFile(`${VUE_PACKAGE_PATH}/package/package.json`, JSON.stringify(newPackage, null, 2));
};
const copyIndexFile = async () => {
    const _exports = await promises_1.default.readFile(`${VUE_PACKAGE_PATH}/src/lib/index.ts`);
    await promises_1.default.writeFile(`${VUE_PACKAGE_PATH}/package/index.d.ts`, _exports);
    await promises_1.default.writeFile(`${VUE_PACKAGE_PATH}/package/index.js`, _exports);
};
(async () => {
    try {
        await promises_1.default.rm(`${VUE_PACKAGE_PATH}/package`, { recursive: true });
    }
    catch (error) {
        console.log('Can not find \'vue/package\' directory, skipping to next steps');
    }
    await promises_1.default.mkdir(`${VUE_PACKAGE_PATH}/package`);
    await copyPackageFile();
    await copyIndexFile();
    await promises_1.default.mkdir(`${VUE_PACKAGE_PATH}/package/fill`);
    await promises_1.default.mkdir(`${VUE_PACKAGE_PATH}/package/stroke`);
    await promises_1.default.cp(`${VUE_PACKAGE_PATH}/src/lib/fill`, `${VUE_PACKAGE_PATH}/package/fill`, { recursive: true });
    await promises_1.default.cp(`${VUE_PACKAGE_PATH}/src/lib/stroke`, `${VUE_PACKAGE_PATH}/package/stroke`, { recursive: true });
    await promises_1.default.cp(`${VUE_PACKAGE_PATH}/LICENSE`, `${VUE_PACKAGE_PATH}/package/LICENSE`);
})();