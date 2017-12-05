
#ES6新API之——Promise

by jason.chen

----
>目录
-同步&异步
-回调函数
-异步回调
-事件循环机制
-Promise

----
###"同步"&“异步”
```
//有以下函数
f1()//form表单提交

f2()//根据form表单提交结果执行

f3()//关闭form表单

//如果f1返回速度非常慢，会造成什么？
//解决方案有哪些？
```

<img src="http://upload-images.jianshu.io/upload_images/599584-15f617d44cdb990d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240">

----
###回调函数 callback
####回调函数定义
维基 <a href="https://en.wikipedia.org/wiki/Callback_(computer_programming)">Callback_(computer_programming) 条目</a>:

>In computer programming, a callback is a reference to a piece of executable code that is passed as an argument to other code.
>在计算机编程中，回调是对作为参数传递给其他代码的一段可执行代码的引用。

jQuery文档<a href="http://learn.jquery.com/about-jquery/how-jquery-works/#Callback_and_Functions">How jQuery Works#Callback_and_Functio...条目</a>：

>A callback is a function that is passed as an argument to another function and is executed after its parent function has completed. The special thing about a callback is that functions that appear after the "parent" can execute before the callback executes. Another important thing to know is how to properly pass the callback. 
>回调是一个函数，作为参数传递给另一个函数，并在其父级函数完成后执行。 回调的特殊之处在于，它是“父级”函数在回调执行完之后执行的函数。 另一个重要的事情是要如何正确地传递回调。

因此，回调本质上是一种设计模式，并且jQuery(包括其他框架)的设计原则遵循了这个模式。

在JavaScript中，回调函数具体的定义为：函数A作为参数(函数引用)传递到另一个函数B中，并且这个函数B执行函数A。我们就说函数A叫做回调函数。如果没有名称(函数表达式)，就叫做匿名回调函数。

因此callback 不一定用于异步，一般同步(阻塞)的场景下也经常用到回调，比如要求执行某些操作后执行回调函数。



----
####回调什么时候执行

回调函数，一般在同步情境下是最后执行的，而在异步情境下有可能不执行，因为事件没有被触发或者条件不满足。

```
a(function(){
	b();
	c(function(){
		d()
	});
	e();
});
f();
//执行顺序是什么
```
----

####回调函数的使用场合
>-资源加载：动态加载js文件后执行回调，加载iframe后执行回调，ajax操作回调，图片加载完成执行回调，AJAX等等。
-DOM事件及Node.js事件基于回调机制(Node.js回调可能会出现多层回调嵌套的问题)。
-setTimeout的延迟时间为0，这个hack经常被用到，settimeout调用的函数其实就是一个callback的体现
-链式调用：链式调用的时候，在赋值器(setter)方法中(或者本身没有返回值的方法中)很容易实现链式调用，而取值器(getter)相对来说不好实现链式调用，因为你需要取值器返回你需要的数据而不是this指针，如果要实现链式方法，可以用回调函数来实现
-setTimeout、setInterval的函数调用得到其返回值。由于两个函数都是异步的，即：他们的调用时序和程序的主流程是相对独立的，所以没有办法在主体里面等待它们的返回值，它们被打开的时候程序也不会停下来等待，否则也就失去了setTimeout及setInterval的意义了，所以用return已经没有意义，只能使用callback。callback的意义在于将timer执行的结果通知给代理函数进行及时处理。

----

####异步回调
大家可能平时听的比较多的是异步回调,但是必须搞清楚，异步与回调并没有直接的联系，回调只是异步的一种实现方式。

```
listen('click',function(e){
	setTimeout(function(){
		ajax('xxx.xx',function(data){
			if(data == 'hello'){
				success();
			}else if(data == 'world'){
				wait();
			}else..{
				error()
			}
		})
	},500)
})
```
异步回调会带来最大的问题是什么？
###**回调地狱 callback hell**
```
//初识callback hell
function a(cb){
	console.log('a');
	this.name = 'callback';
	setTimeout(() => {
		cb.apply(this);
	}, 0);
}

function b(){
	console.log('b');
}
function c(cb){
	console.log('c');
	setTimeout(function(){
		cb()
	}, 0);
}
function d(){
	console.log('d');
}
function e(){
	console.log('e');
}
function f(){
	console.log('f');
}

window.aa = new a(function(){
	console.log(this.name)
 	b();
 	c(function(){
 		d()
	});
 	e();
})
f();
```



----

###事件循环机制
我们知道JavaScript的一大特点就是单线程，而这个线程中拥有唯一的一个事件循环。

<img src="http://upload-images.jianshu.io/upload_images/599584-15f617d44cdb990d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240">
JavaScript代码的执行过程中，除了依靠函数调用栈来搞定函数的执行顺序外，还依靠任务队列(task queue)来搞定另外一些代码的执行。

一个线程中，事件循环是唯一的，但是任务队列可以拥有多个。

