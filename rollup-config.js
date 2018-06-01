import rollup      from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import uglify      from 'rollup-plugin-uglify';


export default {
  entry: 'target/main.aot.9768b0fee9f4a590b96f.js',
  dest: 'target/build.js', // output a single application bundle
  sourceMap: true,
  sourceMapFile: 'target/build.js.map',
  format: 'iife',
  plugins: [
      nodeResolve({jsnext: true, module: true}),
      commonjs({
        include: 'node_modules/rxjs/**',
      }),
      uglify()
  ]
}
