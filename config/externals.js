'use strict';
// 这个文件可以排除掉某些Vue-component打包进webpack
module.exports = {
  conf:{"../components/test4.vue":"commonjs ../components/test4.vue"}
};
