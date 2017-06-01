function initAuthorCanvasser(vari, datafile, dataForm){
  var utils     = new CanvasserUtils();


  utils.requestJSON("./json/author.json", setRules);
  function setRules(data){
    window.rules  = data;
    utils.requestJSON("./json/default.json", initEdit);
  }

  function initEdit(datafile){
    window.author = new authorcanvasser(datafile, 'file');
  }
}

function authorcanvasser(dataFile, dataForm){
  var buildProp = new BuildProp();
  var utils     = new CanvasserUtils();
  var menus     = new Menus();
  this.addObject = menus.addObject;
  this.addImage  = menus.addImage;

  var UIdata = {
    mousedown: false,
    moveElement: null,
    mousePos: {x:0,y:0},
    offset: {x:0,y:0},
    zidx: 25
  };

  authorData = dataFile;

  document.getElementById("canvasmover").addEventListener("mousedown",     function(){moveObjD("canvasbank")},     false);
  document.getElementById("shapemover").addEventListener("mousedown",      function(){moveObjD("shapebank")},      false);
  document.getElementById("objectmover").addEventListener("mousedown",     function(){moveObjD("objectbank")},     false);
  document.getElementById("imagemover").addEventListener("mousedown",      function(){moveObjD("imagebank")},      false);
  document.getElementById("jsonmover").addEventListener("mousedown",       function(){moveObjD("jsonbank")},       false);
  document.getElementById("settingmover").addEventListener("mousedown",    function(){moveObjD("settingbank")},    false);
  document.getElementById("propertiesmover").addEventListener("mousedown", function(){moveObjD("propertiesbank")}, false);
  document.getElementById("pathmover").addEventListener("mousedown",       function(){moveObjD("pathbank")},       false);
  document.getElementById("animmover").addEventListener("mousedown",       function(){moveObjD("animbank")},       false);

  window.addEventListener("mouseup",   moveObjU,  false);
  window.addEventListener("mousemove", mouseMove, false);
  initCanvasser("sample", JSON.stringify(authorData), "string");
  menus.updateSettings();
  menus.updateObjects();
  menus.updateImages();
  updatePaths();
  menus.updateShapes();
  menus.updateAnims();
  loop();

  function loop(){
    if (UIdata.moveElement !== null){
      UIdata.moveElement.style.left = UIdata.mousePos.x  - UIdata.offset.x + "px";
      UIdata.moveElement.style.top  = UIdata.mousePos.y  - UIdata.offset.y + "px";
    }
    window.requestAnimationFrame(loop);
  }

  function mouseMove(ev){
    UIdata.mousePos = {x:ev.clientX, y:ev.clientY };

    if (UIdata.moveElement !== null){
      if (document.selection) {
        document.selection.empty()
      } else {
        window.getSelection().removeAllRanges()
      }
    }
  }

  function moveObjD(element){
    UIdata.mousedown   = true;
    UIdata.moveElement = document.getElementById(element);
    UIdata.zidx ++;
    UIdata.moveElement.style.zIndex = UIdata.zidx;
    var off = {x:0, y:0};
    if (UIdata.moveElement.style.left !== "") off.x = UIdata.mousePos.x - parseInt(UIdata.moveElement.style.left.slice(0,-2));
    if (UIdata.moveElement.style.top  !== "") off.y = UIdata.mousePos.y - parseInt(UIdata.moveElement.style.top.slice(0,-2));
    UIdata.offset      = {x:off.x, y:off.y};
  }

  function moveObjU(ev){
    UIdata.mousedown = false;
    UIdata.moveElement = null;
  }

  this.reload = function(){
    initCanvasser("sample", JSON.stringify(authorData), "string");
    window.author.view()
  }
  this.load_click = function(){
    document.getElementById("uploader").click();
  }
  this.load = function(){
    var file = document.getElementById("uploader").files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        document.getElementById("paste").innerHTML = evt.target.result;
      }
      reader.onerror = function (evt) {
        document.getElementById("paste").innerHTML = "error reading file";
      }
    }
  }
  this.view = function(){
    document.getElementById("paste").value = JSON.stringify(authorData);
  }
  this.paste = function(){
    var pasteData = document.getElementById("paste").value;
    authorData = JSON.parse(pasteData);
    menus.updateObjects();
    menus.updateImages();
    menus.updateShapes();
    initCanvasser("sample", pasteData, "string");
  }
  this.format = function(){
    var pasteData = document.getElementById("paste").value;
    document.getElementById("paste").value = JSON.stringify(authorData, null, 4);
  }
  this.toggleminmax= function(element, minmax, maxsize){
    var d = document.getElementById(element);
    var b = document.getElementById(minmax);
    if (d.style.display === "block"){
      d.style.display="none";
      b.src="image/icon_max_g.png";
    }
    else {
      d.style.display = "block";
      b.src="image/icon_min_g.png";
    }
  }

  this.togglejson= function(){
    var s = document.getElementById("jsonmenu");
    var b = document.getElementById("togglejson");
    if (s.style.display === "block") {
      s.style.display = "none";
      b.src="image/icon_max_g.png";
    }
    else {
      s.style.display = "block";
      b.src="image/icon_min_g.png";
    }
  }

  this.addPath = function(){
    authorData.paths.push({id:"newpath",url:"./"});
    updatePaths();
    getPath('newpath');
  }

  this.addAnim = function(){
    authorData.anims.push({id:"newanim",autostart:false, length:60, timelist:[]});
    menus.updateAnims();
    getProps('anims', 'newanim');
  }

  function updatePaths(){
    var pathsHolder = document.getElementById("pathholder");
    var paths = '<table class="objtable" id="pathstable" width="100%">';

    authorData.paths.forEach(function(path){
      paths += '<tr class="clicktr" id="'+path.id+'" onclick="window.author.getPath(\''+ path.id + '\')">';
      paths +='<td width="50%">' + path.id + '</td>';
      paths +='<td width="50%">' +path.url + '</td>';
      paths += '</tr>';
    });
    paths +='</table>';
    pathsHolder.innerHTML = paths;
  }

  this.getSetting = getSetting;
  function getSetting(setting){
    document.getElementById("propertiestitle").innerHTML ='<div class="proptitle">Setting:' + setting  + '</div>';
    var propUI = document.getElementById("properties");
    var type = window.rules.settings[setting].type === "text" ? "text" : "number";
    var prop = '<div class="propbody">' ;
    prop += '<div class="entrylabel c_entrytitle_text w200">'+setting+'</div>';
    prop += '<input class="auth_text w200" type="'+ type +'" ';
    prop += 'value="'+ authorData.settings[setting] + '" ';
    prop += utils.buildFnString('window.author.updateSetting', [setting], true);
    prop += '><br>';
    propUI.innerHTML = prop + '</div>';
  }

  this.getPath = getPath;
  function getPath(id){
    thisProp = authorData.paths.filter(function(selected){return selected.id === id;})[0];
    updateSelectionWindow('paths',id);
    document.getElementById("propertiestitle").innerHTML ='<div class="proptitle">Path:' + id + '</div>';
    var propUI = document.getElementById("properties");
    var prop = '<div class="propbody">' ;
    prop += '<div class="entrylabel c_entrytitle_text w50">id</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ thisProp.id + '" ';
    prop += utils.buildFnString('window.author.updatePath', [id,'id'], true);
    prop += '><br>';
    prop += '<div class="entrylabel c_entrytitle_text w50">url</div>';
    prop += '<input class="auth_text w200" type="text" ';
    prop += 'value="'+ thisProp.url + '" ';
    prop += utils.buildFnString('window.author.updatePath', [id,'url'], true);
    prop += '><br>';
    propUI.innerHTML = prop + '</div>';
  }

  this.getProps = getProps;
  function getProps(type, id){
    thisProp = authorData[type].filter(function(selected){return selected.id === id;})[0];
    if (thisProp === undefined) return;
    var titleText = '<div class="proptitle">';
    if (type === "objects") titleText =  'Object: ' + id + ' : ' + thisProp.type;
    if (type === "images") titleText = 'Image: ' + id;
    if (type === "anims") titleText = 'Animation: ' + id;

    document.getElementById("propertiestitle").innerHTML = titleText + '</div>';

    var propUI = document.getElementById("properties");

    if (type === 'anims')   prop = buildProp.anim(thisProp);
    if (type === 'objects') prop = buildProp.object(thisProp);
    if (type === 'images')  prop = buildProp.image(thisProp);
    if (type === 'shapes')  prop = buildProp.shape(thisProp);
    propUI.innerHTML = prop;
    updateSelectionWindow(type,id);
  }

  function updateSelectionWindow(type,id){
    var table = document.getElementById(type + "table");
    for (var i = 0, row; row = table.rows[i]; i++) {row.removeAttribute("style")};
    var rowIndex = document.getElementById(id);
    if (rowIndex === null) return;
    rowIndex = rowIndex.rowIndex;
    table.rows[rowIndex].style = "background-color:rgb(97, 255, 55);";
  }

  this.delete = function(type){
    var table = document.getElementById(type + "table");
    var delRow = undefined;
    for (var i = 0, row; row = table.rows[i]; i++) {
      if (row.style[0] === "background-color") delRow = row.id;
  };

  authorData[type].forEach(function(test, idx){
    if (test.id === delRow){ authorData[type].splice(idx,1); }
    if (type === 'shapes') menus.updateShapes();
    if (type === 'objects') menus.updateObjects();
    if (type === 'images') menus.updateImages();
    if (type === 'paths') updatePaths();
  });
  initCanvasser("sample", JSON.stringify(authorData), "string");
}

  this.adddrawcode = function(id){
    var shape = authorData.shapes.filter(function(shape){ return shape.id === id;})[0];
    shape.drawcode.push({type:'fill'});
    getProps('shapes', id);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.moveprop = function(type,id,path,moveto){
    var obj = authorData[type].filter(function(test){return test.id === id})[0];
    var arr = path.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj.splice(moveto, 0, obj.splice(arr[0], 1)[0]);
    getProps(type, id);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.deleteprop = function(type,id,path){
    var obj = authorData[type].filter(function(test){return test.id === id})[0];
    var arr = path.split(".");
    while(arr.length > 1){
      if (obj[arr[0]] === undefined) obj[arr[0]] = {};
      obj = obj[arr.shift()];
    }
    obj.splice(arr[0],1);
    getProps(type, id);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  function handleColor(object, type, widget, path){
    var str = '';
    var pos = {x:utils.getSubProp(object, path+'.x'), y:utils.getSubProp(object, path+'.y')};

    str += utils.buildDiv('entrylabel c_entrylabel_pos w100', widget.field );
    str += '<span>';
    str += '<span class="entrytitle c_entrylabel_pos">X</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.x + '" ';
    str += utils.buildFnString('window.author.updateItem', [object.id, type, path+'.x'], true);
    str +=   '>';
    str += '<span class="entrytitle c_entrylabel_pos">Y</span>'
    str += '<input class="auth_xy" type="number" value="'+ pos.y + '" ';
    str += utils.buildFnString('window.author.updateItem', [object.id, type, path+'.y'], true);
    str +=   '>'  + "</span><br>";
    return str;
  }

  function outText(label, value, cmd){
    '<div class="entrylabel c_entrytitle_text w100">' + label + '</div><input class="auth_text" type="text" value="'+ value +'"><br>';
    return output;
  }

  this.createPosXY = function(objectId, paramPath){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    this.createItem("0", objectId, 'position.'+paramPath+'.x');
    this.createItem("0", objectId, 'position.'+paramPath+'.y');
    getProps("objects",objGet.id);
  };

  this.createScale = function(objectId, paramPath){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    this.createItem("1", objectId, 'scale.'+paramPath);
    getProps("objects",objGet.id);
  };

  this.createItem = function(newVal, objectId, paramPath){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    utils.setSubProp(objGet, paramPath, newVal);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  };

  this.updateItem = function(domElement, objectId, type, paramPath){
    var newVal = domElement.value.toString();
    if (domElement.type === 'checkbox') newVal = domElement.checked;
    if (newVal === '---NONE---') newVal = undefined;

    var objGet = authorData[type+'s'].filter(function(finder){return (finder.id === objectId);})[0];
    if (type === 'shape') objGet = authorData.shapes.filter(function(finder){return (finder.id === objectId);})[0];
    if (type === 'image') objGet = authorData.images.filter(function(finder){return (finder.id === objectId);})[0];
    if (type === 'path') objGet  = authorData.paths.filter(function(finder){return (finder.id === objectId);})[0];

    utils.setSubProp(objGet, paramPath, newVal);
    getProps(type+'s', objGet.id);
    if (type === 'object') menus.updateObjects();
    if (type === 'shape') menus.updateShapes();
    initCanvasser("sample", JSON.stringify(authorData), "string");
  };

  this.updateSelect = function(domElement, objectId, positionId, axisId){
    var objGet = authorData[type].filter(function(finder){return (finder.id === id);})[0];

    var newRule = window.rules.actions.filter(function(ruleName){
      return ruleName.elementType === domElement.value}
    )[0];
    if (listIndex === "none"){
      objGet[prop] = domElement.value;
    } else {
      objGet[prop][listIndex] = {type:domElement.value};
      newRule.widgets.forEach(function(rule){
        var keys = Object.keys(rule);
        keys.forEach(function(key){
          objGet[prop][listIndex][key] = rule[key];
        });
      });
    }
    if (type === 'objects') menus.updateObjects();
    if (type === 'images') menus.updateImages();
    getProps(type, id);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.updateActionList = function(domElement, objectId, type, paramPath){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objectId);})[0];
    var prop = utils.getSubProp(objGet, paramPath);
    this.updateItem(domElement, objectId, 'object', paramPath);
    var newRule = window.rules.actions.filter(function(ruleName){
      return ruleName.elementType === domElement.value}
    )[0];

    menus.updateObjects();
    getProps('objects', objectId);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.updateSetting = function(domElement, setting){
    authorData.settings[setting] = domElement.value;
    menus.updateSettings();
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.updatePath = function(domElement, id, param){
    var pathGet = authorData.paths.filter(function(finder){return (finder.id === id);})[0];
    pathGet[param] = domElement.value;
    updatePaths();
    getPath(pathGet.id);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.updateActivity = function(domElement, type, elementType, id, prop, listIndex){
    var objGet = authorData[type].filter(function(finder){return (finder.id === id);})[0];

    var newRule = window.rules.actions.filter(function(ruleName){
      return ruleName.elementType === domElement.value
    })[0];
    if (listIndex === "none"){
      objGet[prop] = domElement.value;
    } else {
      objGet[prop][listIndex] = {type:domElement.value};
      newRule.widgets.forEach(function(rule){
        var keys = Object.keys(rule);
        keys.forEach(function(key){
          objGet[prop][listIndex][key] = rule[key];
        });
      });
    }
    if (type === 'objects') menus.updateObjects();
    if (type === 'images') menus.updateImages();
    if (type === 'anims') menus.updateAnims();
    getProps(type, id);
    initCanvasser("sample", JSON.stringify(authorData), "string");
  }

  this.addaction = function(objName, listType){
    var objGet = authorData.objects.filter(function(finder){return (finder.id === objName);});
    if (objGet.length === 0) return;
    if( objGet[0][listType] === undefined)  objGet[0][listType] = [];
    objGet[0][listType].push({"type":"cleardown"});
    getProps("objects",objGet[0].id);
  }



  function printRecusiveObj(output, element, indent){
    var indnt = "<br>";
    for (var i = 0; i < indent; i++){
      indnt +="&nbsp;&nbsp;&nbsp;"
    }

    if (get_type(element) === "[object Object]"){
      for(var prop in element){
        output += printRecusiveObj(indnt + prop, element[prop], indent+1);
      }
      return output;
    }

    if (get_type(element) === "[object Array]"){
      element.forEach(function(arrayElement){
        output += printRecusiveObj(indnt, arrayElement, indent+1);
      });
      return output;
    }
    output += " " + element;
    return output;
  }

  function get_type(thing){
    if(thing===null)return "[object Null]"; // special case
    return Object.prototype.toString.call(thing);
  }

  function init(data){
    act.canvas        = document.createElement('canvas');
    act.context       = act.canvas.getContext('2d');
    act.canvas.width  = data.settings.canvaswidth;
    act.canvas.height = data.settings.canvasheight;
    act.data          = data;
    document.getElementById(data.settings.canvasparent).appendChild(act.canvas);
    act.canvas.addEventListener('mousemove', getMousePos, false);
    act.canvas.addEventListener('click', getClickPos, false);

    act.data.images.forEach(function(image){
      var imageObj    = new Image();
      imageObj.onload = function() { act.imageList[image.id] = this; };
      imageObj.src = image.url;
    });
  }
}