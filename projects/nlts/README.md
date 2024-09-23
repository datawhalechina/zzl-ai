# nlts

查询 Node LTS 版本的命令行工具

---

## 使用说明

安装依赖，关联指令

```sh
npm i && npm link
```

本地开发时，也可以直接 `npm i ./ -g`，就可以把这个文件夹的包，安装到全局

---

## 指令说明

```shell
$ nlts --help

  Usage:
    nlts [version]

  Options:
    -v, --version    print the version of vc
    -h, --help       display this message

  Examples:
    $ nlts 8
```

---

## 用法

挑选 > 18.0.0 的 LTS 版本, 或者省略数字，直接 `nlts`。

```sh
nlts 18
```

---

## License

ISC

---
