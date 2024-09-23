const EventEmitter = require("events");
// 声明玩家类，让它继承 EventEmitter
class Player extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.score = 0;
  }
}
let player = new Player("Nil");
// 每⼀个创建的玩家实例，都可以添加监听器
// 也可以定义需要触发事件的名称，为其注册回调
player.on("zombie", function (number) {
  if (number < 10) {
    this.score += 10 * number;
  } else if (number < 20) {
    this.score += 8 * number;
  } else if (number < 30) {
    this.score += 5 * number;
  }
  console.log(
    `${this.name} 成功击杀 ${number} 个 zombie，总得分 ${this.score}`
  );
});
// 可以触发不同的事件类型
player.emit("zombie", 5);
player.emit("zombie", 12);
player.emit("zombie", 22);
// Nil 成功击杀 5 个 zombie，总得分 50
// Nil 成功击杀 12 个 zombie，总得分 146
// Nil 成功击杀 22 个 zombie，总得分 256