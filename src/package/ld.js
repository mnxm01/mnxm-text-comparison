const DEFAULT_VALUE = String.fromCharCode(0);

var LD = function (options = {}) {

  var self = this;

  this.options = {
    equTemp: "{{CONTENT}}",
    addTemp: "<span style='color:green;'>{{CONTENT}}</span>",
    delTemp: "<del style='color:red;'>{{CONTENT}}</del>",
    ...options
  };

  const initArray = function (source, target) {

    source = DEFAULT_VALUE + source;
    target = DEFAULT_VALUE + target;

    var sourceArr = new Array(source.length).fill(null).map((item, i) => source.charAt(i));
    var targetArr = new Array(target.length).fill(null).map((item, i) => target.charAt(i));

    var arr = sourceArr.map(item1 => (targetArr.map(item2 => ({ flag: item1 == item2, value: Number.MAX_SAFE_INTEGER }))));

    arr.forEach((subArr, i) => {
      subArr.forEach((item, j) => {
        if (i == 0 || j == 0) {
          item.value = Math.max(i, j);
          return
        }
        if (item.flag) {
          item.value = arr[i - 1][j - 1].value;
        }
        else {
          item.value = Math.min(arr[i - 1][j].value, arr[i][j - 1].value, arr[i - 1][j - 1].value) + 1;
        }
      });
    });

    return {
      arr, source, target, sourceArr, targetArr
    }
  };

  const calcLD = function ({ arr, source, target, sourceArr, targetArr }) {

    var sourcePad = "";
    var targetPad = "";
    var i = source.length - 1;
    var j = target.length - 1;

    while (i > 0 && j > 0) {
      var val = Math.min(arr[i - 1][j - 1].value, arr[i - 1][j].value, arr[i][j - 1].value)
      if (arr[i - 1][j - 1].value == val) {
        sourcePad = sourceArr[i] + sourcePad;
        targetPad = targetArr[j] + targetPad;
        i--; j--;
      } else if (arr[i - 1][j].value == val) {
        sourcePad = sourceArr[i] + sourcePad;
        targetPad = DEFAULT_VALUE + targetPad;
        i--;
      } else if (arr[i][j - 1].value == val) {
        sourcePad = DEFAULT_VALUE + sourcePad;
        targetPad = targetArr[j] + targetPad;
        j--;
      }
    }

    while (i > 0 || j > 0) {
      if (j > 0) {
        sourcePad = DEFAULT_VALUE + sourcePad;
        targetPad = targetArr[j] + targetPad;
        j--;
      }
      else if (i > 0) {
        sourcePad = sourceArr[i] + sourcePad;
        targetPad = DEFAULT_VALUE + targetPad;
        i--;
      }
    }

    if (i == 0 && j == 0) {
      if (sourceArr[i] == targetArr[j]) {
        sourcePad = sourceArr[i] + sourcePad;
        targetPad = targetArr[j] + targetPad;
      }
      else {
        sourcePad = sourceArr[i] + DEFAULT_VALUE + sourcePad;
        targetPad = DEFAULT_VALUE + targetArr[j] + targetPad;
      }
    }

    var result = "";
    var equBlock = "";
    var delBlock = "";
    var addBlock = "";
    var blockType = "equ";

    const formate = function () {

      if(equBlock){
        result += self.options.equTemp.replace("{{CONTENT}}", equBlock);
        equBlock = "";
      }
      if (blockType == "neq") {
        result += self.options.delTemp.replace("{{CONTENT}}", delBlock);
        result += self.options.addTemp.replace("{{CONTENT}}", addBlock);
      }
      if (blockType == "del") {
        result += self.options.delTemp.replace("{{CONTENT}}", delBlock);
        result += self.options.addTemp.replace("{{CONTENT}}", addBlock);
      }
      if (blockType == "add") {
        result += self.options.addTemp.replace("{{CONTENT}}", addBlock);
        result += self.options.delTemp.replace("{{CONTENT}}", delBlock);
      }
      delBlock = "";
      addBlock = "";
    }

    for (var i = 0; i < sourcePad.length; i++) {
      if (sourcePad.charAt(i) == targetPad.charAt(i)) {
        if (blockType != "equ") formate()
        equBlock += sourcePad.charAt(i);
        blockType = "equ"
      }
      else if (sourcePad.charAt(i) == DEFAULT_VALUE) {
        if (blockType != "add") formate()
        addBlock += targetPad.charAt(i);
        blockType = "add";
      }
      else if (targetPad.charAt(i) == DEFAULT_VALUE) {
        if (blockType != "del") formate()
        delBlock += sourcePad.charAt(i);
        blockType = "del";
      }
      else {
        delBlock += sourcePad.charAt(i);
        addBlock += targetPad.charAt(i);
        blockType = "neq"
      }
    }
    formate();

    return result.replace(DEFAULT_VALUE, "");
  }

  this.getResult = function (source, target) { return calcLD(initArray(source, target)); }
}

export default LD;