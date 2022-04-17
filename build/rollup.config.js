
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { name } from '../package.json'
const file = type => `dist/${name}.${type}.js`
const overrides = {  // 方便其他项目使用，ts
  compilerOptions: { declaration: true },
  exclude: ["node_modules"]
}
export { name, file }
export default {
  input: 'src/index.ts',
  output: {
    name,
    file: file('esm'),
    format: 'es'
  },
  plugins: [
    nodeResolve(),
    typescript({ tsconfigOverride: overrides }), //可以修改tsconfig.jsin 中的配置
    json(),
    commonjs()
  ],
  //external: ['vue', 'lodash-es'] //vue会在依赖的项目提供，lodash-es在代码运行时会被安装，所以在生产组件时，不需要打包这个两个文件。
}