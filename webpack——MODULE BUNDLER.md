 **webpack——MODULE BUNDLER**
 by jason.chen
=======

>**目录**
>-1.模块打包工具or“模块系统“
>-2.webpack介绍
>-3.搭建一个属于自己的"模块系统"
>-4.使用更多"模块"

###1.模块打包工具or“模块系统“
####现状

伴随着移动互联的大潮，当今越来越多的网站已经从网页模式进化到了 Webapp 模式。它们运行在现代的高级浏览器里，使用 HTML5、 CSS3、 ES6 等更新的技术来开发丰富的功能，网页已经不仅仅是完成浏览的基本需求，并且webapp通常是一个单页面应用，每一个视图通过异步的方式加载，这导致页面初始化和使用过程中会加载越来越多的 JavaScript 代码，这给前端开发的流程和资源组织带来了巨大的挑战。

前端开发和其他开发工作的主要区别，首先是前端是基于多语言、多层次的编码和组织工作，其次前端产品的交付是基于浏览器，这些资源是通过增量加载的方式运行到浏览器端，如何在开发环境组织好这些碎片化的代码和资源，并且保证他们在浏览器端快速、优雅的加载和更新，就需要一个模块化系统，这个理想中的模块化系统是前端工程师多年来一直探索的难题。

------

####模块系统的演进

模块系统主要解决模块的定义、依赖和导出，先来看看已经存在的模块系统。

####-> **script标签**
<pre><code>
	&ltscript src="common.js"&gt&lt/script&gt
	&ltscript src="module1.js"&gt&lt/script&gt
	&ltscript src="module2.js"&gt&lt/script&gt
	
</code></pre>
这是最原始的 JavaScript 文件加载方式，如果把每一个文件看做是一个模块，那么他们的接口通常是暴露在全局作用域下，也就是定义在 window 对象中，不同模块的接口调用都是一个作用域中，一些复杂的框架，会使用命名空间的概念来组织这些模块的接口，典型的例子如 YUI 库。

这种原始的加载方式暴露了一些显而易见的弊端：

>-全局作用域下容易造成变量冲突
>-文件只能按照 script 的书写顺序进行加载
>-开发人员必须主观解决模块和代码库的依赖关系
>-在大型项目中各种资源难以管理，长期积累的问题导致代码库混乱不堪

####-> **CommonJs**

服务器端的 Node.js 遵循<a src="http://wiki.commonjs.org/wiki/CommonJS"> CommonJS</a>规范，该规范的核心思想是允许模块通过 require 方法来同步加载所要依赖的其他模块，然后通过 **exports** 或 **module.exports** 来导出需要暴露的接口。

```
require("module");
require("../file.js");
exports.doStuff = function() {};
module.exports = someValue;
```

**优点：**

*服务器端模块便于重用
*NPM 中已经有将近20万个可以使用模块包
*简单并容易使用

**缺点：**

*同步的模块加载方式不适合在浏览器环境中，同步意味着阻塞加载，浏览器资源是异步加载的
*不能非阻塞的并行加载多个模块

####**-> AMD**


<a href="https://github.com/amdjs/amdjs-api">Asynchronous Module Definition </a>规范其实只有一个主要接口 define(id?, dependencies?, factory)，它要在声明模块的时候指定所有的依赖 dependencies，并且还要当做形参传到 factory 中，对于依赖的模块提前执行，依赖前置。
```
define("module", ["dep1", "dep2"], function(d1, d2) {
  return someExportedValue;
});

require(["module", "../file"], function(module, file) { /* ... */ });
```
**优点：**

*适合在浏览器环境中异步加载模块
*可以并行加载多个模块

**缺点：**

*提高了开发成本，代码的阅读和书写比较困难，模块定义方式的语义不顺畅
*不符合通用的模块化思维方式，是一种妥协的实现

####**-> CMD**

<a href="https://github.com/cmdjs/specification/blob/master/draft/module.md">Common Module Definition </a>规范和 AMD 很相似，尽量保持简单，并与 CommonJS 和 Node.js 的 Modules 规范保持了很大的兼容性。
```
define(function(require, exports, module) {
  var $ = require('jquery');
  var Spinning = require('./spinning');
  exports.doSomething = ...
  module.exports = ...
})
```
**优点：**

*依赖就近，延迟执行
*可以很容易在 Node.js 中运行

**缺点：**

*依赖 SPM 打包，模块的加载逻辑偏重

####**-> ES6 模块**

EcmaScript6 标准增加了 JavaScript 语言层面的模块体系定义。ES6 模块的设计思想，是**尽量的静态化**，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。
```
import "jquery";
export function doStuff() {}
module "localModule" {}
```
**优点：**

*容易进行静态分析
*面向未来的 EcmaScript 标准

