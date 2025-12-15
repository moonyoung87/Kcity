/**
 *
 */
function ItgJs(){

}
	/**
	 * Form 필드 사용 가능 확인
	 * @param fld form의 필드 document.form1.id
	 * @return {Boolean} true | false
	 */
	ItgJs.fn_isUsable = function(fld){
		if(typeof(fld) == "undefined"){
			alert("Error : " + fld + " 필드가 undefined 입니다");
			return false;
		}
		return true;
	};

	/**
	 * 배열에 해당값이 존재하는지 검사
	 * @param 배열 arr, 검사값 val
	 * @return {Boolean} true | false
	 */
	ItgJs.fn_isInArray = function(arr, val){
		var returnVal=false;
		$.each(arr, function (index, value) {
			if (value == val) {
				returnVal = true;
				return false;//반복문을 빠져나가기 위함
			}
		});
		return returnVal;
	};
	/**
	 * 배열에 해당값이 존재하는지 검사
	 * @param 배열 arr, 검사값 val
	 * @return {Boolean} true | false
	 */
	ItgJs.fn_isInArrayChk = function(arr, val){
		var returnVal=false;
		$.each(arr.split(","), function (index, value) {
			if (value == val) {
				returnVal = true;
				return false;//반복문을 빠져나가기 위함
			}
		});
		return returnVal;
	};
	/**
	 * form text 필드 값 체크, 빈공간도 허용안함
	 * @param fld 체크 할 필드 document.name
	 * @param strErrMessage 오류시 안내 문구
	 * @returns {Boolean} true | false
	 */
	ItgJs.fn_chkValue = function(fld, strErrMessage){
		if(!ItgJs.fn_isUsable(fld)) return false;

		var tmpStr = fld.value.replace(/\s/g,'');
		if(tmpStr == ''){
			alert(strErrMessage);
			fld.focus();
			return false;
		}
		return true;
	}

	/**
	 * form radio 버튼 체크 여부
	 * @param fld 체크 할 필드 document.name
	 * @param strErrMessage 오류시 안내 문구
	 * @returns {Boolean} true | false
	 */
	ItgJs.fn_chkRadio = function(fld, strErrMessage){
		if(!ItgJs.fn_isUsable(fld)) return false;
		var isChecked = false;
		for(var i = 0; i < fld.length; i++){
			if(fld[i].checked == true){
				isChecked = true;
				break;
			}
		}
		if(isChecked == false){
			alert(strErrMessage);
			fld[0].focus();
			return false;
		}else{
			return true;
		}
		return false;
	}

	/**
	 * checkbox 체크여부 확인 설정한 최소 갯수 체크, 최대 갯수를 선택했는지 검사 0이면 갯수 체크 안함
	 * @param fld 체크할 필드 document.name
	 * @param strErrMessage 오류시 안내 문구
	 * @param minCheckCount 최소 체크 숫자 1이상
	 * @param maxCheckCount 최대 체크 숫자
	 * @returns {Boolean} true | false
	 */
	ItgJs.fn_chkCheckbox = function(fld, strErrMessage, minCheckCount, maxCheckCount){
		if(!ItgJs.fn_isUsable(fld)) return false;
		var checkCount = 0;
		for(var i = 0; i < fld.length; i++){
			if(fld[i].checked == true){
				checkCount++;
			}
		}
		if(checkCount == 0 || checkCount < minCheckCount){
			alert(strErrMessage);
			fld[0].focus();
			return false;
		}
		if(checkCount > maxCheckCount && maxCheckCount != 0){
			alert(strErrMessage);
			fld[0].focus();
			return false;
		}
		return true;
	}

	/**
	 * form text 필드의 값이 이메일 형식인지 확인
	 * @param fldEmail 체크할 필드 document.name
	 * @param strErrorMessage 오류시 안내 문구
	 * @returns {Boolean} true | false
	 */
	ItgJs.fn_chkEmail = function(fldEmail, strErrorMessage){
		var strExp = /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/;
		if(!strExp.test(fldEmail.value)){
			if (strErrorMessage != null) {
				alert(strErrorMessage);
			}
			fldEmail.focus();
			return false;
		}
		return true;
	}

	/**
	 * 금액관련 가능한지 검사
	 * @param val 체크할 값
	 * @returns {Boolean} true|false
	 */
	ItgJs.fn_isCurrency = function(val){
		var reg = /[^0-9+-,.]/;
		return !reg.test(val)
	}
	/**
	 * 엔터키를 쳤는지 확인
	 * onkeydown="if(ItgJs.fn_isEnter(event))form.submit();"
	 * @param evt
	 * @returns {Boolean}
	 */
	ItgJs.fn_isEnter = function(evt){
		evt = evt || window.event;
		var code = evt.keyCode || evt.which;
		if(code == 13) return true;
		else return false;
	}
	/**
	 * form text 필드의 값이 숫자인지 확인
	 * @param strErrorMessage 오류시 안내 문구
	 * @returns {Boolean} true | false
	 */
	ItgJs.fn_numberOnly = function(evt){
		evt = evt || window.event;
		var code = evt.keyCode || evt.which;

		if ((code > 34 && code < 41) || (code > 47 && code < 58) || (code > 95 && code < 106) || code == 8 || code == 9 || code == 13 || code == 46
				|| (evt.ctrlKey && (code == 67 || code == 86)) /* ctrl + c, ctrl + v*/) {
			return true;
		}
		if (evt.returnValue) {
			alert("숫자만 입력가능 합니다.");
					evt.returnValue = false;
					evt.stopPropagation();
					evt.preventDefault();
					return false;
			} else {
				alert("숫자만 입력가능 합니다.");
				evt.stopPropagation();
					evt.preventDefault();
				return false;
			}
	}


	/**
	 * form text 필드의 값이 영문+숫자인지 확인
	 * @param obj 필드 객체
	 * @returns {Boolean} true | false
	 */
	ItgJs.fn_engNumberOnly = function(obj){
		var ptrn1 = /^[^a-zA-Z]/; //false가 정상
		var ptrn2 = /[^a-zA-Z0-9_]/; //false가 정상 +
		var str = $(obj).val();
		if(str == ""){
			$(obj).focus();
			return false;
		}
		if(ptrn1.test(str)){
			alert($(obj).attr("title")+"은(는) 영문(대소문)자로 시작해야 합니다.");
			$(obj).focus();
			return false;
		}
		if(ptrn2.test(str)){
			alert($(obj).attr("title")+"은(는) 영문(대소문자), 숫자, _ 만 입력 할 수 있습니다.");
			$(obj).focus();
			return false;
		}
		return true;
	}



	/**
	 * 전화번호 가능한지 검사
	 * @param val 체크할 값
	 * @returns {Boolean} true|false
	 */
	ItgJs.fn_phone = function(evt){
		evt = evt || window.event;
		var code = evt.keyCode || evt.which;
		if ((code > 34 && code < 41) || (code > 47 && code < 58) || (code > 95 && code < 106) || code == 8 || code == 9 || code == 13 || code == 46 || code == 189 || code == 109
			|| (evt.ctrlKey && (code == 67 || code == 86)) /* ctrl + c, ctrl + v*/
		) {
			return true;
		}
		if (evt.returnValue) {
					alert("숫자와 - 만 입력가능 합니다."/*+ code*/);
					evt.returnValue = false;
					evt.stopPropagation();
					evt.preventDefault();
					return false;
			} else {
				alert("숫자와 - 만 입력가능 합니다."/* +code*/);
				evt.stopPropagation();
					evt.preventDefault();
				return false;
			}
	}

	/**
	 * form text 숫자필드의 값에 ',' 추가
	 */
	ItgJs.fn_commify = function(n) {//천단위 ","
			var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
			n += '';                          // 숫자를 문자열로 변환
			while (reg.test(n))
					n = n.replace(reg, '$1' + ',' + '$2');
			return n;
	}

	/** 쿠키 저장, 쿠키값 가져오기 함수 */
	ItgJs.fn_setCookie = function( name, value, expiredays )
	{
			var todayDate = new Date();
			todayDate.setDate( todayDate.getDate() + expiredays );
			if(expiredays > 0){
				document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";";
			}else{
				document.cookie = name + "=" + escape( value ) + "; path=/;";
			}
	}

	ItgJs.fn_getCookie = function( name )
	{
			var nameOfCookie = name + "=";
			var x = 0;
			while ( x <= document.cookie.length )
			{
					var y = (x+nameOfCookie.length);
					if ( document.cookie.substring( x, y ) == nameOfCookie )
					{
							if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 ) endOfCookie = document.cookie.length;
									return unescape( document.cookie.substring( y, endOfCookie ) );
					}
					x = document.cookie.indexOf( " ", x ) + 1;
					if ( x == 0 ) break;
			}
			return "";
	}


	/** SNS 글 등록 */
	ItgJs.fn_pstTwitter = function(msg,url) {
			var href = "http://twitter.com/home?status=" + encodeURIComponent(msg) + " " + encodeURIComponent(url);
			var a = window.open(href, 'twitter', '');
			if ( a ) {
			 a.focus();
			}
		 }
	ItgJs.fn_pstFaceBook = function(msg,url) {
			var href = "http://www.facebook.com/sharer.php?u=" + url + "&t=" + encodeURIComponent(msg);
			var a = window.open(href, 'facebook', '');
			if ( a ) {
			 a.focus();
			}
		 }

	/**
	 * 최대 글자수 체크
	 * @param chkobj - 글자수를 체크할 element객체
	 * @param maxlength - 최대입력가능수
	 * @param txtId - 현재입력된 Byte수를 표시할 element ID
	 * @param htype - 한글에 대한 바이트처리 2or3
	 */
	ItgJs.fn_checkLength = function(chkobj, maxlength, txtId, htype) {
		var str = chkobj.value;
		var str_byte = 0;
		if(htype == null){
			htype = 2;
		}
		str_byte = ItgJs.getByteLength(str,htype);

		if(str_byte > maxlength) {
			alert(maxlength + "자 이내로 작성해주세요.");
			area_name.value = str.substr(0, maxlength);

			$("#"+txtId).text(maxlength);
		}else {
			$("#"+txtId).text(str_byte);
		}
	}

	/**
	 * Byte계산
	 * @param s - 체크문자열
	 * @param t - 한글바이트계산2 or 3
	 */
	ItgJs.getByteLength= function(s,t,b,i,c){
		for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?t:c>>7?2:1);
		return b;
	}

	ItgJs.fn_bisCheck = function(bisnum){
		var pattern = /([0-9]{3})-?([0-9]{2})-?([0-9]{5})/;

		var num = bisnum;
		if (!pattern.test(num)){
			//alert("올바른 사업자 번호가 아닙니다.");
			return false;
		}

		bisnum = bisnum.replace(/-/gi,"");
		var sum = 0;
		sum += parseInt(bisnum.substring(0,1));
		sum += parseInt(bisnum.substring(1,2)) * 3 % 10;
		sum += parseInt(bisnum.substring(2,3)) * 7 % 10;
		sum += parseInt(bisnum.substring(3,4)) * 1 % 10;
		sum += parseInt(bisnum.substring(4,5)) * 3 % 10;
		sum += parseInt(bisnum.substring(5,6)) * 7 % 10;
		sum += parseInt(bisnum.substring(6,7)) * 1 % 10;
		sum += parseInt(bisnum.substring(7,8)) * 3 % 10;
		sum += Math.floor(parseInt(bisnum.substring(8,9)) * 5 / 10);
		sum += parseInt(bisnum.substring(8,9)) * 5 % 10;
		sum += parseInt(bisnum.substring(9,10));
		if(sum % 10 != 0){
			return false;
		}
		return true;
				/*num = RegExp.$1 + RegExp.$2 + RegExp.$3;
				var cVal = 0;
				for (var i = 0; i < 8; i++) {
						var cKeyNum = parseInt(((_tmp = i % 3) == 0) ? 1 : (_tmp == 1) ? 3 : 7);
						cVal += (parseFloat(num.substring(i, i + 1)) * cKeyNum) % 10;
				};
				var li_temp = parseFloat(num.substring(i, i + 1)) * 5 + "0";
				cVal += parseFloat(li_temp.substring(0, 1)) + parseFloat(li_temp.substring(1, 2));
				result = parseInt(num.substring(9, 10)) == 10 - (cVal % 10) % 10 ? true : false;

		return result;*/
	}

	ItgJs.fn_reAlignImage = function(obj, maxW, maxH){
				 if($(obj).height() < maxH){
					var M = maxH - $(obj).height();
					$(obj).css("margin-top", Math.round(M/2) + "px");
				}
				 return;

			 }

	ItgJs.fn_reAlignImage2 = function(obj, maxW, maxH){
				 var MAX_WIDTH = maxW;
				 var MAX_HEIGHT = maxH;
					 var IMAGE_W = $(obj).width();
					 var IMAGE_H = $(obj).height();
					 var tmpW = 0;
					 var tmpH = 0;
					 var NEW_IMAGE_W = 0;
					 var NEW_IMAGE_H = 0;

					 if(IMAGE_W > MAX_WIDTH){
						 NEW_IMAGE_W = MAX_WIDTH;
						 tmpW = NEW_IMAGE_W ;
						 tmpH = Math.round((IMAGE_H * NEW_IMAGE_W) / IMAGE_W);
					 }else if(IMAGE_H > MAX_HEIGHT){
						 NEW_IMAGE_H = MAX_HEIGHT;
						 tmpH = NEW_IMAGE_H ;
						 tmpW = Math.round((IMAGE_W * NEW_IMAGE_H) / IMAGE_H);
					 }else{
						 NEW_IMAGE_W = IMAGE_W;
						 NEW_IMAGE_H = IMAGE_H;
						 tmpW = Math.round((IMAGE_W * NEW_IMAGE_H) / IMAGE_H);
						 tmpH = Math.round((IMAGE_H * NEW_IMAGE_W) / IMAGE_W);
					 }


					if (tmpW > MAX_WIDTH) {
						NEW_IMAGE_W = MAX_WIDTH;
						NEW_IMAGE_H = Math.round((tmpH * NEW_IMAGE_W) / IMAGE_W);
					} else if(tmpH > MAX_HEIGHT) {
						NEW_IMAGE_H = MAX_HEIGHT;
						NEW_IMAGE_W = Math.round((tmpH * NEW_IMAGE_H) / IMAGE_H);
					} else{
						NEW_IMAGE_W = tmpW;
						NEW_IMAGE_H = tmpH;
					}


					//alert(IMAGE_W + ", " + IMAGE_H + " __ " + NEW_IMAGE_W + ", " + NEW_IMAGE_H)


					if(NEW_IMAGE_H < MAX_HEIGHT){
						var M = MAX_HEIGHT - NEW_IMAGE_H;
						$(obj).css("margin-top", Math.round(M/2) + "px");
					}
						 $(obj).css("width", NEW_IMAGE_W + "px");
						 $(obj).css("height", NEW_IMAGE_H + "px");

			 }
	ItgJs.fn_colorBoxClose = function(){
			 $("#cboxClose").trigger("click") ;
		 }

	ItgJs.fn_sessionKeep = function(){
			 $.ajax({
				 url:"/comm/sessionKeep.do"
				 , data : ""
				 , type : "post"
				 , dataType : "json"
				 , success : function(result){
				 }
						, error:function(request,status,error){
							//alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
				 }
			 });
		 }

	ItgJs.fn_checkAll = function(chkObj, targetId) {
		$("input[name=" +targetId+ "]").prop("checked", chkObj.checked);
	}
	ItgJs.fn_check = function(chkObj, targetId) {
		var chkX = $("input[name=" + chkObj + "]:checked").length;
		var chkY = $("input[name=" + chkObj + "]").length;

		if (chkX == chkY) {
			$("input[id=" + targetId + "]").prop("checked", "checked");
		}
		else {
			$("input[id=" + targetId + "]").removeAttr("checked");
		}
	}
		 /* queryString에서 해당하는 변수의 값을 파라메터값으로 변경(replace) */
	ItgJs.fn_replaceQueryString = function(strQS, strFld, strVal){

		var ptrn = "/(&|^)("+strFld+"=)([^&]*|$)/i"; //(id=)[^&]+
		ptrn = eval(ptrn);
		if("" != strVal){
			if(ptrn.test(strQS)){
				strQS = strQS.replace(ptrn, "&" + strFld + "=" + encodeURIComponent(strVal));
			}else{
				if("schStr" == strFld){
					strQS = strQS + "&" + strFld + "=" + encodeURIComponent(strVal);
				}else{
					strQS = strQS + "&" + strFld + "=" + strVal;
				}
			}
		}else{
			if(ptrn.test(strQS)){
				strQS = strQS.replace(ptrn, "");
			}
		}

		return strQS.startsWith("&") ? strQS.substring(1) : strQS;
	}

	ItgJs.fn_isEmpty = function(value){
		if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
			return true
		}else{ return false }
	}

	ItgJs.fn_checkPass = function(pass1,  pass2){
		if(ItgJs.fn_isEmpty(pass1)){
			return "비밀번호를 입력하세요";
		}else if(ItgJs.fn_isEmpty(pass1)){
			return "비밀번호 확인을 입력하세요";
		}
		if(pass1 != pass2){	return "비밀번호 확인이 일치하지 않습니다.";}
		if(pass1.length<9){	return "비밀번호는 영문, 숫자, 특수문자의 조합으로 9자리 이상 입력해주세요.";}
		if(!pass1.match(/[a-zA-Z0-9]*[^a-zA-Z0-9\n]+[a-zA-Z0-9]*$/ )){return "비밀번호는 영문, 숫자, 특수문자의 조합으로 9자리 이상 입력해주세요.";}
		var SamePass_0 = 0; //동일문자 카운트
		var SamePass_1 = 0; //연속성(+) 카운드
		var SamePass_2 = 0; //연속성(-) 카운드
		var chr_pass_0;
		var chr_pass_1;
		var chr_pass_2;
		for(var i=0; i < pass1.length; i++)
		{
				chr_pass_0 = pass1.charAt(i);
				chr_pass_1 = pass1.charAt(i+1);
				chr_pass_2 = pass1.charAt(i+2);
				//동일문자 카운트
				if(chr_pass_0 == chr_pass_1 && chr_pass_1 == chr_pass_2){SamePass_0 = SamePass_0 + 1;}
				//연속성(+) 카운드
				if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == 1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == 1){
						SamePass_1 = SamePass_1 + 1
				}
				//연속성(-) 카운드
				if(chr_pass_0.charCodeAt(0) - chr_pass_1.charCodeAt(0) == -1 && chr_pass_1.charCodeAt(0) - chr_pass_2.charCodeAt(0) == -1){
						SamePass_2 = SamePass_2 + 1
				}
		}
		if(SamePass_0 > 0){return "동일문자를 3회 이상 연속으로 사용할 수 없습니다.";}
			if(SamePass_1 > 0 || SamePass_2 > 0 ){return "연속된 문자열(123 또는 321, abc, cba 등)을\n 3자 이상 사용 할 수 없습니다.";}
		return "";
	}

	/*datepicker kr 기본세팅*/
	ItgJs.fn_datePicker = function(dateId){
		$.fn.datepicker.dates['kr'] = {
				days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
				daysShort: ["일", "월", "화", "수", "목", "금", "토", "일"],
				daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
				months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
				monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
			};

		$(dateId).datepicker({
				format: "yyyy-mm-dd",
				//startView: 1,
				//minViewMode: 1,
				language: "kr",
				autoclose: true,
				todayHighlight: true
		});
	}

	ItgJs.fn_datePicker2 = function(dateId,format){
		ItgJs.fn_datePicker(dateId,format,"");
	}

	ItgJs.fn_datePicker = function(dateId,format,startDate){

		if(ItgJs.fn_isEmpty(format)){format = "yyyy-mm-dd";}
		if(ItgJs.fn_isEmpty(startDate)){startDate = "";}

		$(dateId).datepicker({
				format: format,
				//startView: 1,
				//minViewMode: 1,
				startDate: startDate,
				language: "kr",
				autoclose: true,
				todayHighlight: true
		});
	}

	/* axisJ
	ItgJs.fn_datePickerRange = function(startId, endId){
			 $(startId).bindDate({ onChange:{
				earlierThan:$(endId).prop("id"), err:"종료일보다 빠른 날짜를 선택하세요"}
			});
			$(endId).bindDate({ onChange:{
						 laterThan:$(startId).prop("id"), err:"시작일보다 느린 날짜를 선택하세요"}
			});
		 }
	*/

	ItgJs.fn_datePickerRange = function(startId, endId) {
		/*bootstrap*/
		$.fn.datepicker.dates['kr'] = {
			days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
			daysShort: ["일", "월", "화", "수", "목", "금", "토", "일"],
			daysMin: ["일", "월", "화", "수", "목", "금", "토", "일"],
			months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			monthsShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
		};
		$( startId ).datepicker(
		{
			format: "yyyy-mm-dd",
				//startView: 1,
				//minViewMode: 1,
				startDate:"2000-01-01",
				endDate: $(endId).val(),
				language: "kr",
				autoclose: true,
				todayHighlight: true
		}).on("changeDate",function(e){$(endId).datepicker("setStartDate",$(startId).val())});

		$( endId ).datepicker(
		{
			format: "yyyy-mm-dd",
				//startView: 1,
				//minViewMode: 1,
				startDate: $(startId).val(),
				endDate: "3000-12-31",
				language: "kr",
				autoclose: true,
				todayHighlight: true
		}).on("changeDate",function(e){$(startId).datepicker("setEndDate",$(endId).val())});


		/*jquery-ui*/
		/*
		$( startId ).datepicker(
		{
			//showOn: "button",
			//buttonImage: "/resource/common/jquery_plugin/i_calendar.gif",
			//buttonImageOnly: true,
			format: "yyyy-mm-dd",
			changeMonth: true,
			changeYear: true,
			yearRange:"c-20:c+20",
			numberOfMonths : 3,
			onClose: function( selectedDate ) {  $( endId ).datepicker( "option", "minDate", selectedDate );      }
		},
		$.datepicker.regional[ "ko" ]);

		$( endId ).datepicker(
		{
			//showOn: "button",
			//buttonImage: "/resource/common/jquery_plugin/i_calendar.gif",
			//buttonImageOnly: true,
			format: "yyyy-mm-dd",
			changeMonth: true,
			changeYear: true,
			yearRange:"c-20:c+20",
			numberOfMonths : 3,
			onClose: function( selectedDate ) {      $( startId ).datepicker( "option", "maxDate", selectedDate );       }
		},
		$.datepicker.regional[ "ko" ]);
		*/
	}

	ItgJs.NowPageById = function(fullCode,type){
		var classStr = "active";
		if(type == null || type == ""){
			type="LEFT";
		}else if(type == "SNB"){
			classStr = "is_lnb--opened";
		}else if(type == "TAB"){
			classStr = "is_selected";
		}
		var menuArr = fullCode.toUpperCase().split(">");
		for(var i in menuArr) {
			$("#"+type+"_"+menuArr[i]).addClass(classStr);
		}
	}

	ItgJs.RemovePageById = function(fullCode){

		var menuArr = fullCode.toUpperCase().split(">");
		for(var i in menuArr) {
			$("#LEFT_"+menuArr[i]).removeClass("active");
		}
	}

	ItgJs.NowPageSub = function(fullCode,type){

		var menuArr = fullCode.toUpperCase().split(">");

		for(var i in menuArr) {
			$("#SNB_"+menuArr[i]).addClass("active");
		}
	}

	ItgJs.optionForSelectBox = function(list, selectid, optionval, optiontxt, selectedval) {
		var optionString = "";
		$.each(list, function () {
			console.log(this);
			optionString += "<option value='" + this[optionval] + (this[optionval] == selectedval ? "' selected='selected'" : "")+"'>" + this[optiontxt] + "</option>";
		});
		$("#"+selectid).append(optionString);
	}

	ItgJs.selectBoxForeach = function(arr, id, val) {
		$.each(arr, function (index, value) {
			if (value == val) {
				$("#" + id).append("<option value='" + value + "' selected='selected'>" + value + "</option>");
			}
			else {
				$("#" + id).append("<option value='" + value + "'>" + value + "</option>");
			}
		});
	}

	ItgJs.selectBoxLocalNumber = function(id, value) {
		var localNumberArr = [
			"02", "051", "053", "032", "062", "042", "052", "031", "033", "043", "041", "063", "061", "054", "055", "064", "070"
		];
		$("#" + id).append("<option value=''>선택</option>");
		ItgJs.selectBoxForeach(localNumberArr, id, value);
	}

	ItgJs.selectBoxMobileLocalNumber = function(id, value) {
		var localNumberArr = [
			"010", "011", "016", "017", "018", "019"
		];
		$("#" + id).append("<option value=''>선택</option>");
		ItgJs.selectBoxForeach(localNumberArr, id, value);
	}

	ItgJs.selectBoxEmail = function(id, value) {
		var emailArr = [
			"daum.net", "hanmail.net", "paran.com", "hotmail.com", "chollian.net", "dreamwiz.com", "empal.com", "hanmir.net",
			"hitel.com", "korea.com", "lycos.co.kr", "nate.com", "naver.com", "netian.net", "gmail.com"
		];
		$("#" + id).append("<option value=''>직접입력</option>");
		ItgJs.selectBoxForeach(emailArr, id, value);
	}

	ItgJs.selectBoxGetYear = function(fld, value) {
		var toDay = new Date();
		var year = toDay.getFullYear();

		for (var i = year; i >= year - 100; i--) {
			if (value == i) {
				$("#" + fld).append("<option value='" + i + "' selected='selected'>" + i + "</option>");
			}
			else {
				$("#" + fld).append("<option value='" + i + "' >" + i + "</option>");
			}
		}
	}

	ItgJs.selectBoxGetYear2 = function(fld, value) {
		var toDay = new Date();
		var year = toDay.getFullYear();

		for (var i = year; i <= year + 10; i++) {
			if (value == i) {
				$("#" + fld).append("<option value='" + i + "' selected='selected'>" + i + "</option>");
			}
			else {
				$("#" + fld).append("<option value='" + i + "' >" + i + "</option>");
			}
		}
	}
	ItgJs.selectBoxGetMonth = function(id, value) {
		var monthArr = [
			"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
			"11", "12"
		];
		$("#" + id).append("<option value=''>선택</option>");
		ItgJs.selectBoxForeach(monthArr, id, value);
	}

	ItgJs.selectBoxGetDay = function(id, value) {
		var dayArr = [
			"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
			"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
			"21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
		];
		$("#" + id).append("<option value=''>선택</option>");
		ItgJs.selectBoxForeach(dayArr, id, value);
	}
	ItgJs.selectBoxGetTime = function(id, value) {
		var timeArr = [
			"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
			"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
			"21", "22", "23", "24"
		];
		$("#" + id).append("<option value=''>선택</option>");
		ItgJs.selectBoxForeach(timeArr, id, value);
	}
	ItgJs.selectBoxGetmin = function(id, value) {
		var minArr = [
			"00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
			"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
			"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
			"31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
			"41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
			"51", "52", "53", "54", "55", "56", "57", "58", "59"
		];
		$("#" + id).append("<option value=''>선택</option>");
		ItgJs.selectBoxForeach(minArr, id, value);
	}



	//R: 도로명, J: 지번
	var addr = "R";
	ItgJs.getDaumAddressPopup = function() {
		var width = 500; //팝업의 너비
		var height = 600; //팝업의 높이
		new daum.Postcode({
			oncomplete: function(data) {
				ItgJs.getDaumAddressCore(data);
			}
		}).open({
			left: (window.screen.width / 2) - (width / 2),
			top: (window.screen.height / 2) - (height / 2)
		});
	}

	ItgJs.getDaumAddressLayer = function() {
		new daum.Postcode({
			oncomplete: function(data) {
				ItgJs.getDaumAddressCore(data);
			},
			width : '100%',
			height : '100%'
		}).embed($("#daumPostLayer").attr("id"));

		// iframe을 넣은 element를 보이게 한다.
		$("#daumPostLayer").show();

		// iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
		ItgJs.getDaumAddressLayerPosition();
	}

	ItgJs.getDaumAddressLayer1st = function() {
		new daum.Postcode({
			oncomplete: function(data) {
				ItgJs.getDaumAddressCore1st(data);
			},
			width : '100%',
			height : '100%'
		}).embed($("#daumPostLayer").attr("id"));

		// iframe을 넣은 element를 보이게 한다.
		$("#daumPostLayer").show();

		// iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
		ItgJs.getDaumAddressLayerPosition();
	}

	ItgJs.getDaumAddressLayer2nd = function() {
		new daum.Postcode({
			oncomplete: function(data) {
				ItgJs.getDaumAddressCore2nd(data);
			},
			width : '100%',
			height : '100%'
		}).embed($("#daumPostLayer").attr("id"));

		// iframe을 넣은 element를 보이게 한다.
		$("#daumPostLayer").show();

		// iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
		ItgJs.getDaumAddressLayerPosition();
	}

	ItgJs.getDaumAddressCore = function(data) {
		// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
		// 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
		// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
		var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
		var extraRoadAddr = ''; // 도로명 조합형 주소 변수

		// 법정동명이 있을 경우 추가한다. (법정리는 제외)
		// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
		if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
			extraRoadAddr += data.bname;
		}
		// 건물명이 있고, 공동주택일 경우 추가한다.
		if (data.buildingName !== '' && data.apartment === 'Y') {
			extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
		}
		// 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
		if (extraRoadAddr !== '') {
			extraRoadAddr = ' (' + extraRoadAddr + ')';
		}
		// 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
		if (fullRoadAddr !== '') {
			fullRoadAddr += extraRoadAddr;
		}

		//K: 한글주소, E: 영문주소
		if (data.userLanguageType == 'E') {
			alert("한글 도로명 및 지번 주소를 선택해 주세요.");
			return false;
		}

		//R: 도로명, J: 지번
		addr = data.userSelectedType;
		if (data.userSelectedType == 'J') {
			$("#oldPost").show();
			$("#oldAddr1").show();
			$("#oldAddr2").show();

			$("#newPost").hide();
			$("#newAddr1").hide();
			$("#newAddr2").hide();
		}
		else {
			$("#newPost").show();
			$("#newAddr1").show();
			$("#newAddr2").show();

			$("#oldPost").hide();
			$("#oldAddr1").hide();
			$("#oldAddr2").hide();
		}

		// 우편번호와 주소 정보를 해당 필드에 넣는다.
		$("#oldPost").val(data.postcode1 + data.postcode2); //구 우편번호 사용
		$("#newPost").val(data.zonecode); //5자리 새 우편번호 사용
		$("#oldAddr1").val(data.jibunAddress); //구주소
		$("#newAddr1").val(fullRoadAddr); //신주소

		// 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
		if (data.autoRoadAddress) {
			//예상되는 도로명 주소에 조합형 주소를 추가한다.
			var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
			$("#guide").text("예상 도로명 주소 : " + expRoadAddr);

		}
		else if (data.autoJibunAddress) {
			var expJibunAddr = data.autoJibunAddress;
			$("#guide").text("예상 지번 주소 : " + expJibunAddr);
		}
		else {
			$("#guide").text("");
		}

		ItgJs.getDaumAddressLayerClose();
	}

	ItgJs.getDaumAddressCore1st = function(data) {
		// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
		// 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
		// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
		var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
		var extraRoadAddr = ''; // 도로명 조합형 주소 변수

		// 법정동명이 있을 경우 추가한다. (법정리는 제외)
		// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
		if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
			extraRoadAddr += data.bname;
		}
		// 건물명이 있고, 공동주택일 경우 추가한다.
		if (data.buildingName !== '' && data.apartment === 'Y') {
			extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
		}
		// 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
		if (extraRoadAddr !== '') {
			extraRoadAddr = ' (' + extraRoadAddr + ')';
		}
		// 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
		if (fullRoadAddr !== '') {
			fullRoadAddr += extraRoadAddr;
		}

		//K: 한글주소, E: 영문주소
		if (data.userLanguageType == 'E') {
			alert("한글 도로명 및 지번 주소를 선택해 주세요.");
			return false;
		}

		//R: 도로명, J: 지번
		addr = data.userSelectedType;

		// 우편번호와 주소 정보를 해당 필드에 넣는다.
		//구 주소 정보(참조용으로만 표출)
		var oldAddr = "(구) ("+data.postcode1+"-"+data.postcode2+") "+data.jibunAddress;
		$("#oldAddr1st").text(oldAddr); //구 주소 정보(참조용으로만 표출)
		$("#oldAddr1stHelp").text(" (※구주소는 참고용이며 저장되지 않습니다.)"); //구 주소 정보(참조용으로만 표출)
		$("#post1st").val(data.zonecode); //5자리 새 우편번호 사용
		$("#addr1st1").val(fullRoadAddr); //신주소

		// 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
		if (data.autoRoadAddress) {
			//예상되는 도로명 주소에 조합형 주소를 추가한다.
			var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
			$("#guide1st").text("예상 도로명 주소 : " + expRoadAddr);

		}
		else if (data.autoJibunAddress) {
			var expJibunAddr = data.autoJibunAddress;
			$("#guide1st").text("예상 지번 주소 : " + expJibunAddr);
		}
		else {
			$("#guide1st").text("");
		}

		ItgJs.getDaumAddressLayerClose();
	}

	ItgJs.getDaumAddressCore2nd = function(data) {
		// 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
		// 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
		// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
		var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
		var extraRoadAddr = ''; // 도로명 조합형 주소 변수

		// 법정동명이 있을 경우 추가한다. (법정리는 제외)
		// 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
		if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
			extraRoadAddr += data.bname;
		}
		// 건물명이 있고, 공동주택일 경우 추가한다.
		if (data.buildingName !== '' && data.apartment === 'Y') {
			extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
		}
		// 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
		if (extraRoadAddr !== '') {
			extraRoadAddr = ' (' + extraRoadAddr + ')';
		}
		// 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
		if (fullRoadAddr !== '') {
			fullRoadAddr += extraRoadAddr;
		}

		//K: 한글주소, E: 영문주소
		if (data.userLanguageType == 'E') {
			alert("한글 도로명 및 지번 주소를 선택해 주세요.");
			return false;
		}

		//R: 도로명, J: 지번
		addr = data.userSelectedType;

		// 우편번호와 주소 정보를 해당 필드에 넣는다.
		var oldAddr = "(구) ("+data.postcode1+"-"+data.postcode2+") "+data.jibunAddress;
		$("#oldAddr2nd").text(oldAddr); //구 주소 정보(참조용으로만 표출)
		$("#oldAddr2ndHelp").text(" (※구주소는 참고용이며 저장되지 않습니다.)"); //구 주소 정보(참조용으로만 표출)
		$("#post2nd").val(data.zonecode); //5자리 새 우편번호 사용
		$("#addr2nd1").val(fullRoadAddr); //신주소

		// 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
		if (data.autoRoadAddress) {
			//예상되는 도로명 주소에 조합형 주소를 추가한다.
			var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
			$("#guide2nd").text("예상 도로명 주소 : " + expRoadAddr);

		}
		else if (data.autoJibunAddress) {
			var expJibunAddr = data.autoJibunAddress;
			$("#guide2nd").text("예상 지번 주소 : " + expJibunAddr);
		}
		else {
			$("#guide2nd").text("");
		}

		ItgJs.getDaumAddressLayerClose();
	}

	// 브라우저의 크기 변경에 따라 레이어를 가운데로 이동시키고자 하실때에는
	// resize이벤트나, orientationchange이벤트를 이용하여 값이 변경될때마다 아래 함수를 실행 시켜 주시거나,
	// 직접 element_layer의 top,left값을 수정해 주시면 됩니다.
	ItgJs.getDaumAddressLayerPosition = function() {
		var width = 500; //우편번호서비스가 들어갈 element의 width
		var height = 460; //우편번호서비스가 들어갈 element의 height
		var borderWidth = 5; //샘플에서 사용하는 border의 두께

		$("#daumPostLayer").css({
			width: width + 'px',
			height: height + 'px',
			border: borderWidth + 'px solid',
			left: (((window.innerWidth || document.documentElement.clientWidth) - width) / 2 - borderWidth) + 'px',
			top: (((window.innerHeight || document.documentElement.clientHeight) - height) / 2 - borderWidth) + 'px'
		});
	}

	ItgJs.getDaumAddressLayerClose = function() {
		// iframe을 넣은 element를 안보이게 한다.
		$("#daumPostLayer").hide();
	}

	ItgJs.fn_chkDate = function(value) {
		try {
			var param = value.replace(/-/g, '');

			// 자리수가 맞지않을때
			if (isNaN(param) || param.length != 8) {
				return false;
			}

			var year = Number(param.substring(0, 4));
			var month = Number(param.substring(4, 6));
			var day = Number(param.substring(6, 8));

			if (month < 1 || month > 12) {
				return false;
			}

			var maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var maxDay = maxDaysInMonth[month - 1];

			// 윤년 체크
			if (month == 2 && ( year % 4 == 0 && year % 100 != 0 || year % 400 == 0 )) {
				maxDay = 29;
			}

			if (day <= 0 || day > maxDay) {
				return false;
			}
			return true;

		}
		catch (err) {
			return false;
		}
	}

	ItgJs.fn_chkNumber = function(id, strErrorMessage) {
		var pattern = /[^(0-9)]/;
		if ($.trim($("#" + id).val()) == "" || pattern.test($("#" + id).val())) {
			alert(strErrorMessage);
			$("#" + id).focus();
			return false;
		}
		return true;
	}

	ItgJs.fn_sendSatis = function(){
		if($("input[name=answer1]:checked").size() == 0){
			alert("만족도를 선택 해 주세요.");
			return false;
		}
		var data = $("#satisForm").serialize();
		$.ajax({
			url : "/common/sendSatis.do",
			data : data,
			dataType : "json",
			success : function(data){
				alert(data.message);
				document.satisForm.reset();
			}
		});
	}

	ItgJs.fn_closeLayerPopup = function(name,limit){
		ItgJs.fn_setCookie(name, "on", limit);
		ItgJs.mainPopClose(name);
	}

	ItgJs.fn_mainSearch = function(menuCode,frm){
		if(frm == null) frm = document.totSearch;
		frm.action= "../contents/"+menuCode+".do";
		frm.submit();
	}

	ItgJs.fn_replaceBr = function(str){
		return str.replace(/(?:\r\n|\r|\n)/g, '<br/>');
	}

	ItgJs.sendSns = function(sns, url, txt){
				var frm = document.snsShare;
				var o;
				var _url = encodeURIComponent(url);
				var _txt = encodeURIComponent(txt);
				var _br  = encodeURIComponent('\r\n');

				switch(sns){
						case 'facebook':
								o = {
										method:'popup',
										url:'http://www.facebook.com/sharer/sharer.php?u=' + _url
								};
								break;

						case 'twitter':
								o = {
										method:'popup',
										url:'http://twitter.com/intent/tweet?text=' + _txt + '&url=' + _url
								};
								break;
						case 'naverBlog':
								o = {
										method:'popup',
										url:'http://share.naver.com/web/shareView.nhn?url=' + _url + '&title=' + _txt
								};
								break;

						case 'me2day':
								o = {
										method:'popup',
										url:'http://me2day.net/posts/new?new_post[body]=' + _txt + _br + _url + '&new_post[tags]=epiloum'
								};
								break;

						case 'kakaotalk':
								o = {
										method:'web2app',
										param:'sendurl?msg=' + _txt + '&url=' + _url + '&type=link&apiver=2.0.1&appver=2.0&appid=dev.epiloum.net&appname=' + encodeURIComponent('${systemconfigVO.titleName}'),
										a_store:'itms-apps://itunes.apple.com/app/id362057947?mt=8',
										g_store:'market://details?id=com.kakao.talk',
										a_proto:'kakaolink://',
										g_proto:'scheme=kakaolink;package=com.kakao.talk'
								};
								break;

						case 'kakaostory':
								o = {
										method:'web2app',
										param:'posting?post=' + _txt + _br + _url + '&apiver=1.0&appver=2.0&appid=dev.epiloum.net&appname=' + encodeURIComponent('${systemconfigVO.titleName}'),
										a_store:'itms-apps://itunes.apple.com/app/id486244601?mt=8',
										g_store:'market://details?id=com.kakao.story',
										a_proto:'storylink://',
										g_proto:'scheme=kakaolink;package=com.kakao.story'
								};
								break;

						case 'kakaostoryW':
								o = {
											method:'popup',
											url:'https://story.kakao.com/s/share?url=' + _url + '&text=' + _txt
								};
						break;

						case 'band':
								o = {
										method:'web2app',
										param:'create/post?text=' + _txt + _br + _url,
										a_store:'itms-apps://itunes.apple.com/app/id542613198?mt=8',
										g_store:'market://details?id=com.nhn.android.band',
										a_proto:'bandapp://',
										g_proto:'scheme=bandapp;package=com.nhn.android.band'
								};
								break;

						default:
								alert('지원하지 않는 SNS입니다.');
								return false;
				}

				switch(o.method){
						case 'popup':
								window.open(o.url, '', 'width=500,height=500');
								var siteCode = frm.siteCode.value;
								var menuCode = frm.menuCode.value;
								$.ajax({
									url: '/_mngr_/stats/snsCount_comm_proc.do',
									type: 'post',
									data: {'currentUrl':url, 'smName':sns, 'siteCode':siteCode, 'menuCode':menuCode},
									dataType: 'text',
									success: function(data) {
									},
									error: function(e){
									},
									complete:function(e){
										var loadingLayer = $("#loadingLayer");
										console.log("hideLoading");
										loadingLayer.hide();
									}
								});

								break;

						case 'web2app':
								if(navigator.userAgent.match(/android/i))
								{
										// Android
										setTimeout(function(){ location.href = 'intent://' + o.param + '#Intent;' + o.g_proto + ';end'}, 100);
								}
								else if(navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i))
								{
										// Apple
										setTimeout(function(){ location.href = o.a_store; }, 200);
										setTimeout(function(){ location.href = o.a_proto + o.param }, 100);
								}
								else
								{
										alert('이 기능은 모바일에서만 사용할 수 있습니다.');
								}
								break;
				}
		}


	// 기본 팝업
	ItgJs.popup = function (url,id,width,height) {
		window.open(url,id,"toolbar=no,location=no,status=no,menubar=no,scrollbars=no,left=0, top=0, resizable=no,width=" + width + "px,height=" + height + "px");
	}

	// 기본 팝업2
	ItgJs.popupScrollbars = function (url,id,width,height) {
		window.open(url,id,"toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,left=0, top=0, resizable=no,width=" + width + "px,height=" + height + "px");
	}

	ItgJs.mainPopClose = function (id){
		$("#"+id).remove();
		return false;
	};

	ItgJs.popupCnt = function(popIdx){
		var frm = document.totSearch;
		var siteCode = frm.siteCode.value;

		$.ajax({
			url: '/_mngr_/stats/popupCount_comm_proc.do',
			type: 'post',
			data: {'popIdx':popIdx, 'siteCode':siteCode},
			dataType: 'text',
			success: function(data) {
			},
			error: function(e){
			},
			complete:function(e){

			}
		});

	}

	ItgJs.getRandomStr = function(len) {
		var char = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var result = "";

		for (var i = 0; i < len ; i++) {
			var rnum = Math.floor(Math.random() * char.length);
			result += char.substring(rnum, rnum+1);
		}

		return result;
	}

	ItgJs.stripScripts = function(value) {
	    var pattern = /<script[^>]*>((\n|\r|.)*?)<\/script>/img;
	    return value.replace(pattern, '');
	}

	ItgJs.stripStyle = function(value) {
	    var pattern = /<style[^>]*>((\n|\r|.)*?)<\/style>/img;
	    return value.replace(pattern, '');
	}

	ItgJs.stripHtml = function(value) {
		var pattern1 = /(<([^>]+)>)/ig;
		var pattern2 = /\n|\r|\t/g;
		var pattern3 = / +/g;
		value = ItgJs.stripStyle(ItgJs.stripScripts(value)).replace(pattern1, '').trim();

		return value.replace(pattern2,' ').replace(pattern3,' ');
	}

	ItgJs.stripHtmlforTextarea = function(value) {
		var pattern1 = /(<([^>]+)>)/ig;
		var pattern2 = /(<br[^>]*>)/ig;
		var pattern3 = /(<[^>]*\/p>)/ig;
		value = value.replace(pattern2,'\r\n');
		value = value.replace(pattern3,'\r\n');

		return ItgJs.stripStyle(ItgJs.stripScripts(value)).replace(pattern1, '').trim();
	}

    ItgJs.fileTypeReferer = {
    		image : 	{
    			desc : "이미지",
    			//types : ".bmp, .gif, .jpg, .jpeg, .png, .psd"
    			types : "image/*"
    		},
    		doc : {
    			desc : "문서",
    			types : ".txt, .rtf, .hwp, .asv, .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx"
    		},
    		audio : {
    			desc : "오디오",
    			//types : ".mp3, .wma, .wav, .flac, .mid",
    			types : "audio/*"
    		},
    		video : {
    			desc : "비디오",
    			//types : ".avi, .mpg, .mpeg, .asf, .asx, .wmv, .mp4, .swf, .flv, .mkv",
    			types : "video/*"
    		},
    		cmpf : {
    			desc : "압축 파일",
    			types : ".zip, .7z, .egg, .alz, .rar, .tar",
    		},
    		all : {
    			desc : "모든 파일",
    			//types : ".bmp, .gif, .jpg, .jpeg, .png, .psd, .txt, .rtf, .hwp, .asv, .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .mp3, .wma, .wav, .flac, .mid, .avi, .mpg, .mpeg, .asf, .asx, .wmv, .mp4, .swf, .flv, .mkv, .zip, .7z, .egg, .alz, .rar, .tar"
    			types : "*/*"
    		}
    	};

    // 허용파일 타입 세팅
    ItgJs.setAcceptType = function (fileTypes) {
    	var fileType = "";

		if (fileTypes.indexOf(";")>0) {
			fileTypes = fileTypes.split(";");
		}

		if (Array.isArray(fileTypes)) {
			for (var i =0 ;  i < fileTypes.length ; i++) {
				if (fileType.length != 0) {
					fileType += ", ";
				}
				if (ItgJs.fileTypeReferer[fileTypes[i]] != undefined) {
					if ("all" === fileTypes[i]) {
						fileType = "";
						fileType += ItgJs.fileTypeReferer[fileTypes[i]].types;
						break;
					} else {
						fileType += ItgJs.fileTypeReferer[fileTypes[i]].types;
					}
				} else {
					fileType += fileTypes[i];
				}
			}
		} else {
			if (ItgJs.fileTypeReferer[fileTypes] != undefined) {
				if ("all" === fileTypes) {
					fileType = "";
					fileType += ItgJs.fileTypeReferer[fileTypes].types;
				} else {
					fileType += ItgJs.fileTypeReferer[fileTypes].types;
				}
			} else {
				fileType += fileTypes;
			}
		}

		/*if(fileTypes == "all") {
			fileType = "*.*";
		}
		else if(fileTypes == "image") {
			fileType = ".bmp, .gif, .jpg, .jpeg, .png";
		}
		else if(fileTypes == "html") {
			fileType = ".htm, .html";
		}
		else if(fileTypes != "") {
			//화면에서 넘겨주는 값으로 세팅
			fileType = fileTypes;
		}
		else {
			fileType = "*.*";
		}
		*/
		return fileType;
    };


	/**
	 * File 타입에 대한 설명 반환 (SwfUpload가 화면에 보여주는 파일 유형 값)
	 * @return
	 */
    ItgJs.setAcceptTypeDesc = function (fileTypes) {
		var fileTypeDesc = "";

		if (fileTypes.indexOf(";")>0) {
			fileTypes = fileTypes.split(";");
		}

		if (Array.isArray(fileTypes)) {

			for (var i =0 ;  i < fileTypes.length ; i++) {
				if (fileTypeDesc.length != 0) {
					fileTypeDesc += ", ";
				}
				if (ItgJs.fileTypeReferer[fileTypes[i]] != undefined) {
					if ("all" === fileTypes[i]) {
						fileTypeDesc = "";
						fileTypeDesc += ItgJs.fileTypeReferer[fileTypes[i]].desc;
						break;
					} else {
						fileTypeDesc += ItgJs.fileTypeReferer[fileTypes[i]].desc;
					}
				} else {
					fileTypeDesc += fileTypes[i];
				}
			}

		} else {

			if (ItgJs.fileTypeReferer[fileTypes] != undefined) {
				if ("all" === fileTypes) {
					fileTypeDesc = "";
					fileTypeDesc += ItgJs.fileTypeReferer[fileTypes].desc;
				} else {
					fileTypeDesc += ItgJs.fileTypeReferer[fileTypes].desc;
				}
			}

		}

		/*if(fileTypes == "all") {
			fileTypeDesc = "All Files";
		}
		else if(fileTypes == "image") {
			fileTypeDesc = "Images";
		}
		else if(fileTypes == "html") {
			fileTypeDesc = "HTML";
		}
		else {
			fileTypeDesc = "All Files";
		}*/
		return fileTypeDesc;
	};

	/**
	 * 로딩 화면 보이기
	 * @return
	 */
	ItgJs.showLoading = function () {
		var spiner ="";
		//console.log("showLoading : "+isOldIe);
		spinner = "<div class=\"lds-css ng-scope\">"
			+ "<div class=\"loading-spiner\" style=\"100%;height:100%\"><img src=\"/resource/common/img/loading-bar.gif\"/></div></div>";
/*		if(isOldIe){
		}else{
			spinner = "<div class=\"lds-css ng-scope\">"
				+ "<div class=\"loading-spiner\" style=\"100%;height:100%\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>"
				+ "</div>";
		}*/
		var loadingLayer = $("#loadingLayer");
		console.log(loadingLayer);
		loadingLayer.css("height","100%");
		loadingLayer.html(spinner);
		loadingLayer.show();
	};

	ItgJs.hideLoading = function () {
		var loadingLayer = $("#loadingLayer");
		console.log("hideLoading");
		//loadingLayer.css("height","0%");
		//loadingLayer.html("");
		loadingLayer.hide();
	};

	/**
	 * Javascript 프로토타입 추가 선언
	 * @return
	 */

	// yyyy-MM-dd hh:mm:ss 형태로 포매팅된 날짜 반환
	Date.prototype.toMyString = function(){

	    var yyyy = this.getFullYear().toString();
	    var MM = (this.getMonth() + 1).toString();
	    var dd = this.getDate().toString();
	    var hh = this.getHours().toString();
	    var mm = this.getMinutes().toString();
	    var ss = this.getSeconds().toString();

	    return yyyy +'-' +(MM[1] ? MM : '0'+MM[0]) +'-'+(dd[1] ? dd : '0'+dd[0])+' '+(hh[1] ? hh : '0'+hh[0])+':'+(mm[1] ? mm : '0'+mm[0])+':'+(ss[1] ? ss : '0'+ss[0]);
	}

	// String startsWith 함수 추가(익스플로러용)
	if (typeof String.prototype.startsWith != 'function') {
	    String.prototype.startsWith = function (str){
	    return this.slice(0, str.length) == str;
	  };
	}

	ArrayList=function(/* array? */arr){
		// summary
		// Returns a new object of type dojox.collections.ArrayList
		var items = [];
		if (arr)
			items = items.concat(arr);
		this.count = items.length;
		this.add = function(/* object */obj) {
			// summary
			// Add an element to the collection.
			items.push(obj);
			this.count = items.length;
		};
		this.addRange = function(/* array */a) {
			// summary
			// Add a range of objects to the ArrayList
			if (a.getIterator) {
				var e = a.getIterator();
				while (!e.atEnd()) {
					this.add(e.get());
				}
				this.count = items.length;
			} else {
				for (var i = 0; i < a.length; i++) {
					items.push(a[i]);
				}
				this.count = items.length;
			}
		};
		this.clear = function() {
			// summary
			// Clear all elements out of the collection, and reset the count.
			items.splice(0, items.length);
			this.count = 0;
		};
		this.clone = function() {
			// summary
			// Clone the array list
			return new dojox.collections.ArrayList(items); // dojox.collections.ArrayList
		};
		this.contains = function(/* object */obj) {
			// summary
			// Check to see if the passed object is a member in the ArrayList
			for (var i = 0; i < items.length; i++) {
				if (items[i] == obj) {
					return true; // bool
				}
			}
			return false; // bool
		};
		this.forEach = function(/* function */fn, /* object? */scope) {
			// summary
			// functional iterator, following the mozilla spec.
			dojo.forEach(items, fn, scope);
		};
		this.get = function(index) {
			return items[index];
		};
		this.size = function() {
			return items.length;
		};
		this.getIterator = function() {
			// summary
			// Get an Iterator for this object
			return new dojox.collections.Iterator(items); // dojox.collections.Iterator
		};
		this.indexOf = function(/* object */obj) {
			// summary
			// Return the numeric index of the passed object; will return -1 if not
			// found.
			for (var i = 0; i < items.length; i++) {
				if (items[i] == obj) {
					return i; // int
				}
			}
			return -1; // int
		};
		this.insert = function(/* int */i, /* object */obj) {
			// summary
			// Insert the passed object at index i
			items.splice(i, 0, obj);
			this.count = items.length;
		};
		this.item = function(/* int */i) {
			// summary
			// return the element at index i
			return items[i]; // object
		};
		this.remove = function(/* object */obj) {
			// summary
			// Look for the passed object, and if found, remove it from the internal
			// array.
			var i = this.indexOf(obj);
			if (i >= 0) {
				items.splice(i, 1);
			}
			this.count = items.length;
		};
		this.removeAt = function(/* int */i) {
			// summary
			// return an array with function applied to all elements
			items.splice(i, 1);
			this.count = items.length;
		};
		this.reverse = function() {
			// summary
			// Reverse the internal array
			items.reverse();
		};
		this.sort = function(/* function? */fn) {
			// summary
			// sort the internal array
			if (fn) {
				items.sort(fn);
			} else {
				items.sort();
			}
		};
		this.setByIndex = function(/* int */i, /* object */obj) {
			// summary
			// Set an element in the array by the passed index.
			items[i] = obj;
			this.count = items.length;
		};
		this.toArray = function() {
			// summary
			// Return a new array with all of the items of the internal array
			// concatenated.
			return [].concat(items);
		}
		this.toString = function(/* string */delim) {
			// summary
			// implementation of toString, follows [].toString();
			return items.join((delim || ","));
		};
	};


	Map = function(){
		  this.map = new Object();
		 };
		 Map.prototype = {
		     put : function(key, value){
		         this.map[key] = value;
		     },
		     get : function(key){
		         return this.map[key];
		     },
		     containsKey : function(key){
		      return key in this.map;
		     },
		     containsValue : function(value){
		      for(var prop in this.map){
		       if(this.map[prop] == value) return true;
		      }
		      return false;
		     },
		     isEmpty : function(key){
		      return (this.size() == 0);
		     },
		     clear : function(){
		      for(var prop in this.map){
		       delete this.map[prop];
		      }
		     },
		     remove : function(key){
		      delete this.map[key];
		     },
		     keys : function(){
		         var keys = new Array();
		         for(var prop in this.map){
		             keys.push(prop);
		         }
		         return keys;
		     },
		     values : function(){
		      var values = new Array();
		         for(var prop in this.map){
		          values.push(this.map[prop]);
		         }
		         return values;
		     },
		     size : function(){
		       var count = 0;
		       for (var prop in this.map) {
		         count++;
		       }
		       return count;
		     }
		 };

		window.matchMedia || (window.matchMedia = function() {
		    "use strict";

		    // For browsers that support matchMedium api such as IE 9 and webkit
		    var styleMedia = (window.styleMedia || window.media);

		    // For those that don't support matchMedium
		    if (!styleMedia) {
		        var style       = document.createElement('style'),
		            script      = document.getElementsByTagName('script')[0],
		            info        = null;

		        style.type  = 'text/css';
		        style.id    = 'matchmediajs-test';

		        if (!script) {
		          document.head.appendChild(style);
		        } else {
		          script.parentNode.insertBefore(style, script);
		        }

		        // 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
		        info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

		        styleMedia = {
		            matchMedium: function(media) {
		                var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

		                // 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
		                if (style.styleSheet) {
		                    style.styleSheet.cssText = text;
		                } else {
		                    style.textContent = text;
		                }

		                // Test if media query is true or false
		                return info.width === '1px';
		            }
		        };
		    }

		    return function(media) {
		        return {
		            matches: styleMedia.matchMedium(media || 'all'),
		            media: media || 'all'
		        };
		    };
		}());

	// 사용자용 에디터 세팅
	function userEditorSet(){
		 myeditor.config.useSource = false;
		 myeditor.config.useStrikethrough = false;
		 myeditor.config.useUnderline = false;
		 myeditor.config.useItalic = false;
		 myeditor.config.useJustifyLeft = false;
		 myeditor.config.useJustifyCenter = false;
		 myeditor.config.useJustifyRight = false;
		 myeditor.config.useJustifyFull = false;
		 myeditor.config.useFontName = false;
		 myeditor.config.useLineHeight = false;
		 myeditor.config.useBackColor = false;
		 myeditor.config.useHR = false;
		 myeditor.config.useTable = false;
		 myeditor.config.useModifyTable = false;
	}

	/**
	 * Jquery Ajax 세팅
	 * @return
	 */
	(function($) {
	    $.ajaxSetup({
	    	beforeSend: ItgJs.showLoading,
	    	error: function(xhr, status, err) {
	        	if (xhr.status == 401) {
	        		alert("권한이 없습니다.");
	        		location.reload();
	            } else if (xhr.status == 403) {
	            	//alert("세션이 종료되었거나 접근 권한이 없습니다.");
	            	//location.href="/_mngr_/main/login.do";
	            } else if (xhr.status == 701) {
	            	alert("권한이 없습니다.");
	            	return false;
	            } else {
	                alert("예외가 발생했습니다 (code : "+xhr.status+"). 관리자에게 문의하세요.");
	                location.reload();
	            }
	        }
	        ,complete: ItgJs.hideLoading
	    });
	})(jQuery);