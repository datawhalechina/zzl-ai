// events 是 Node 的 built-in 模块，它提供了 EventEmitter 类
const EventEmitter = require("events");
// 创建 EventEmitter 的事件实例
const ee = new EventEmitter();
// 为实例增加 open 事件的监听以及注册回调函数，事件名甚⾄可以是中⽂
ee.on("open", (error, result) => {
  console.log("事件发⽣了，第⼀个监听回调函数执⾏");
});
// 为实例再增加⼀个 增加 open 事件的监听器
ee.on("open", (error, result) => {
  console.log("事件发⽣了，第⼆个监听回调函数执⾏");
});
// 通过 emit 来发出事件，所有该事件队列⾥的回调函数都会顺序执⾏
ee.emit("open");
console.log("触发后，隔⼀秒再触发⼀次");
setTimeout(() => {
  ee.emit("open");
}, 1000);
// 事件发⽣了，第⼀个监听回调函数执⾏
// 事件发⽣了，第⼆个监听回调函数执⾏
// 触发后，隔⼀秒再触发⼀次
// 事件发⽣了，第⼀个监听回调函数执⾏
// 事件发⽣了，第⼆个监听回调函数执⾏