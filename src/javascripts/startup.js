var isChanged = 0;

var isNearestAttributes = function(parent, child){
	return $(child).closest('[data-object=1]').get(0) == $(parent).get(0);
};

var isNearestArray = function(parent, child){
	return $(child).closest('[data-array=1]').get(0) == $(parent).get(0);
};

var getArrayItems = function(parent){
	var array = []
	var items = $(parent).find("[data-item]").filter(
		function(){
			return isNearestArray(parent, $(this))
		}
	)
	for (var i = items.length - 1; i >= 0; i--) {
		array.push(getAttributes.call({}, items[i]));
	};
	return array;
}

var getAttributes = function(parent){
	var atts = $(parent).find("input[data-attribute]").filter(
		function(){
			return isNearestAttributes(parent, $(this))
		}
	)
	for (var i = atts.length - 1; i >= 0; i--) {
		if($(atts[i]).is(':checkbox')){
			if($(atts[i]).is(':checked')){
				this[$(atts[i]).attr('data-attribute')] = 1;
			} else {
				this[$(atts[i]).attr('data-attribute')] = 0;
			}
		} else if($(atts[i]).is(':radio')){
			if($(atts[i]).is(':checked')){
				this[$(atts[i]).attr('data-attribute')] = $(atts[i]).val();
			}
		} else {
			if($(atts[i]).val() != "undefined"){
				this[$(atts[i]).attr('data-attribute')] = $(atts[i]).val();
			}
		}
	};

	var kidObjects = $(parent).find("[data-object]").filter(
		function(){
			return isNearestAttributes(parent, $(this).parent())
		}
	)
	for (var i = kidObjects.length - 1; i >= 0; i--) {
		var elemname = $(kidObjects[i]).attr('data-attribute');
		if(elemname != "undefined"){
			this[elemname] = {};
			this[elemname] = getAttributes.call(this[elemname], kidObjects[i]);
		}
	};

	var arrayItems = $(parent).find("[data-array]").filter(
		function(){
			return isNearestAttributes(parent, $(this).parent())
		}
	)
	for (var i = arrayItems.length - 1; i >= 0; i--) {
		this[$(arrayItems[i]).attr('data-attribute')] = getArrayItems(arrayItems[i]);
	};
	return this;
}

var setKeyAttribute = function(parent){
	var attKey = $(parent).val();
	$(parent).parents('td').next().find('input').attr('data-attribute', attKey);
}

var changeEventHandler = function(e){
	var caseval = $(e.target).closest('[data-change-function]').attr('data-change-function');
	switch(caseval){
		case 'setKeyAttribute':
			setKeyAttribute(e.target);
			break;
		default:
			console.log(e);
			console.log(e.target);
			break;
	}
	isChanged = 1;
}

var clickEventHandler = function(e){
	var caseval = $(e.target).closest('[data-click-function]').attr('data-click-function');
	switch(caseval){
		case 'saveChanges':
			saveChanges();
			break;
		case 'generateQueue':
			generateQueue();
			break;
		case 'filterDVDs':
			filterDVDs(e.target);
			break;
		case 'refreshList':
			refreshList();
			break;
		case 'addProperty':
			addProperty(e.target);
			break;
		case 'removeProperty':
			removeProperty(e.target);
			break;
		case 'addExtract':
			addExtract(e.target);
			break;
		case 'removeExtract':
			removeExtract(e.target);
			break;
		case 'removeFail':
			removeFail(e.target);
			break;
		case 'autofill':
			autofill(e.target);
			break;
		default:
			console.log(e);
			console.log($(e.target).parents('[data-click-function]').attr('data-click-function'));
			break;
	}
}

var autofill = function(target){
	if($(target).hasClass('up')){
		var direction = 1;
	} else if ($(target).hasClass('down')){
		var direction = -1;
	}
	var start = parseInt($(target).closest('.filler').find('input').val());
	$(target).closest('.panel-body').find('.extract').each(function(i){
		if($(this).find('[data-attribute="title"]').length < 1){
			$(this).find('tbody').append(
				Templates.optionfield(
					{'property':{'status':0}, 'key':'title'}
				)
			)
		} else {
			$(this).find('[data-attribute="title"]').each(function(){
				console.log('adding' + start+(i*direction));
				if(isNaN(start)){
				} else {
					$(this).val(start+(i*direction))
				}
			})
		}
	})
}

var addExtract = function(target){
	$(target).closest('.extracts-container').append(
		Templates.extract(
			{'extract':{'status':0}}
		)
	)
}

var addProperty = function(target){
	$(target).closest('.extract').find('tbody').append(
		Templates.optionfield(
			{'property':{'status':0}}
		)
	)
}

var removeProperty = function(target){
	$(target).closest('tr').remove();
}

var removeExtract = function(target){
	$(target).closest('.extract').remove();
}

var filterDVDs = function(item){
	$('.panel').hide();
	if(!$(item).hasClass('special')){
		$($(item).attr('data-target')).show();
	} else {
		$('.panel').filter(function(){
			if($(this).find('input[value="no-dvdnav"]').length>0){
				return true
			}
		}).show();
	}
}

var checkBeforeLeaving = function(){
	if(isChanged){
		saveChanges();
		var message = "You should save first...",
	 	e = e || window.event;
	 	// For IE and Firefox
	 	if (e) {
	    	e.returnValue = message;
	 	}

		// For Safari
		return message;
	}
}

var getStats = function(){
	$('.stats').find('a').each(function(){
		$(this).find('.sum').text($($(this).attr('data-target')).length);
	})
	$('.nonav').text($('.extract').filter(function(){
		if($(this).find('input[value="no-dvdnav"]').length>0){
			return true
		}
	}).length);
}

var refreshList = function(){
	if(isChanged){
		alert('This hasn\'t been saved yet');
	} else {
		$.post(getURL()+'/refresh', saveSuccess);
	}
}

var refreshListSuccess = function(){
	window.location.reload();
	location.reload();
}

var saveChanges = function(){
	var masterjson = getAttributes.call({}, $('body'));
	$.post(getURL()+'/save', masterjson, saveSuccess);
}

var saveSuccess = function(){
	isChanged = 0;
	if(window.location.href.search('/New') > 0){
		window.location.href = getURL();
		return
	}
	$('.status').removeClass('hidden');
	$('.status').show();
	$('.status').fadeOut(2000);
}

var removeFail = function(target){
	var output = $(target).closest('.extract').find('[data-attribute="__fullname"]').val();
	var areYouSure = confirm('Are you sure?');
	if(areYouSure){
		$.post(getURL()+'/delete', {"output":output}, removeFailSuccess);
	}
}

var removeFailSuccess = function(){
	alert('This has been completed');
}

var getURL = function(){
	var base = window.location.href
	base = base.slice(0, (base.search('/controller/') + 12))
	base += $('[data-attribute="title"]').val();
	return base
}

var generateQueue = function(){
	var masterjson = getAttributes.call({}, $('body'));
	$.post(getURL()+'/generate', masterjson, saveSuccess);
}

$(window).bind('beforeunload', function(){
	checkBeforeLeaving();
})

function sortAlpha(a,b){  
    return $(a).find('p').text().toLowerCase() > $(b).find('p').text().toLowerCase() ? 1 : -1;  
};

function setAllOverridesToZero(){
	$('[data-attribute="override"]').attr('checked', false);
}

$( document ).ready(function() {
	$('body').bind('change', changeEventHandler);
	$('body').bind('click', clickEventHandler);
	getStats();
	setAllOverridesToZero()
	$('#titles .panel-group').sort(sortAlpha).appendTo('#titles');  
})