任务队列又分为**macro-task（宏任务）**与**micro-task（微任务）**，在最新标准中，它们被分别称为task与jobs。

**macro-task** 大概包括：script(整体代码), setTimeout, setInterval, setImmediate, I/O, UI rendering。

**micro-task** 大概包括: process.nextTick, Promise, Object.observe(已废弃), MutationObserver(html5新特性)

setTimeout/Promise等我们称之为任务源。而进入任务队列的是他们指定的具体执行任务。
```
// setTimeout中的回调函数才是进入任务队列的任务
setTimeout(function() {
  console.log('xxxx');
})
```
来自不同任务源的任务会进入到不同的任务队列。其中setTimeout与setInterval是同源的。

事件循环的顺序，决定了JavaScript代码的执行顺序。它从script(整体代码)开始第一次循环。之后全局上下文进入函数调用栈。直到调用栈清空(只剩全局)，然后执行所有的micro-task。当所有可执行的micro-task执行完毕之后。循环再次从macro-task开始，找到其中一个任务队列执行完毕，然后再执行所有的micro-task，这样一直循环下去。

其中每一个任务的执行，无论是macro-task还是micro-task，都是借助函数调用栈来完成。

----
纯文字表述太干涩，因此，这里我们通过2个例子，来逐步理解事件循环的具体顺序。
```
// demo01 
setTimeout(function() {
    console.log('timeout1');
})

new Promise(function(resolve) {
    console.log('promise1');
    for(var i = 0; i < 1000; i++) {
        i == 99 && resolve();
    }
    console.log('promise2');
}).then(function() {
    console.log('then1');
})

console.log('global1');
```


####**第一步**：

事件循环从宏任务队列开始，这个时候，宏任务队列中，只有一个script(整体代码)任务。每一个任务的执行顺序，都依靠函数调用栈来搞定，而当遇到任务源时，则会先分发任务到对应的队列中去，所以，上面例子的第一步执行如下图所示。

<img src="http://upload-images.jianshu.io/upload_images/599584-92fc0827aa39e325.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240">
首先script任务开始执行，全局上下文入栈

####**第二步**：

script任务执行时首先遇到了setTimeout，setTimeout为一个宏任务源，那么他的作用就是将任务分发到它对应的队列中。

<img src="http://upload-images.jianshu.io/upload_images/599584-2a99131c2572f898.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240">
宏任务timeout1进入setTimeout队列

####**第三步**：

script执行时遇到Promise实例。Promise构造函数中的第一个参数，是在new的时候执行，因此不会进入任何其他的队列，而是直接在当前任务直接执行了，而后续的.then则会被分发到micro-task的Promise队列中去。


因此，构造函数执行时，里面的参数进入函数调用栈执行。for循环不会进入任何队列，因此代码会依次执行，所以这里的promise1和promise2会依次输出。

<img src="http://upload-images.jianshu.io/upload_images/599584-774ec33de48c1d41.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240/format/jpg">

promise1入栈执行，这时promise1被最先输出
<img src="http://upload-images.jianshu.io/upload_images/599584-8b5e93798f6c9d52.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240">
resolve在for循环中入栈执行
<img src="http://upload-images.jianshu.io/upload_images/599584-521c5da565a35a45.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240">
构造函数执行完毕的过程中，resolve执行完毕出栈，promise2输出，promise1页出栈，then执行时，Promise任务then1进入对应队列


script任务继续往下执行，最后只有一句输出了globa1，然后，全局任务就执行完毕了。

####**第四步**：
第一个宏任务script执行完毕之后，就开始执行所有的可执行的微任务。这个时候，微任务中，只有Promise队列中的一个任务then1，因此直接执行就行了，执行结果输出then1，当然，他的执行，也是进入函数调用栈中执行的。

<img src="http://upload-images.jianshu.io/upload_images/599584-dd7673edbbe5e687.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240">

####**第五步**：
当所有的micro-tast执行完毕之后，表示第一轮的循环就结束了。这个时候就得开始第二轮的循环。第二轮循环仍然从宏任务macro-task开始。

<img src="http://upload-images.jianshu.io/upload_images/599584-881e739c134cb6c9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240/format/jpg">

####**第六步**：
这个时候，我们发现宏任务中，只有在setTimeout队列中还要一个timeout1的任务等待执行。因此就直接执行即可。

<img src="http://upload-images.jianshu.io/upload_images/599584-c4ea234b27c5f2f2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240">


####**最后**
这个时候宏任务队列与微任务队列中都没有任务了，所以代码就不会再输出其他东西了。

----


###Promise
<a href="http://es6.ruanyifeng.com/#docs/promise">Promise API</a>








>参考文档
>-<a href="http://es6.ruanyifeng.com/#docs/promise">Promise 对象</a>
>-<a href="http://www.jianshu.com/p/12b9f73c5a4f#">深入核心，详解事件循环机制</a>
>-<a href="http://mao.li/javascript/javascript-callback-function/">JavaScript callback function 理解</a>