function CanvasserUtils(){
  this.setSubProp = function(obj, desc, val){
    var arr = desc.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj[arr[0]] = (typeof(val) === "boolean" ? val : (isNaN(val) ? val : (val.indexOf(".")==-1)? parseInt(val) : parseFloat(val)));
  }

  this.getSubProp = function(obj, desc){
    var arr = desc.split(".");
    while(arr.length > 1){
      var isnum = /^\d+$/.test(arr[0]);
      if (isnum) arr[0] = parseInt(arr[0]);
      obj = obj[arr[0]];
      if (obj === undefined) return undefined;
      arr.shift();
    }
    return obj[arr[0]];
  }

  this.buildDiv = function(classes, content, clicker, params){
    var click = ''
    if (clicker !== undefined) {
      click = ' onclick="' + clicker + '(';
      params.forEach(function(param, index){
        click += "'" +  param + "'";
        if (index < params.length-1) click +=',';
      });
      click += ') ";'
    }
    return '<div class="' + classes + '"' + click + '>' + content + '</div>';
  }

   this.buildSelect = function(fn, object, type, list, defaultId, path){
    var out = '<select class="sellist"';
    out += this.buildFnString(fn, [object, type, path], true) + '>';
    var newList = list.slice();
    newList.unshift("---NONE---");
    newList.forEach(function(listObject){
      out += '<option value="'+ listObject + '"'+ (listObject === defaultId ? " selected" : "" )+ '>' + listObject + '</option>';
    });
    out += "</select>";
    return out;
  }

  this.handleBoolean = function(object, type, widget, path){
    var str = '';
    var defaultId = this.getSubProp(object, path);
    str += '<div class="entrylabel c_entrytitle_text w100">' + widget.field + '</div><input class="checkbox" type="checkbox" ' + (defaultId ? "checked " : "");
    str += this.buildFnString('window.author.updateItem', [object.id, type, path], true) + '><br>';
    return str;
  }

  this.handleNumber = function(object, type, widget, path){
    var str = '';
    var num = this.getSubProp(object, path);
    str += this.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += '<input class="auth_xy" type="number" value="'+ num + '" ';
    str += this.buildFnString('window.author.updateItem', [object.id, type, path], true);
    str +=   '>'  + "<br>";
    return str;
  }

  this.objPartToArr = function(obj, part){
    var out = [];
    for(var prop in obj){
      out.push(obj[prop][part]);
    }
    return out;
  }

  this.handleSelect = function(object, type, widget, path, list){
    var str = '';
    var selOp = (list === undefined ? window.rules.select[widget.id].list : list);
    var defaultId = this.getSubProp(object, path);
    str += this.buildDiv('entrylabel c_entrytitle_text w100', widget.field );
    str += this.buildSelect('window.author.updateItem',  object.id, type, selOp, defaultId, path) + '<br>';
    return str;
  }

  this.buildFnString = function(fn, params, change){
    var str = (change ? 'onchange=' : '') + '"' + fn + '(this';
    params.forEach(function(pName){
      str += ", '" + pName + "'";
    });
    return str + ')" ';
  }

  this.handlePosition = function(object, type, widget, path){
    var str = '';
    var pos = {x:this.getSubProp(object, path+'.x'), y:this.getSubProp(object, path+'.y')};
    str += this.buildDiv('entrylabel c_entrylabel_pos w100', widget.field );
    str += '<span>';
    str += '<span class="entrytitle c_entrylabel_pos">X</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.x + '" ';
    str += this.buildFnString('window.author.updateItem', [object.id, type, path+'.x'], true);
    str +=   '>';
    str += '<span class="entrytitle c_entrylabel_pos">Y</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.y + '" ';
    str += this.buildFnString('window.author.updateItem', [object.id, type, path+'.y'], true);
    str +=   '>'  + "</span><br>";
    return str;
  }

  this.requestJSON = function(fileNamePath, returnFunction){
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          returnFunction(JSON.parse(xhr.responseText));
        }
        if (xhr.status == 404) console.error("JSON File Load Error: " + xhr.statusText + " " + xhr.readyState);
      }
      xhr.overrideMimeType('application/json');
      xhr.open('GET', fileNamePath, true);
    xhr.send(null);
    }
}