**缺点：**

*原生浏览器端还没有实现该标准
*全新的命令字，新版的 Node.js才支持

------

####期望的模块系统

可以兼容多种模块风格，尽量可以利用已有的代码，不仅仅只是 JavaScript 模块化，还有 CSS、图片、字体等资源也需要模块化。

------

####前端模块加载

前端模块要在客户端中执行，所以他们需要增量加载到浏览器中。

模块的加载和传输，我们首先能想到两种极端的方式:
**一种是每个模块文件都单独请求**
**另一种是把所有模块打包成一个文件然后只请求一次**

显而易见，每个模块都发起单独的请求造成了请求次数过多，导致应用启动速度慢；一次请求加载所有模块导致流量浪费、初始化过程慢。这两种方式都不是好的解决方案，它们过于简单粗暴。

分块传输，按需进行懒加载，在实际用到某些模块的时候再增量更新，才是较为合理的模块加载方案。

要实现模块的按需加载，就需要一个对整个代码库中的模块进行静态分析、编译打包的过程。

------

####所有资源都是模块

在上面的分析过程中，我们提到的模块仅仅是指JavaScript模块文件。然而，在前端开发过程中还涉及到样式、图片、字体、HTML 模板等等众多的资源。这些资源还会以各种方言的形式存在，比如：图片、 sass、众多的模板库、 字体文件等等。

如果他们都可以视作模块，并且都可以通过require的方式来加载，将带来优雅的开发体验，比如：
```
require("./style.css");
require("./style.less");
require("./template.jade");
require("./image.png");
```
那么如何做到让 require 能加载各种资源呢？

-----

####静态分析

在编译的时候，要对整个代码进行静态分析，分析出各个模块的类型和它们依赖关系，然后将不同类型的模块提交给适配的加载器来处理。比如一个用 SASS 写的样式模块，可以先用 SASS 加载器将它转成一个CSS 模块，在通过 CSS 模块把他插入到页面的``` <style>``` 标签中执行。Webpack 就是在这样的需求中应运而生。

同时，为了能利用已经存在的各种框架、库和已经写好的文件，我们还需要一个模块加载的兼容策略，来避免重写所有的模块。

那么接下来，让我们开始 Webpack 的神奇之旅吧。

-------------

###2.webpack介绍
####什么是 Webpack



Webpack 是一个模块打包器。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。

-----
####Webpack的核心理念


>-**万物皆模块**：
>
>就像JS文件可以当做模块，那么其他所有的文件（CSS，图片，HTML）都可以当做模块。这样，就可以require(“myJSfile.js”)或者require(“myCSSfile.css”)。这意味着，我们可以对模块再进行细分，分割成更小更容易管理的粒度，实现复用等等。

>-**按需加载，异步加载**：
>
>一般的模块打包器会打包所有的模块然后生成一个巨大的输出文件bundle.js。但是在许多实际应用的APP中，这个bundle.js可能会有10MB-15MB那么大，并且总是会加载！而Webpack有一些功能可以分割代码然后生成多个"bundle"文件并且可以在你需要的时候异步加载。

-----

####造一个新的轮子
市面上已经存在的模块管理和打包工具并不适合大型的项目，尤其单页面 Web 应用程序。最紧迫的原因是如何在一个大规模的代码库中，维护各种模块资源的分割和存放，维护它们之间的依赖关系，并且无缝的将它们整合到一起生成适合浏览器端请求加载的静态资源。

这些已有的模块化工具（如：Grunt&gulp）并不能很好的完成如下的目标：
>-将依赖树拆分成按需加载的块
-初始化加载的耗时尽量少
-各种静态资源都可以视作模块
-将第三方库整合成模块的能力
-可以自定义打包逻辑的能力
-适合大项目，无论是单页还是多页的 Web 应用

------

####Webpack 的特点

Webpack 和其他模块化工具有什么区别呢？

**-> 代码拆分**

Webpack 有两种组织模块依赖的方式，同步和异步。异步依赖作为分割点，形成一个新的块。在优化了依赖树后，每一个异步区块都作为一个文件被打包。

**-> Loader**

Webpack 本身只能处理原生的 JavaScript 模块，但是 loader 转换器可以将各种类型的资源转换成 JavaScript 模块。这样，任何资源都可以成为 Webpack 可以处理的模块。

**-> 智能解析**

Webpack 有一个智能解析器，几乎可以处理任何第三方库，无论它们的模块形式是 CommonJS、 AMD 还是普通的 JS 文件。甚至在加载依赖的时候，允许使用动态表达式 require("./templates/" + name + ".jade")。

**-> 插件系统**

Webpack 还有一个功能丰富的插件系统。大多数内容功能都是基于这个插件系统运行的，还可以开发和使用开源的 Webpack 插件，来满足各式各样的需求。

