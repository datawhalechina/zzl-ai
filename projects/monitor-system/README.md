# 启动教程
## 1、访问docker官网：https://www.docker.com/ 安装docker，并启动
## 2、安装 docker-compose，如果是macos，可使用```brew install docker-compose```安装
## 3、执行 ```docker-compose up --build```
## 4、使用postman，POST, GET 请求访问 http://localhost:3000/api/collect，测试前端错误的收集和上报。

### 上报数据示例

示例 1：JavaScript 错误日志
```json
{
  "timestamp": "2024-09-01T12:34:56.789Z",
  "level": "error",
  "message": "Uncaught TypeError: Cannot read property 'foo' of undefined",
  "stack": "TypeError: Cannot read property 'foo' of undefined\n    at example.js:10:15\n    at Array.forEach (<anonymous>)\n    at Function.map (<anonymous>)",
  "url": "https://www.example.com/page1",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
  "userId": "user123",
  "ip": "192.168.1.1",
  "deviceType": "desktop",
  "os": "Windows",
  "browser": "Chrome 85",
  "network": "WiFi",
  "appVersion": "1.0.0",
  "customData": {
    "module": "user-dashboard",
    "feature": "data-visualization"
  }
}
```

示例 2：用户行为事件日志
```json
{
  "timestamp": "2024-09-01T12:40:12.345Z",
  "level": "info",
  "message": "User clicked on 'Submit' button",
  "url": "https://www.example.com/checkout",
  "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  "userId": "user456",
  "ip": "203.0.113.5",
  "deviceType": "mobile",
  "os": "iOS",
  "browser": "Safari 14",
  "network": "4G",
  "appVersion": "1.2.3",
  "customData": {
    "action": "click",
    "element": "submit-button",
    "pageSection": "footer"
  }
}
```

示例 3：页面加载时间日志
```json
{
  "timestamp": "2024-09-01T12:45:22.678Z",
  "level": "info",
  "message": "Page load time recorded",
  "url": "https://www.example.com/home",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
  "userId": "user789",
  "ip": "198.51.100.12",
  "deviceType": "desktop",
  "os": "MacOS",
  "browser": "Chrome 85",
  "network": "WiFi",
  "appVersion": "2.0.1",
  "customData": {
    "loadTime": 3.4,
    "resourcesLoaded": 25,
    "redirects": 2
  }
}
```

示例 4：API 请求错误日志
```json
{
  "timestamp": "2024-09-01T12:50:11.123Z",
  "level": "warn",
  "message": "Failed to fetch data from /api/v1/products",
  "url": "https://www.example.com/products",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36",
  "userId": "user987",
  "ip": "192.0.2.45",
  "deviceType": "desktop",
  "os": "Windows",
  "browser": "Chrome 85",
  "network": "WiFi",
  "appVersion": "2.1.0",
  "customData": {
    "endpoint": "/api/v1/products",
    "status": 500,
    "responseTime": 1200
  }
}
```

示例 5：用户注册事件日志
```json
{
  "timestamp": "2024-09-01T12:55:09.999Z",
  "level": "info",
  "message": "User registered successfully",
  "url": "https://www.example.com/register",
  "userAgent": "Mozilla/5.0 (Linux; Android 9; SM-G960F Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.136 Mobile Safari/537.36",
  "userId": "user654",
  "ip": "203.0.113.88",
  "deviceType": "mobile",
  "os": "Android",
  "browser": "Chrome Mobile 74",
  "network": "4G",
  "appVersion": "3.0.0",
  "customData": {
    "referrer": "https://www.example.com/login",
    "campaign": "summer-sale"
  }
}
```

## 5、打开浏览器并访问 http://localhost:5601，可以在 Kibana 中创建索引模式并开始分析数据。

查询上报数据示例

```elastic
GET /events/_search
{
  "query": {
    "match_all": {}
  }
}
```
