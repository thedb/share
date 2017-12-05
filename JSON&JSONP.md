what's JSON & JSONP
======
####**jsonp**(JSON with Padding)只是手段，
####**json**(JavaScript Object Notation) 才是目的。

------
###**JSON**
JSON(JavaScript Object Notation) 是一种轻量级的**数据交换格式**。 易于人阅读和编写。同时也易于机器解析和生成。 它基于JavaScript Programming Language, Standard ECMA-262 3rd Edition – December 1999的一个子集。 JSON采用完全独立于语言的文本格式，但是也使用了类似于C语言家族的习惯（包括C, C++, C#, Java, JavaScript, Perl, Python等）。 这些特性使JSON成为理想的数据交换语言。

JSON建构于两种结构：
“名称/值”对的集合（A collection of name/value pairs）。不同的语言中，它被理解为对象（object），纪录（record），结构（struct），字典（dictionary），哈希表（hash table），有键列表（keyed list），或者关联数组 （associative array）。
值的有序列表（An ordered list of values）。在大部分语言中，它被理解为数组（array）。
这些都是常见的数据结构。事实上大部分现代计算机语言都以某种形式支持它们。这使得**一种数据格式在同样基于这些结构的编程语言之间交换成为可能。**

####**JSON具有以下这些形式：**
*json对象*
**对象**是一个无序的“‘名称/值’对”集合。一个对象以“{”（左括号）开始，“}”（右括号）结束。每个“名称”后跟一个“:”（冒号）；“‘名称/值’ 对”之间使用“,”（逗号）分隔。

<img src="https://www.biaodianfu.com/wp-content/uploads/2014/03/object.gif">

-----
*json数组对象*
**数组是值（value）**的有序集合。一个数组以“[”（左中括号）开始，“]”（右中括号）结束。值之间使用“,”（逗号）分隔。

<img src="https://www.biaodianfu.com/wp-content/uploads/2014/03/array.gif">

------

**值（value）**可以是双引号括起来的字符串（string）、数值(number)、true、false、 null、对象（object）或者数组（array）。这些结构可以嵌套。

<img src="https://www.biaodianfu.com/wp-content/uploads/2014/03/value.gif">

-----


**字符串（string）**是由双引号包围的任意数量Unicode字符的集合，使用反斜线转义。一个字符（character）即一个单独的字符串（character string）。


<img src="https://www.biaodianfu.com/wp-content/uploads/2014/03/string.gif">

------


**数值（number）**也与C或者Java的数值非常相似。除去未曾使用的八进制与十六进制格式。除去一些编码细节。

<img src="https://www.biaodianfu.com/wp-content/uploads/2014/03/number.gif">

-----
>**JSON的优点：**
>-基于纯文本，跨平台传递极其简单；
>-Javascript原生支持，后台语言几乎全部支持；
>-轻量级数据格式，占用字符数量极少，特别适合互联网传递；
>-可读性较强，虽然比不上XML那么一目了然，但在合理的依次缩进之后还是很容易识别的；
>-容易编写和解析，当然前提是你要知道数据结构；

