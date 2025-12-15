'use strict';

(function (){
	if(!window.jqueryDirectFunctions) window.jqueryDirectFunctions = {};

	var clickAttr = function clickAttr(_caller, attr, fnObj){
		this.find('['+attr+']').click(function (){
			var attrName = this.getAttribute(attr);
			if(attrName in fnObj){
				fnObj[attrName].call(_caller,this);
			}
		});
		return this;
	};
	jqueryDirectFunctions["clickAttr"] = clickAttr;
})();

jQuery.fn.extend(jqueryDirectFunctions);