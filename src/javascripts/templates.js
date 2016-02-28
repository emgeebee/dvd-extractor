var Templates = {}; 

Templates.extract = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),undefined = locals_.undefined,extract = locals_.extract,i = locals_.i;jade_mixins["field"] = function(name, attr, type, val){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\">");
if ( type == "checkbox")
{
buf.push("<div class=\"col-sm-offset-3 col-sm-7\"><div class=\"checkbox\"><label><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("checked", (val==1?"checked":undefined), true, false)) + " class=\"checkbox\"/>" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label></div></div>");
}
else
{
buf.push("<label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label><div class=\"col-sm-7\"><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + " class=\"form-control\"/></div>");
}
buf.push("</div>");
};
jade_mixins["boolfield"] = function(name, attr, on, val, classname){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\"><label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "\t</label><div class=\"col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\"><input type=\"checkbox\"" + (jade.attr("checked", (on==1?"checked":undefined), true, false)) + " class=\"checkbox\"/></span><input type=\"text\"" + (jade.attr("data-attribute", '' + (attr) + '', true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + (jade.cls(['form-control',(typeof classname=="undefined"?undefined:classname)], [null,true])) + "/></div></div></div>");
};
buf.push("<div data-item=\"1\" data-object=\"1\"" + (jade.cls(['extract','form-horizontal','' + (extract.status) + ''], [null,null,true])) + "><h5 class=\"extract-title\">Extract " + (jade.escape((jade.interp = i) == null ? '' : jade.interp)) + "</h5>");
if ( extract.logs)
{
buf.push("<div class=\"extract-history\">");
// iterate extract.logs
;(function(){
  var $$obj = extract.logs;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var log = $$obj[$index];

buf.push("<p>" + (jade.escape((jade.interp = log.complete) == null ? '' : jade.interp)) + " - " + (jade.escape((jade.interp = log.log) == null ? '' : jade.interp)) + "</p>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var log = $$obj[$index];

buf.push("<p>" + (jade.escape((jade.interp = log.complete) == null ? '' : jade.interp)) + " - " + (jade.escape((jade.interp = log.log) == null ? '' : jade.interp)) + "</p>");
    }

  }
}).call(this);

buf.push("</div>");
}
jade_mixins["field"]('Extract title', '__fullname', 'text', extract.__fullname);
jade_mixins["field"]('Force override?', 'override', 'checkbox', extract.override);
buf.push("<div class=\"hidden\">");
jade_mixins["field"]('completeFlag', 'completeFlag', 'hidden', extract.completeFlag);
buf.push("</div>");
jade_mixins["field"]('Use ffmpeg?', 'type', 'checkbox', extract.type);
jade_mixins["boolfield"]('Use TV showname?', '__show', extract.tvFile, extract.__show, "show-field");
jade_mixins["boolfield"]('Use Folder name?', '__foldername', extract.isFolderDiff, extract.__foldername, "");
buf.push("<table class=\"options table table-striped\"><tbody data-attribute=\"options\" data-object=\"1\">");
if ( extract.options)
{
buf.push("<tr><th class=\"key\">Key</th><th class=\"val\">Value</th></tr>");
// iterate extract.options
;(function(){
  var $$obj = extract.options;
  if ('number' == typeof $$obj.length) {

    for (var key = 0, $$l = $$obj.length; key < $$l; key++) {
      var option = $$obj[key];

jade_mixins["field"] = function(name, attr, type, val){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\">");
if ( type == "checkbox")
{
buf.push("<div class=\"col-sm-offset-3 col-sm-7\"><div class=\"checkbox\"><label><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("checked", (val==1?"checked":undefined), true, false)) + " class=\"checkbox\"/>" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label></div></div>");
}
else
{
buf.push("<label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label><div class=\"col-sm-7\"><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + " class=\"form-control\"/></div>");
}
buf.push("</div>");
};
jade_mixins["boolfield"] = function(name, attr, on, val, classname){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\"><label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "\t</label><div class=\"col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\"><input type=\"checkbox\"" + (jade.attr("checked", (on==1?"checked":undefined), true, false)) + " class=\"checkbox\"/></span><input type=\"text\"" + (jade.attr("data-attribute", '' + (attr) + '', true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + (jade.cls(['form-control',(typeof classname=="undefined"?undefined:classname)], [null,true])) + "/></div></div></div>");
};
buf.push("<tr class=\"optionfield\"><td data-change-function=\"setKeyAttribute\">");
jade_mixins["field"]('Option name', "", 'text', key);
buf.push("</td><td>");
jade_mixins["field"]('Option value', key, 'text', option);
buf.push("</td><td><button data-click-function=\"removeProperty\" class=\"btn-xs btn btn-danger\"><p class=\"image-btn remove-key-value glyphicon glyphicon-remove\"></p></button></td></tr>");
    }

  } else {
    var $$l = 0;
    for (var key in $$obj) {
      $$l++;      var option = $$obj[key];

jade_mixins["field"] = function(name, attr, type, val){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\">");
if ( type == "checkbox")
{
buf.push("<div class=\"col-sm-offset-3 col-sm-7\"><div class=\"checkbox\"><label><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("checked", (val==1?"checked":undefined), true, false)) + " class=\"checkbox\"/>" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label></div></div>");
}
else
{
buf.push("<label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label><div class=\"col-sm-7\"><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + " class=\"form-control\"/></div>");
}
buf.push("</div>");
};
jade_mixins["boolfield"] = function(name, attr, on, val, classname){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\"><label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "\t</label><div class=\"col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\"><input type=\"checkbox\"" + (jade.attr("checked", (on==1?"checked":undefined), true, false)) + " class=\"checkbox\"/></span><input type=\"text\"" + (jade.attr("data-attribute", '' + (attr) + '', true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + (jade.cls(['form-control',(typeof classname=="undefined"?undefined:classname)], [null,true])) + "/></div></div></div>");
};
buf.push("<tr class=\"optionfield\"><td data-change-function=\"setKeyAttribute\">");
jade_mixins["field"]('Option name', "", 'text', key);
buf.push("</td><td>");
jade_mixins["field"]('Option value', key, 'text', option);
buf.push("</td><td><button data-click-function=\"removeProperty\" class=\"btn-xs btn btn-danger\"><p class=\"image-btn remove-key-value glyphicon glyphicon-remove\"></p></button></td></tr>");
    }

  }
}).call(this);

}
buf.push("</tbody></table><div class=\"form-group\"><div class=\"col-sm-12 btn-toolbar\"><div class=\"btn-group\"><button data-click-function=\"addProperty\" class=\"btn btn-xs btn-info\"><span class=\"image-btn glyphicon glyphicon-plus add-property\"></span><span>Add another property</span></button></div><div class=\"btn-group\"><button data-click-function=\"removeExtract\" class=\"btn btn-xs btn-danger\"><span class=\"image-btn glyphicon glyphicon-remove add-property\"></span><span>Remove this extract</span></button></div><div class=\"btn-group fail-button\"><button data-click-function=\"removeFail\" class=\"btn btn-xs btn-danger\"><span class=\"image-btn glyphicon glyphicon-remove add-property\"></span><span>Delete this failure</span></button></div></div></div></div>");
i++
buf.push("<hr/>");;return buf.join("");
}; 

Templates.menu = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),undefined = locals_.undefined,controllers = locals_.controllers,saveButton = locals_.saveButton;jade_mixins["field"] = function(name, attr, type, val){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\">");
if ( type == "checkbox")
{
buf.push("<div class=\"col-sm-offset-3 col-sm-7\"><div class=\"checkbox\"><label><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("checked", (val==1?"checked":undefined), true, false)) + " class=\"checkbox\"/>" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label></div></div>");
}
else
{
buf.push("<label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label><div class=\"col-sm-7\"><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + " class=\"form-control\"/></div>");
}
buf.push("</div>");
};
jade_mixins["boolfield"] = function(name, attr, on, val, classname){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\"><label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "\t</label><div class=\"col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\"><input type=\"checkbox\"" + (jade.attr("checked", (on==1?"checked":undefined), true, false)) + " class=\"checkbox\"/></span><input type=\"text\"" + (jade.attr("data-attribute", '' + (attr) + '', true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + (jade.cls(['form-control',(typeof classname=="undefined"?undefined:classname)], [null,true])) + "/></div></div></div>");
};
buf.push("<nav role=\"navigation\" class=\"navbar navbar-default\"><div class=\"collapse navbar-collapse\"><ul class=\"nav navbar-nav\"><li><a href=\"/logs\">View Recent</a></li><li><a href=\"/duplicates\">View duplicates</a></li><li><a data-toggle=\"dropdown\" class=\"dropdown\">Controllers<ul class=\"dropdown-menu\"><li><a href=\"/controller/New\">New</a></li>");
// iterate controllers
;(function(){
  var $$obj = controllers;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var val = $$obj[$index];

buf.push("<li><a href=\"/controller/" + (jade.escape((jade.interp = val) == null ? '' : jade.interp)) + "\">" + (jade.escape((jade.interp = val) == null ? '' : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var val = $$obj[$index];

buf.push("<li><a href=\"/controller/" + (jade.escape((jade.interp = val) == null ? '' : jade.interp)) + "\">" + (jade.escape((jade.interp = val) == null ? '' : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></a></li></ul>");
if ( saveButton)
{
buf.push("<div class=\"navbar-form\"><div data-click-function=\"saveChanges\" class=\"navbar-left\"> <button type=\"submit\" class=\"btn btn-default\">Save</button></div><div data-click-function=\"generateQueue\" class=\"navbar-left\"> <button type=\"submit\" class=\"btn btn-default\">Generate</button></div><div data-click-function=\"refreshList\" class=\"navbar-left\"> <button type=\"submit\" class=\"btn btn-default\">Refresh</button></div></div><div class=\"navbar-right\"><h5 class=\"hidden status glyphicon glyphicon-saved\"></h5></div>");
}
buf.push("</div></nav>");;return buf.join("");
}; 

Templates.optionfield = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),undefined = locals_.undefined,key = locals_.key,option = locals_.option;jade_mixins["field"] = function(name, attr, type, val){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\">");
if ( type == "checkbox")
{
buf.push("<div class=\"col-sm-offset-3 col-sm-7\"><div class=\"checkbox\"><label><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("checked", (val==1?"checked":undefined), true, false)) + " class=\"checkbox\"/>" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label></div></div>");
}
else
{
buf.push("<label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</label><div class=\"col-sm-7\"><input" + (jade.attr("type", '' + (type) + '', true, false)) + (jade.attr("data-attribute", (attr?'' + (attr) + '':undefined), true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + " class=\"form-control\"/></div>");
}
buf.push("</div>");
};
jade_mixins["boolfield"] = function(name, attr, on, val, classname){
var block = (this && this.block), attributes = (this && this.attributes) || {};
buf.push("<div class=\"fieldwrapper form-group\"><label class=\"control-label col-sm-3\">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "\t</label><div class=\"col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\"><input type=\"checkbox\"" + (jade.attr("checked", (on==1?"checked":undefined), true, false)) + " class=\"checkbox\"/></span><input type=\"text\"" + (jade.attr("data-attribute", '' + (attr) + '', true, false)) + (jade.attr("value", (val?'' + (val) + '':''), true, false)) + (jade.cls(['form-control',(typeof classname=="undefined"?undefined:classname)], [null,true])) + "/></div></div></div>");
};
buf.push("<tr class=\"optionfield\"><td data-change-function=\"setKeyAttribute\">");
jade_mixins["field"]('Option name', "", 'text', key);
buf.push("</td><td>");
jade_mixins["field"]('Option value', key, 'text', option);
buf.push("</td><td><button data-click-function=\"removeProperty\" class=\"btn-xs btn btn-danger\"><p class=\"image-btn remove-key-value glyphicon glyphicon-remove\"></p></button></td></tr>");;return buf.join("");
}; 

