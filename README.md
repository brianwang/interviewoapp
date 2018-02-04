# interviewoapp
interview with team214

用meteor构建一个product的CRUD网站 （https://www.meteor.com/）
1. 用户可以查看products列表页
2. 用户可以添加更新删除product
3. 表单input 需要有validation，字段name为必填，price需为数字。需用validate插件。
4. 用户可以search products。需用elastcisearch。关键字的搜索在product name和product description上。
搜索的结果要按相关性从高到低排序。product name的匹配的相关性高于product description的匹配相关性


2018-2-4 
已经实现的功能：
1. 在不使用elasticsearch引擎的情况下，使用mongodb可以增删改
2. 已经搭建了elasticsearch在本地的环境，但是目前对js-api还不是很熟悉
3. 使用angularjs 1.0作为前端模板
4. 增加了input validate，但是是使用的meteor自身的check function
5. 排序还没有做，本周内继续