**-> 快速运行**

Webpack 使用异步 I/O 和多级缓存提高运行效率，这使得 Webpack 能够以令人难以置信的速度快速增量编译。

------
###3.搭建一个属于自己的"模块系统"

####<a href="https://webpack.github.io/">安装</a>
首先要安装 **<a href="https://nodejs.org/en/download/">Node.js</a>**， Node.js 自带了软件包管理器 npm，Webpack 需要 Node.js v0.6 以上支持，建议使用最新版 Node.js。

>用 npm 安装 Webpack：

>$ npm install webpack -g

此时 Webpack 已经安装到了全局环境下，可以通过命令行 webpack -h 试试。

通常我们会将 Webpack 安装到项目的依赖中，这样就可以使用项目本地版本的 Webpack。

**1.进入新建项目目录**
1.1确定已经有 package.json，没有就通过``` npm init ```创建

1.2初始化项目
```
//初始化文件目录：
webpack2
	--- src
		--- entry.js
		--- module1.js
	--- index.html
	--- package.json
	--- webpack.config.js
```

>安装 webpack 依赖
>$ npm install webpack --save-dev

-------

**2.webpack配置**

2.1webpack是需要进行配置的，我们在使用webpack的时候，会默认 webpack.config.js 为我们的配置文件。所以接下来，我们新建这个js文件

```
// webpack.config.js
const path = require("path");//nodejs path模块
const webpack = require("webpack");
module.exports = {
	context: path.resolve(__dirname, './src'),//context 指定对应的文件夹开始
	entry: {
	  app: './app.js',//演示单入口文件
	},
	output: {
	  path: path.resolve(__dirname, './dist'),//打包输出的路径，__dirname 当前路径
	  filename: '[name].bundle.js',//打包后的名字[name]对应键值对
	  publicPath: './dist/'//本地
	  //publicPath: '/dist/'//服务器
	},
};
```
-------
3.**编写入口文件**

3.1接下来就编写我们的入口文件 entry.js 和第一个模块文件 module1.js 。我们一切从简，里面只用来加载一个Js模块。
```
// app.js
console.log('hello')
// import a from './entry1';
require('./entry') // 使用CommonJs来加载模块
```
3.2下一个文件
```
// entry.js
console.log('webpack2')
//require('./module1')
```
----------
**4.启动webpack**

4.1一切准备好后，我们仅需要在项目根目录下，用命令行 ```webpack ```执行一下即可。
```
// webpack 命令行的几种基本命令

$ webpack // 最基本的启动webpack方法
$ webpack -w // 提供watch方法，实时进行打包更新
$ webpack -p // 对打包后的文件进行压缩，提供production
$ webpack -d // 提供source map，方便调试。
```

4.2webpack成功运行后，我们就可以看到根目录出现了out文件夹，里面有我们打包生成的 bundle.js 。我们最后通过在 **index.html 里对这个文件引入**
```<script src="./out/bundle.js"></script>```
就可以了。我们可以在控制台看到我们想要的结果
``` Hello Webpack !```

----------

####备注：
**Webpack 目前有两个主版本，一个是在 master 主干的稳定版，一个是在 webpack-2 分支的测试版，测试版拥有一些实验性功能并且和稳定版不兼容，在正式项目中应该使用稳定版。**

>查看 webpack 版本信息
>$ npm info webpack

####安装指定版本的 webpack
>$ npm install webpack@1.12.x --save-dev
>
如果需要使用 Webpack 开发工具，要单独安装：
>$ npm install webpack-dev-server --save-dev

---------

###4.使用更多"模块"
**1.多模块依赖**

刚才的例子，我们仅仅是跑通了webpack通过 entry.js 入口文件进行打包的例子。下面我们就来看一下它是否真的支持CommonJs和AMD两种模块机制呢？下面新建几个js文件吧！

文件一
```
// 修改module1.js
require(["./module2"], function(){
	console.log("Hello Webpack!");
});
```
文件二
```
// module2.js，使用AMD模块机制
define(['./module3.js'], function(sum){
	var a = 1,
		b = 2;
	return console.log(a + ' + ' + b + ' = ' + sum(a,b));
})

```
文件三
```
// module3.js，使用的是CommonJs机制导出包
module.exports = function(a, b){
	return a + b;
}
```
----------
**2.loader加载器**

Loader是用来加载（load）或输入（import）文件的Node模块，不同的loader可以将各种类型的文件转换为浏览器能够接受的格式如JS，Stylesheets等等。更进一步来说，loader允许通过require或ES6的import语句在JS文件中引入各种文件。

