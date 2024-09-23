## 人才库数据表结构说明

### sys_dic_items

数据字典记录表，用于放置系统配置项

|字段名|字段说明|字段类型|
|:----|:---|:---|
|id|字典项id|INTEGER|
|name|字典名|STRING|
|value|字典值|STRING|
|note|字典备注|STRING|
|sort_num|字典项id|INTEGER|
|group_name|字典分类|STRING|
|enable|字典是否启用|INTEGER|
|created_at|创建时间|DATE|
|updated_at|修改时间|DATE|
|delete_at|删除时间|DATE|

> enable  说明

|字段值|字段说明|
|:----|:---|
|0|禁用，默认值|
|1|启用|

---

> RESUME_ORIGIN  字典默认值说明

招聘类型

|字段值|字段说明|
|:----|:---|
|0|社招|
|1|校招|

---

> INTERVIEWEE_STATUS  说明

面试流程字典

|字段值|字段说明|
|:----|:---|
|0|一面|
|1|二面|
|2|三面|
|3|四面|
|4|五面|
|5|六面|
|6|发放 offer|
|7|正式入职|

---

> EDUCATION_STATUS  说明

候选人学历字典

|字段值|字段说明|
|:----|:---|
|0|高中|
|1|本科|
|2|研究生|
|3|博士|
|4|其他|

---

> INTERVIEWEE_TYPE  说明

面试方式字典

|字段值|字段说明|
|:----|:---|
|0|现场面试|
|1|电话面试|
|2|视频面试|
|3|其他|

---

> STATUS  说明

状态管理字典

|字段值|字段说明|
|:----|:---|
|0|禁用|
|1|启用|

---

> ROLE_TYPE  说明

状态管理字典

|字段值|字段说明|
|:----|:---|
|0|外部猎头，默认值|
|1|面试官|
|2|部门经理|
|3|超级管理者|

---

### bu

部门表

|字段名|字段说明|字段类型|
|:----|:---|:---|
|id|部门 id|INTEGER|
|name|部门名称|STRING|
|created_at|创建时间|DATE|
|updated_at|修改时间|DATE|
|delete_at|删除时间|DATE|

### function

职位表

|字段名|字段说明|字段类型|
|:----|:---|:---|
|id|职位 id|INTEGER|
|name|职位名称|STRING|
|bu_id|BU逻辑外键|INTEGER|
|created_at|创建时间|DATE|
|updated_at|修改时间|DATE|
|delete_at|删除时间|DATE|

### user

用户表

|字段名|字段说明|字段类型|
|:----|:---|:---|
|id|用户id|INTEGER|
|name|用户名|STRING|
|phone|用户手机号|STRING|
|password|用户密码|STRING|
|login_attempts|登录失败的次数|BIGINT|
|lock_until|登录失败被锁定后，多久后释放|INTEGER|
|password|用户密码|STRING|
|bu_id|部门标识外键|STRING|
|role_type|用户角色|STRING|
|created_at|创建时间|DATE|
|updated_at|修改时间|DATE|
|delete_at|删除时间|DATE|

> roleType 说明

|字段值|字段说明|
|:----|:---|
|0|外部猎头，默认值|
|1|面试官|
|2|部门经理|
|3|超级管理者|

---

### interviewee

候选人记录表

|字段名|字段说明|字段类型|是否能为空|
|:----|:---|:---|:---|
|id|候选人 id|INTEGER|required|
|name|候选人姓名|STRING|required|
|phone|候选人手机号|STRING|required|
|email|候选人电子邮箱|STRING|required|
|address|候选人地址|STRING|required|
|education|候选人学历，一般为 高中，大专，本科，研究生，博士，其他|STRING|required|
|type|招聘类型, 0 社招 1 校招，默认 0|INTEGER|required|
|is_internship|是否实习, 0 试用 1 实习，默认 0|INTEGER|
|job_id|推荐岗位外键|INTEGER|required|
|resume_path|简历路径|STRING|required|
|reason|推荐理由|STRING|required|
|note|推荐备注|STRING||
|channel|招聘渠道, 0 外部 1 内部，默认 1|STRING|required|
|status|面试状态, 一面, 二面, 三面, 四面, 五面, 六面, 发放 offer, 正式入职|STRING||
|state|数据是否有效 0 无效 1 有效|INTEGER|required|
|is_success|是否成功 0 不成功 1 成功|INTEGER|required|
|viewer_id|面试官外键|INTEGER||
|recommender_id|内推人外键|INTEGER|required|
|created_at|创建时间|DATE|required|
|updated_at|修改时间|DATE|required|
|delete_at|删除时间|DATE|required|

### job

岗位表

|字段名|字段说明|字段类型|
|:----|:---|:---|
|id|岗位 id|INTEGER|
|name|岗位名称|STRING||
|responsibility|岗位职责|TEXT|
|description|面试官手机号|TEXT|
|bu_id|BU 逻辑外键|INTEGER|
|function_id|function 逻辑外键|INTEGER|
|user_id|用户逻辑外键|INTEGER|
|state|数据是否有效|INTEGER|
|created_at|创建时间|DATE|
|updated_at|修改时间|DATE|
|delete_at|删除时间|DATE|

### interviewee_record

面试记录表

|字段名|字段说明|字段类型|是否能为空|
|:----|:---|:---|:---|
|id|面试记录 id|INTEGER|required|
|viewer_id|面试官外键|STRING|required|
|interviewee_id|候选人外键|INTEGER|required|
|state|面试流程是否结束|INTEGER|required|
|step|第几面|INTEGER|required|
|step_name|当前步骤名称|STRING|required|
|comment|面试评语|STRING|required|
|created_at|创建时间|DATE|required|
|updated_at|修改时间|DATE|required|
|delete_at|删除时间|DATE|required|