-----
###json实例
```
// 描述一个人
 
var person = {
    "Name": "Bob",
    "Age": 32,
    "Company": "IBM",
    "Engineer": true
}
 
// 获取这个人的信息
 
var personAge = person.Age;
 
// 描述几个人
 
var members = [
    {
        "Name": "Bob",
        "Age": 32,
        "Company": "IBM",
        "Engineer": true
    },
    {
        "Name": "John",
        "Age": 20,
        "Company": "Oracle",
        "Engineer": false
    },
    {
        "Name": "Henry",
        "Age": 45,
        "Company": "Microsoft",
        "Engineer": false
    }
]
 
// 读取其中John的公司名称
 
var johnsCompany = members[1].Company;
 
// 描述一次会议
 
var conference = {
    "Conference": "Future Marketing",
    "Date": "2012-6-1",
    "Address": "Beijing",
    "Members":
    [
        {
            "Name": "Bob",
            "Age": 32,
            "Company": "IBM",
            "Engineer": true
        },
        {
            "Name": "John",
            "Age": 20,
            "Company": "Oracle",
            "Engineer": false
        },
        {
            "Name": "Henry",
            "Age": 45,
            "Company": "Microsoft",
            "Engineer": false
        }
    ]
}
 
// 读取参会者Henry是否工程师
 
var henryIsAnEngineer = conference.Members[2].Engineer;`
```

----
###**JSONP**

JSONP（JSON with Padding）是资料格式 JSON 的一种“使用模式”，很形象，就是把json对象用符合js语法的形式包裹起来以使其它网站可以请求得到，也就是将json数据封装成js文件，它可以让网页从别的网域要资料。

由于**同源策略**，一般来说位于 server1.example.com 的网页无法与不是 server1.example.com 的服务器沟通，而 HTML 的 script元素是一个例外。利用script 元素的这个开放策略，网页可以得到从其他来源动态产生的 JSON 资料，而这种使用模式就是所谓的 JSONP。用 JSONP 抓到的资料并不是 JSON，而是任意的 JavaScript，用 JavaScript 直译器执行而不是用 JSON 解析器解析。

----
>**同源策略**
>
>-所谓同源策略，指的是浏览器对不同源的脚本或者文本的访问方式进行的限制。比如源a的js不能读取或设置引入的源b的元素属性。

>-那么先定义下什么是同源，所谓同源，就是指两个页面具有**相同的协议**，**主机（也常说域名）**，**端口**，三个要素缺一不可。

>可以看下面的几个示例来更加清楚的了解一下同源的概念：
><table>
<thead>
<tr><th>URL1</th><th>URL2</th><th>说明</th><th>是否允许通信</th></tr>
</thead>
<tbody>
<tr>
<td><a href="http://www.foo.com/js/a.js" target="_blank">http://www.foo.com/js/a.js</a></td>
<td><a href="http://www.foo.com/js/b.js" target="_blank">http://www.foo.com/js/b.js</a></td>
<td>协议、域名、端口都相同</td>
<td>允许</td>
</tr>
<tr>
<td><a href="http://www.foo.com/js/a.js" target="_blank">http://www.foo.com/js/a.js</a></td>
<td><a href="http://www.foo.com:8888/js/b.js" target="_blank">http://www.foo.com:8888/js/b.js</a></td>
<td>协议、域名相同，端口不同</td>
<td>不允许</td>
</tr>
<tr>
<td><a href="https://www.foo.com/js/a.js" target="_blank">https://www.foo.com/js/a.js</a></td>
<td><a href="http://www.foo.com/js/b.js" target="_blank">http://www.foo.com/js/b.js</a></td>
<td>主机、域名相同，协议不同</td>
<td>不允许</td>
</tr>
<tr>
<td><a href="http://www.foo.com/js/a.js" target="_blank">http://www.foo.com/js/a.js</a></td>
<td><a href="http://www.bar.com/js/b.js" target="_blank">http://www.bar.com/js/b.js</a></td>
<td>协议、端口相同，域名不同</td>
<td>不允许</td>
</tr>
<tr>
<td><a href="http://www.foo.com/js/a.js" target="_blank">http://www.foo.com/js/a.js</a></td>
<td><a href="http://foo.com/js/b.js" target="_blank">http://foo.com/js/b.js</a></td>
<td>协议、端口相同，主域名相同，子域名不同</td>
<td>不允许</td>
</tr>
</tbody>
</table>

----
**同源策略限制了不同源之间的交互**，也许你会有疑问，我们以前在写代码的时候也常常会引用其他域名的js文件，样式文件，图片文件什么的，没看到限制啊，这个定义是不是错了。

其实不然，同源策略限制的不同源之间的交互**主要针对的是js中的XMLHttpRequest等请求，浏览器禁止Javascript去取response的数据**，**页面中的链接，重定向以及表单提交是不会受到同源策略限制的**。

----
###提问
####**ajax**的核心对象也是**XMLHttpRequest**，那是否和JSONP一样？

----
休息：谁来手写一段[XMLHttpRequest请求](http://10.146.67.200:8081/web/jason.chen/demo/jsonp/XmlHttpRequest.html)
思考：如果请求不同源的数据会怎么样？

----

####现在回到JSONP


>-[get请求不同域json数据](http://10.146.67.200:8081/web/jason.chen/demo/jsonp/jsonp.html)
>-[jsonp请求不同域数据](http://10.146.67.200:8081/web/jason.chen/demo/jsonp/jsonp2.html)
>-[jquery封装的jsonp请求](http://10.146.67.200:8081/web/jason.chen/demo/jsonp/jsonp3.html)

----
####XMLHttpRequest和JSONP的差别有哪些？

>-ajax和jsonp这两种技术在调用方式上**“看起来”很像，目的也一样**，都是请求一个url，然后把服务器返回的数据进行处理，因此jquery等框架都把jsonp作为ajax的一种形式进行了封装。

>-但ajax和jsonp其实本质上是不同的东西。**ajax的核心是通过XmlHttpRequest获取非本页内容**，而**jsonp的核心则是动态添加script标签来调用服务器提供的js脚本。**

>-所以说，其实**ajax与jsonp的区别不在于是否跨域**，ajax通过服务端代理一样可以实现跨域，jsonp本身也不排斥同域的数据的获取。

>-还有就是，jsonp是一种方式或者说非强制性协议，如同ajax一样，它也不一定非要用json格式来传递数据，如果你愿意，字符串都行，只不过这样不利于用jsonp提供公开服务。

>-**jsonp不是ajax的一个特例**，哪怕jquery等巨头把jsonp封装进了ajax，也不能改变这一点。

----


总结
----
####**jsonp只是手段,json才是目的**
json是理想的数据交换格式，但没办法跨域直接获取，于是就将json包裹(padding)在一个合法的js语句中作为js文件传过去。这就是json和jsonp的区别，json是想要的东西，jsonp是达到这个目的而普遍采用的一种方法，当然最终获得和处理的还是json。json总会用到，而jsonp只有在跨域获取数据才会用到。

