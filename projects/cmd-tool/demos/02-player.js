class Player {
  // 给他初始的名字和分数
  constructor(name) {
    this.name = name;
    this.score = 0;
  }
  // 每⼀局打完，统计⼲掉游戏⽬标个数，来奖励分值
  killed(target, number) {
    if (target !== "zombie") return;
    if (number < 10) {
      this.score += 10 * number;
    } else if (number < 20) {
      this.score += 8 * number;
    } else if (number < 30) {
      this.score += 5 * number;
    }
    console.log(
      `${this.name} 成功击杀 ${number} 个 ${target}，总得分 ${this.score}`
    );
  }
}
// 创建⼀个玩家⼈物
let player = new Player("Nil");
// 玩了 3 局，每⼀局都有收获
player.killed("zombie", 5);
player.killed("zombie", 12);
player.killed("zombie", 22);
// Nil 成功击杀 5 个 zombie，总得分 50
// Nil 成功击杀 12 个 zombie，总得分 146
// Nil 成功击杀 22 个 zombie，总得分 256