例如，可以用babel-loader把ES6语法写的JS转换成浏览器能够兼容的ES5形式：
```
module: {
 loaders: [{
	 test:/\.js$/,//←检测".js"文件, 通过的话，则使用对应loader
     exclude: /node_modules/,//←排除 node_modules 文件夹
     use:[
	        {
              loader:'babel-loader',//←使用 babel
              options: {
                presets: ["es2015"]//简写.babelrc配置
            }
        }
     ]
 }]
```
Loader链（从右向左工作）

多个loader可以链式调用，作用于同一种文件类型。工作链的调用顺序是从右向左，各个loader之间使用"!"分开。(webpack2已经不再支持)

例如，有一个CSS文件myCSSFile.css，我们想把文件里的内容放到HTML文件的标签中。想实现这一点，需要用到两个loader：css-loader和style-loader。

2.1安装loader
我们第一步就是先要安装好各个必须的loader，我们直接看看需要通过npm安装什么。
```
$ npm install style-loader css-loader url-loader babel-loader sass-loader --save-dev 
//安装loader
$ npm install babel-core babel-preset-es2015 node-sass --save-dev
//loader需要依赖的库
//务必提前全局 -g 安装
```

-----
2.2配置loader

安装完各个loader后，我们就需要配置一下我们的 webpack.config.js ，载入我们的loader。
```
// webpack.config.js
module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: {
    app: './app.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: './dist/'//本地
    //publicPath: '/dist/'//服务器
  },
  module:{
    rules:[
      {
        test:/\.scss$/,//处理sass
        //正则选择匹配文件
        use:[
          //使用需要的loader，以数组形式加入，单独需要配置的loader以对象形式配置
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
        // use: ExtractTextPlugin.extract({
        //   fallback: "style-loader",
        //   use: ["css-loader","sass-loader"]
        // })

      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,//打包文件和图片，file-loader的封装升级版
        use:[
          {
            loader:'url-loader',
            options:'limit=8192'
            //webpack loader的配置方式，作为一种类似字符串的形式被追加到每一个loader的命名后面，
            //类似于url中的查询字符串，但在实际应用中有更多功能。
            //相当于loader:'url-loader?limit=8192'
          }
        ]
      },
      {
        test:/\.js$/,//使用es6
        exclude: /node_modules/,//排除node模块编译
        use:[
	          {
	              loader:'babel-loader',
	              options: {
	                presets: ["es2015"]//简写.babelrc配置
              }
          }
        ]
      },
    ]
  },
};
```


现在离直接用ES2015和SASS去写我们的前端代码了之差一步了。在此之前，我们对src文件夹里再细分成js，css，image三个文件夹，处理好分层。

```
src
  --images
  --css
  --js
```

**使用sass-loader**
```
// app.js
// css
require('./css/main.scss');
```
```
//main.scss
body{
  background: blue;
  div{
    width: 100px;
    height: 100px;
    border: 1px solid #ddd;
    cursor:pointer;
  }
  
}
```
**使用url-loader**
```
//main.scss
.d1{
    background: url("../images/Pin.svg") 100% 100% no-repeat;/*支持svg*/
}
.d2{
  background: url("../images/rrt.jpg") 100% 100% no-repeat;
}
.d3{
  background: url("../images/backHome.png") 100% 100% no-repeat;/*大于8k的图片不会被转换*/
}

//entry.js
var Img = document.createElement("img");
Img.src = require("./images/rrt.jpg");
console.log(Img)
```

**使用babel-loader**
```
//model.js
var a = [];
for(var i=0;i<10;i++){
	a[i]=function(){
  	console.log(i)
  }
}
a[6]()

var b = [];
for(let k=0;k<10;k++){
	b[k]=function(){
  	console.log(k)
  }
}
b[6]()
```
-----------
**3.plugins插件**
```
//webpack.config.js
module.exports = {
	//...
	plugins: [
	  //配置插件，以数组形式添加插件
	]
}
```


**3.1使用library（如jquery）**
```
plugins: [
  new webpack.ProvidePlugin({//定义插件,webpack原生支持
      $: 'jquery',
      jquery:'jquery',
  }),
]
//$('')
//jquery('')
```


**3.2分开打包css文件**
```
--node $npm install extract-text-webpack-plugin --save-dev

const ExtractTextPlugin = require('extract-text-webpack-plugin');
// https://github.com/webpack-contrib/extract-text-webpack-plugin

plugins: [
  new ExtractTextPlugin({
	  filename: 'style.css'
  }),
]
```

**3.3搭建时自动打开浏览器**
```
--node $npm install open-browser-webpack-plugin --save-dev
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

plugins: [
  new OpenBrowserPlugin({ url: 'http://localhost:8082' })
  //端口号自定义
]
```

>查看更多plugins介绍
https://webpack.js.org/concepts/plugins/

-----









