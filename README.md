# mnxm-text-comparison
文本比较
## 安装
```
npm install --save mnxm-text-comparison
```
## 使用
```
import { LD } from "mnxm-text-comparison";

var options = {
    equTemp: "{{CONTENT}}",
    addTemp: "<span style='color:green;'>{{CONTENT}}</span>",
    delTemp: "<del style='color:red;'>{{CONTENT}}</del>",
};

new LD(options).getResult(this.text1, this.text2);
```
## 示例
http://demo.mnxm.work/#/text-comparision
