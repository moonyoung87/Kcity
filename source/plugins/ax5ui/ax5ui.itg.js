"use strict";

// ax5.ui.uploader
(function () {

    var UI = ax5.ui;
    var U = ax5.util;
    var UPLOADER = void 0;

    UI.addClass({
        className: "uploader",
        version: "1.4.130"
    }, function () {

        var ax5uploader = function ax5uploader() {
            /**
             * @class ax5uploader
             * @classdesc
             * @author tom@axisj.com
             * @example
             * ```js
             *
             * ```
             */
            var self = this,
                cfg = void 0;

            this.instanceId = ax5.getGuid();
            this.config = {
                clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
                theme: 'default', // theme of uploader
                lang: { // 업로더 버튼 랭귀지 설정
                    "upload": "업로드시작",
                    "abort": "취소"
                },
                uploadedBox: {
                    columnKeys: {
                        name: "name",
                        type: "type",
                        size: "size",
                        uploadedName: "uploadedName",
                        uploadedPath: "uploadedPath",
                        downloadCount: "downloadCount",
                        downloadPath: "downloadPath",
                        isImage: "isImage",
                        thumbnail: "thumbnail"
                    }
                },
                animateTime: 100,
                accept: "*/*", // 업로드 선택 파일 타입 설정
                multiple: false, // 다중 파일 업로드
                manualUpload: false, // 업로딩 시작 수동처리 여부
                progressBox: true, // 업로드 프로그래스 박스 사용여부 false 이면 업로드 진행바를 표시 하지 않습니다. 개발자가 onprogress 함수를 이용하여 직접 구현 해야 합니다.
                uploadMode: "upload" // 업로드 모드 upload,download.
            };
            this.defaultBtns = {
                "upload": { label: this.config.lang["upload"], theme: "btn-primary" },
                "abort": { label: this.config.lang["abort"], theme: this.config.theme }
            };

            /// 업로드된 파일 큐
            this.uploadedFiles = [];
            /// 업로더 타겟
            this.$target = null;
            /// 업로드된 파일 정보들의 input 태그를 담아두는 컨테이너
            this.$inputContainer = null;
            /// input hidden 태그
            this.$inputItems = null;
            /// input file 태그
            this.$inputFile = null;
            this.$inputFileForm = null;
            /// 파일 선택버튼
            this.$fileSelector = null;
            /// 파일 드랍존
            this.$dropZone = null;
            /// 파일 목록 표시박스
            this.$uploadedBox = null;

            this.__uploading = false;
            this.selectedFiles = [];
            this.selectedFilesTotal = 0;
            this.__loaded = 0;

            cfg = this.config;

            /**
             * UI 상태변경 이벤트 처리자
             * UI의 상태변경 : open, close, upload 등의 변경사항이 발생되면 onStateChanged 함수를 후출하여 이벤트를 처리
             */
            var bound_onStateChanged = function (that) {

                var state = {
                    "open": function open() {},
                    "close": function close() {},
                    "upload": function upload() {}
                };

                if (cfg.onStateChanged) {
                    cfg.onStateChanged.call(that, that);
                } else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                that = null;
                return true;
            }.bind(this);

            var bound_onSelectFile = function (_evt) {
                var files = void 0;

                if (!ax5.info.supportFileApi) {
                    // file API 지원 안되는 브라우저.
                    // input file에 multiple 지원 안됨 그러므로 단일 파일 처리만 하면 됨.
                    files = { path: _evt.target.value };
                } else if ('dataTransfer' in _evt) {
                    files = _evt.dataTransfer.files;
                } else if ('target' in _evt) {
                    files = _evt.target.files;
                } else if (_evt) {
                    files = _evt;
                }

                if (!files) return false;

                /// selectedFiles에 현재 파일 정보 담아두기
                if ("length" in files) {
                    if (files.length == 1) {
                        this.selectedFiles = [files[0]];
                    } else {
                        this.selectedFiles = U.toArray(files);
                    }
                } else {
                    this.selectedFiles = [files];
                }

                if (cfg.progressBox) {
                    bound_openProgressBox();
                }
                if (!cfg.manualUpload) {
                    this.send();
                }

                if (!ax5.info.supportFileApi) {
                    bound_alignLayout(false);
                }
            }.bind(this);

            var bound_bindEvent = function () {
                this.$fileSelector.off("click.ax5uploader").on("click.ax5uploader", function () {
                	if (ax5.info.supportFileApi) {
                		this.$inputFile.trigger("click");
                	}
                }.bind(this));

                if (!ax5.info.supportFileApi) {
                    this.$fileSelector.off("mouseover.ax5uploader").on("mouseover.ax5uploader", function () {
                        bound_alignLayout(true);
                    }.bind(this));

                    this.$inputFile.off("mouseover.ax5uploader").on("mouseover.ax5uploader", function () {
                        this.$fileSelector.addClass("active");
                    }.bind(this));

                    this.$inputFile.off("mouseout.ax5uploader").on("mouseout.ax5uploader", function () {
                        this.$fileSelector.removeClass("active");

                        bound_alignLayout(false);
                    }.bind(this));
                }

                (function () {
                    if (!this.$uploadedBox || !this.$uploadedBox.get(0)) return false;

                    this.$uploadedBox.on("click", "[data-uploaded-item-cell]", function () {
                        var $this = jQuery(this),
                            cellType = $this.attr("data-uploaded-item-cell"),
                            uploadedItemIndex = Number($this.parents('[data-ax5uploader-uploaded-item]').attr('data-ax5uploader-uploaded-item')),
                            that = {};

                        if (cfg.uploadedBox && cfg.uploadedBox.onclick) {
                            that = {
                                self: self,
                                cellType: cellType,
                                uploadedFiles: self.uploadedFiles,
                                fileIndex: uploadedItemIndex
                            };
                            cfg.uploadedBox.onclick.call(that, that);
                        }

                        $this = null;
                        cellType = null;
                        uploadedItemIndex = null;
                        that = null;
                    });

                    this.$uploadedBox.on("dragstart", function (e) {
                        U.stopEvent(e);
                        return false;
                    });
                }).call(this);

                (function () {
                    // dropZone 설정 방식 변경
                    if (!ax5.info.supportFileApi) return false;
                    if (!this.$dropZone || !this.$dropZone.get(0)) return false;

                    var timer = void 0;

                    this.$dropZone.parent().on("click", "[data-ax5uploader-dropzone]", function (e) {
                        var $target = jQuery(e.target);
                        if ($target.parents('[data-ax5uploader-uploaded-item]').length == 0 && !$target.attr('data-ax5uploader-uploaded-item')) {
                            if (this == e.target || $.contains(this, e.target)) {
                                if (U.isFunction(cfg.dropZone.onclick)) {
                                    cfg.dropZone.onclick.call({
                                        self: self
                                    });
                                } else {
                                    self.$inputFile.trigger("click");
                                }
                            }
                        }
                    });

                    this.$dropZone.get(0).addEventListener('dragover', function (e) {
                        U.stopEvent(e);

                        if (U.isFunction(cfg.dropZone.ondragover)) {
                            cfg.dropZone.ondragover.call({
                                self: self
                            });
                        } else {
                            self.$dropZone.addClass("dragover");
                        }
                    }, false);

                    this.$dropZone.get(0).addEventListener('dragleave', function (e) {
                        U.stopEvent(e);

                        if (U.isFunction(cfg.dropZone.ondragover)) {
                            cfg.dropZone.ondragout.call({
                                self: self
                            });
                        } else {
                            self.$dropZone.removeClass("dragover");
                        }
                    }, false);

                    this.$dropZone.get(0).addEventListener('drop', function (e) {
                        U.stopEvent(e);

                        if (U.isFunction(cfg.dropZone.ondrop)) {
                            cfg.dropZone.ondrop.call({
                                self: self
                            });
                        } else {
                            self.$dropZone.removeClass("dragover");
                        }

                        bound_onSelectFile(e || window.event);
                    }, false);
                }).call(this);
            }.bind(this);

            var bound_alignLayout = function (_TF) {
                // 상황이 좋지 않은경우 (만약 버튼 클릭으로 input file click이 되지 않는 다면 z-index값을 높여서 버튼위를 덮는다.)
                if (_TF) {
                    if (!ax5.info.supportFileApi) {
                        // ie9에서 inputFile을 직접 클릭하지 않으면 submit 오류발생함. submit access denied
                        // 그래서 버튼위에 inputFile을 올려두어야 함. (position값을 이용하면 편하지만..)
                        // 그런데 form을 안에두면 또 다른 이중폼 문제 발생소지 ㅜㅜ 불가피하게 버튼의 offset 값을 이용.
                        var box = this.$fileSelector.offset();
                        box.width = 0;
                        box.height = 0;
                        this.$inputFile.css(box);
                    }
                } else {
                    this.$inputFile.css({
                        left: -1000, top: -1000
                    });
                }
            }.bind(this);

            var bound_alignProgressBox = function (append) {
                var _alignProgressBox = function _alignProgressBox() {
                    var $window = jQuery(window),
                        $body = jQuery(document.body);
                    var pos = {},
                        positionMargin = 6,
                        dim = {},
                        pickerDim = {},
                        pickerDirection = void 0;

                    // cfg.viewport.selector

                    pos = this.$progressBox.parent().get(0) == this.$target.get(0) ? this.$fileSelector.position() : this.$fileSelector.offset();
                    dim = {
                        width: this.$fileSelector.outerWidth(),
                        height: this.$fileSelector.outerHeight()
                    };
                    pickerDim = {
                        winWidth: Math.max($window.width(), $body.width()),
                        winHeight: Math.max($window.height(), $body.height()),
                        width: this.$progressBox.outerWidth(),
                        height: this.$progressBox.outerHeight()
                    };

                    // picker css(width, left, top) & direction 결정
                    if (!cfg.progressBoxDirection || cfg.progressBoxDirection === "" || cfg.progressBoxDirection === "auto") {
                        // set direction
                        pickerDirection = "top";
                        if (pos.top - pickerDim.height - positionMargin < 0) {
                            pickerDirection = "top";
                        } else if (pos.top + dim.height + pickerDim.height + positionMargin > pickerDim.winHeight) {
                            pickerDirection = "bottom";
                        }
                    } else {
                        pickerDirection = cfg.progressBoxDirection;
                    }

                    if (append) {
                        this.$progressBox.addClass("direction-" + pickerDirection);
                    }

                    var positionCSS = function () {
                        var css = { left: 0, top: 0 };
                        switch (pickerDirection) {
                            case "top":
                                css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                css.top = pos.top + dim.height + positionMargin;
                                break;
                            case "bottom":
                                css.left = pos.left + dim.width / 2 - pickerDim.width / 2;
                                css.top = pos.top - pickerDim.height - positionMargin;
                                break;
                            case "left":
                                css.left = pos.left + dim.width + positionMargin;
                                css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                break;
                            case "right":
                                css.left = pos.left - pickerDim.width - positionMargin;
                                css.top = pos.top - pickerDim.height / 2 + dim.height / 2;
                                break;
                        }
                        return css;
                    }();

                    (function () {
                        if (pickerDirection == "top" || pickerDirection == "bottom") {
                            if (positionCSS.left < 0) {
                                positionCSS.left = positionMargin;
                                this.$progressBoxArrow.css({ left: pos.left + dim.width / 2 - positionCSS.left });
                            } else if (positionCSS.left + pickerDim.width > pickerDim.winWidth) {
                                positionCSS.left = pickerDim.winWidth - pickerDim.width - positionMargin;
                                this.$progressBoxArrow.css({ left: pos.left + dim.width / 2 - positionCSS.left });
                            }
                        }
                    }).call(this);

                    this.$progressBox.css(positionCSS);
                };

                this.$progressBox.css({ top: -999 });
                if (append) {
                    // progressBox를 append 할 타겟 엘리먼트 펀단 후 결정.
                    (function () {
                        if (cfg.viewport) {
                            return jQuery(cfg.viewport.selector);
                        } else {
                            return this.$target;
                        }
                    }).call(this).append(this.$progressBox);

                    // progressBox 버튼에 이벤트 연결.
                    this.$progressBox.off("click.ax5uploader").on("click.ax5uploader", "button", function (_evt) {
                        var act = _evt.target.getAttribute("data-pregressbox-btn");
                        var processor = {
                            "upload": function upload() {
                                this.send();
                            },
                            "abort": function abort() {
                                this.abort();
                            }
                        };
                        if (processor[act]) processor[act].call(this);
                    }.bind(this));
                }

                setTimeout(function () {
                    _alignProgressBox.call(this);
                }.bind(this));
            }.bind(this);

            var bound_openProgressBox = function () {
                this.$progressBox.removeClass("destroy");
                this.$progressUpload.removeAttr("disabled");
                this.$progressAbort.removeAttr("disabled");

                // apend & align progress box
                bound_alignProgressBox("append");

                // state change
                bound_onStateChanged({
                    self: this,
                    state: "open"
                });
            }.bind(this);

            var bound_closeProgressBox = function () {
                this.$progressBox.addClass("destroy");
                setTimeout(function () {
                    this.$progressBox.remove();
                }.bind(this), cfg.animateTime);
            }.bind(this);

            var bound_startUpload = function () {

                var processor = {
                    "html5": function html5() {
                    	  if (cfg.debug) console.log("HTML5 Process");
                        var uploadFile = this.selectedFiles.shift();
                        if (!uploadFile) {
                            // 업로드 종료
                            bound_uploadComplete();
                            return this;
                        }

                        if (uploadFile[0]) uploadFile = uploadFile[0];

                        var formData = new FormData();
                        //서버로 전송해야 할 추가 파라미터 정보 설정

                        this.$target.find("input").each(function () {
                            formData.append(this.name, this.value);
                        });
                        // 파일 아이템 추가
                        formData.append(cfg.form.fileName, uploadFile);

                        this.xhr = new XMLHttpRequest();
                        this.xhr.open("post", U.isString(cfg.form.action) ? cfg.form.action : cfg.form.action(), true);
                        this.xhr.onload = function (e) {
                            var res = e.target.response;
                            try {
                                if (typeof res === "string") res = U.parseJson(res);
                            } catch (e) {
                                return false;
                            }
                            var res = res.data;
                            if (cfg.debug) {console.log("response data");console.log(res);}

                            if (res.error) {
                                if (cfg.debug) console.log(res.error);
                                if (U.isFunction(cfg.onuploaderror)) {
                                    cfg.onuploaderror.call({
                                        self: this,
                                        error: res.error
                                    }, res);
                                }
                                self.send();
                                return false;
                            }

                            bound_uploaded(res);
                            self.send();
                        };
                        this.xhr.upload.onprogress = function (e) {
                            // console.log(e.loaded, e.total);
                            bound_updateProgressBar(e);
                            if (U.isFunction(cfg.onprogress)) {
                                cfg.onprogress.call({
                                    loaded: e.loaded,
                                    total: e.total
                                }, e);
                            }
                        };

                        this.xhr.send(formData); // multipart/form-data
                    },
                    "form": function form() {
                    	  if (cfg.debug) console.log("FORM Process");
                        /// i'm busy
                        this.__uploading = true;

                        // 폼과 iframe을 만들어 페이지 아래에 삽입 후 업로드
                        var $iframe = jQuery('<iframe src="javascript:false;" name="ax5uploader-' + this.instanceId + '-iframe" style="display:none;"></iframe>');
                        jQuery(document.body).append($iframe);

                        // onload 이벤트 핸들러
                        // action에서 파일을 받아 처리한 결과값을 텍스트로 출력한다고 가정하고 iframe의 내부 데이터를 결과값으로 callback 호출
                        $iframe.load(function () {
                            var doc = this.contentWindow ? this.contentWindow.document : this.contentDocument ? this.contentDocument : this.document,
                                root = doc.documentElement ? doc.documentElement : doc.body,
                                result = root.textContent ? root.textContent : root.innerText,
                                res = void 0;

                            try {
                                res = JSON.parse(result);
                            } catch (e) {
                                res = {
                                    error: "Syntax error",
                                    body: result
                                };
                            }
                            var res = res.data;
                            if (cfg.debug) {console.log("response data 17287");console.log(res);}
                            if (res.error) {
                                console.log(res);
                            } else {
                                bound_uploaded(res);
                                $iframe.remove();

                                setTimeout(function () {
                                    bound_uploadComplete();
                                }, 300);
                            }
                        });

                        this.$inputFileForm.attr("target", 'ax5uploader-' + this.instanceId + '-iframe').attr("action", cfg.form.action).submit();

                        this.selectedFilesTotal = 1;
                        bound_updateProgressBar({
                            loaded: 1,
                            total: 1
                        });
                    }
                };

                if (this.__uploading === false) {
                    // 전체 파일 사이즈 구하기
                    var filesTotal = 0;
                    this.selectedFiles.forEach(function (n) {
                        filesTotal += n.size;
                    });
                    this.selectedFilesTotal = filesTotal;
                    this.__loaded = 0;

                    this.__uploading = true; // 업로드 시작 상태 처리
                    this.$progressUpload.attr("disabled", "disabled");
                    this.$progressAbort.removeAttr("disabled");
                }

                processor[ax5.info.supportFileApi ? "html5" : "form"].call(this);
            }.bind(this);

            var bound_updateProgressBar = function (e) {
                this.__loaded += e.loaded;
                this.$progressBar.css({ width: U.number(this.__loaded / this.selectedFilesTotal * 100, { round: 2 }) + '%' });
                if (e.lengthComputable) {
                    if (e.loaded >= e.total) {}
                }
            }.bind(this);

            var bound_uploaded = function (res) {
                if (cfg.debug) console.log(res);
                //this.uploadedFiles.push(res);
                this.uploadedFiles = this.uploadedFiles.concat(res);
                bound_repaintUploadedBox(); // 업로드된 파일 출력

                if (U.isFunction(cfg.onuploaded)) {
                    cfg.onuploaded.call({
                        self: this
                    }, res);
                }
            }.bind(this);

            var bound_uploadComplete = function () {
                this.__uploading = false; // 업로드 완료 상태처리
                this.$progressUpload.removeAttr("disabled");
                this.$progressAbort.attr("disabled", "disabled");

                if (cfg.progressBox) {
                    bound_closeProgressBox();
                }
                if (U.isFunction(cfg.onuploadComplete)) {
                    cfg.onuploadComplete.call({
                        self: this
                    });
                }
                // update uploadedFiles display

                /// reset inputFile
                bound_attachFileTag();
            }.bind(this);

            var bound_cancelUpload = function () {

                var processor = {
                    "html5": function html5() {
                        if (this.xhr) {
                            this.xhr.abort();
                        }
                    },
                    "form": function form() {}
                };

                this.__uploading = false; // 업로드 완료 상태처리
                this.$progressUpload.removeAttr("disabled");
                this.$progressAbort.attr("disabled", "disabled");

                processor[ax5.info.supportFileApi ? "html5" : "form"].call(this);

                if (cfg.progressBox) {
                    bound_closeProgressBox();
                }

                //this.$inputFile.val("");
                /// reset inputFile
                bound_attachFileTag();

                if (cfg.debug) console.log("cancelUpload");
                // update uploadedFiles display
            }.bind(this);

            var bound_repaintUploadedBox = function () {
                // uploadedBox 가 없다면 아무일도 하지 않음.
                // onuploaded 함수 이벤트를 이용하여 개발자가 직접 업로드디 박스를 구현 한다고 이해 하자.
                if (this.$uploadedBox === null) return this;

                this.$uploadedBox.html(UPLOADER.tmpl.get("upoadedBox", {
                    uploadedFiles: this.uploadedFiles,
                    icon: cfg.uploadedBox.icon,
                    lang: cfg.uploadedBox.lang,
                    supportFileApi: !!ax5.info.supportFileApi
                }, cfg.uploadedBox.columnKeys));
                this.$uploadedBox.find("img").on("error", function () {
                    //this.src = "";
                    $(this).parent().addClass("no-image");
                });
            }.bind(this);

            var bound_attachFileTag = function () {
            	if (this.$inputItems && this.$inputItems.get(0)) {
            		if (cfg.debug) console.log("$inputItems Exist.");
            		//this.$inputItems.remove();
            	}else{
            		if (cfg.debug) console.log("$inputItems Not Exist.");
                    this.$inputItems = jQuery(UPLOADER.tmpl.get.call(this, "inputItems", {
                    	fileName: cfg.form.fileName,
                    	fileIdName: cfg.form.fileIdName,
                    	fileIdValue: cfg.form.fileIdValue,
                    	fileTypes: cfg.form.fileTypes,
                    	maxFileSize: cfg.form.maxFileSize,
                    	maxFileCount: cfg.form.maxFileCount,
                    	useSecurity: cfg.form.useSecurity,
                    	uploadMode: cfg.form.uploadMode
                    }));
            	}
                if (this.$inputFile && this.$inputFile.get(0)) {
                    this.$inputFile.remove();
                }
                if (this.$inputFileForm && this.$inputFileForm.get(0)) {
                    this.$inputFileForm.remove();
                }

                this.$inputFile = jQuery(UPLOADER.tmpl.get.call(this, "inputFile", {
                    instanceId: this.instanceId,
                    multiple: cfg.multiple,
                    accept: cfg.accept,
                    name: cfg.form.fileName
                }));

                if (ax5.info.supportFileApi) {
                    jQuery(document.body).append(this.$inputFile);
                } else {
                    this.$fileSelector.attr("tabindex", -1);
                    this.$inputFileForm = jQuery(UPLOADER.tmpl.get.call(this, "inputFileForm", {
                        instanceId: this.instanceId
                    }));
                    if (cfg.debug) {console.log("this.$inputItems : "); console.log(this.$inputItems);}
                    this.$inputFileForm.append(this.$inputFile);
                    this.$inputFileForm.append(this.$inputItems);
                    jQuery(document.body).append(this.$inputFileForm);
                }

                this.$inputFile.off("change.ax5uploader").on("change.ax5uploader", function (_evt) {
                    bound_onSelectFile(_evt);
                }.bind(this));
            }.bind(this);

            /**
             * Preferences of uploader UI
             * @method ax5uploader.setConfig
             * @param {Object} _config - 클래스 속성값
             * @param {Element} _config.target
             * @param {Object} _config.form
             * @param {String} _config.form.action - upload URL
             * @param {String} _config.form.fileName - The name key of the upload file
             * @param {Boolean} [_config.multiple=false] - Whether multiple files. In a browser where fileApi is not supported (eg IE9), it only works with false.
             * @param {String} [_config.accept=""] - accept mimeType (http://www.w3schools.com/TAgs/att_input_accept.asp)
             * @param {Boolean} [_config.manualUpload=false] - Whether to automatically upload when a file is selected.
             * @param {Boolean} [_config.progressBox=true] - Whether to use progressBox
             * @param {String} [_config.progressBoxDirection=auto] - ProgressBox display direction
             * @param {Object} [_config.dropZone]
             * @param {Element} [_config.dropZone.target]
             * @param {Function} [_config.dropZone.onclick]
             * @param {Function} [_config.dropZone.ondragover]
             * @param {Function} [_config.dropZone.ondragout]
             * @param {Function} [_config.dropZone.ondrop]
             * @param {Object} [_config.uploadedBox]
             * @param {Element} [_config.uploadedBox.target]
             * @param {Element} [_config.uploadedBox.icon]
             * @param {Object} [_config.uploadedBox.columnKeys]
             * @param {String} [_config.uploadedBox.columnKeys.name]
             * @param {String} [_config.uploadedBox.columnKeys.type]
             * @param {String} [_config.uploadedBox.columnKeys.size]
             * @param {String} [_config.uploadedBox.columnKeys.uploadedName]
             * @param {String} [_config.uploadedBox.columnKeys.downloadPath]
             * @param {Object} [_config.uploadedBox.lang]
             * @param {String} [_config.uploadedBox.lang.supportedHTML5_emptyListMsg]
             * @param {String} [_config.uploadedBox.lang.emptyListMsg]
             * @param {Function} [_config.uploadedBox.onchange]
             * @param {Function} [_config.uploadedBox.onclick]
             * @param {Function} [_config.validateSelectedFiles]
             * @param {Function} [_config.onprogress] - return loaded, total
             * @param {Function} [_config.onuploaded] - return self
             * @param {Function} [_config.onuploaderror] - return self, error
             * @param {Function} [_config.onuploadComplete] - return self
             * @returns {ax5uploader}
             * @example
             * ```js
             *
             * ```
             */
            this.init = function (_config) {
                cfg = jQuery.extend(true, {}, cfg, _config);
                if (!cfg.target) {
                    console.log(ax5.info.getError("ax5uploader", "401", "init"));
                    return this;
                }

                this.$target = jQuery(cfg.target);

                // 파일 드랍존은 옵션 사항.
                if (cfg.dropZone && cfg.dropZone.target && ax5.info.supportFileApi) {
                    this.$dropZone = jQuery(cfg.dropZone.target);
                    this.$dropZone.attr("data-ax5uploader-dropzone", this.instanceId);
                }

                // uploadedBox 옵션 사항
                if (cfg.uploadedBox && cfg.uploadedBox.target) {
                    this.$uploadedBox = jQuery(cfg.uploadedBox.target);
                }

                // target attribute data
                (function (data) {
                    if (U.isObject(data) && !data.error) {
                        cfg = jQuery.extend(true, cfg, data);
                    }
                }).call(this, U.parseJson(this.$target.attr("data-ax5uploader-config"), true));

                // detect element
                /// fileSelector 수집
                this.$fileSelector = this.$target.find('[data-ax5uploader-button="selector"]');

                if (this.$fileSelector.length === 0) {
                    console.log(ax5.info.getError("ax5uploader", "402", "can not find file selector"));
                    return this;
                }

                // input file 추가
                bound_attachFileTag();

                // btns 확인
                cfg.btns = jQuery.extend({}, this.defaultBtns, cfg.btns);

                this.$progressBox = jQuery(UPLOADER.tmpl.get.call(this, "progressBox", {
                    instanceId: this.instanceId,
                    btns: cfg.btns
                }));
                this.$progressBar = this.$progressBox.find('[role="progressbar"]');
                this.$progressBoxArrow = this.$progressBox.find(".ax-progressbox-arrow");
                this.$progressUpload = this.$progressBox.find('[data-pregressbox-btn="upload"]');
                this.$progressAbort = this.$progressBox.find('[data-pregressbox-btn="abort"]');

                // file API가 지원되지 않는 브라우저는 중지 기능 제공 못함.
                if (!ax5.info.supportFileApi) {
                    this.$progressAbort.hide();
                }
                // 파일버튼 등에 이벤트 연결.
                bound_bindEvent();

                bound_repaintUploadedBox();
                return this;
            };

            /**
             * @method ax5uploader.send
             * @returns {ax5uploader}
             *
             */
            this.send = function () {
                return function () {
                    // 업로드 시작
                    if (this.selectedFiles.length && U.isFunction(cfg.validateSelectedFiles)) {
                        var that = {
                            self: this,
                            uploadedFiles: this.uploadedFiles,
                            selectedFiles: this.selectedFiles
                        };
                        if (!cfg.validateSelectedFiles.call(that, that)) {
                            bound_cancelUpload();
                            return false;
                            // 전송처리 안함.
                        }
                    }

                    bound_startUpload();
                    return this;
                };
            }();

            /**
             * @method ax5uploader.abort
             * @returns {ax5uploader}
             */
            this.abort = function () {
                return function () {
                    if (!ax5.info.supportFileApi) {
                        alert("This browser not supported abort method");
                        return this;
                    }
                    bound_cancelUpload();
                    return this;
                };
            }();

            /**
             * @method ax5uploader.setUploadedFiles
             * @param {Array} _files - JSON formatting can all be overridden in columnKeys.
             * @returns {ax5uploader}
             * @example
             * ```js
             * var upload1 = new ax5.ui.uploader();
             * upload1.setConfig({
             *  ...
             * });
             *
             *
             * $.ajax({
             *     url: "api/fileListLoad.php",
             *     success: function (res) {
             *         // res JSON format
             *         // [{
             *         // "name": "barcode-scan-ani.gif",
             *         // "saveName": "barcode-scan-ani.gif",
             *         // "type": "file",
             *         // "fileSize": "3891664",
             *         // "uploadedPath": "/ax5ui-uploader/test/api/files",
             *         // "thumbUrl": ""
             *         // }]
             *         upload1.setUploadedFiles(res);
             *     }
             * });
             * ```
             */
            this.setUploadedFiles = function (_files) {
                if (U.isArray(_files)) {
                    this.uploadedFiles = _files;
                }
                if (U.isString(_files)) {
                    try {
                        this.uploadedFiles = JSON.parse(_files);
                    } catch (e) {}
                }

                bound_repaintUploadedBox();
                return this;
            };

            /**
             * clear uploadedFiles
             * @method ax5uploader.clear
             * @returns {ax5uploader}
             */
            this.clear = function () {
                this.setUploadedFiles([]);
                return this;
            };

            /**
             * Removes the object corresponding to the index passed to the argument from uploadedFiles.
             * @method ax5uploader.removeFile
             * @param {Number} _index
             * @returns {ax5uploader}
             * @example
             * ```js
             * // The actual file is not deleted
             * upload1.removeFile(fileIndex);
             * ```
             */
            this.removeFile = function (_index) {
                if (!isNaN(Number(_index))) {
                    this.uploadedFiles.splice(_index, 1);
                }
                bound_repaintUploadedBox();
                return this;
            };

            /**
             * Change File By Down
             * itgood
             * ```
             */
            this.swapFileUp = function (_index) {
            	if (!isNaN(Number(_index))) {
            		var tempfile = this.uploadedFiles[_index];
            		this.uploadedFiles[_index] = this.uploadedFiles[_index-1];
            		this.uploadedFiles[_index-1] = tempfile;
            	}
            	bound_repaintUploadedBox();
            	return this;
            };

            /**
             * Change File By Down
             * itgood
             * ```
             */
            this.swapFileDown = function (_index) {
            	if (!isNaN(Number(_index))) {
            		var tempfile = this.uploadedFiles[_index];
                	this.uploadedFiles[_index] = this.uploadedFiles[_index+1];
                	this.uploadedFiles[_index+1] = tempfile;
            	}
            	bound_repaintUploadedBox();
            	return this;
            };

            /**
             * Empty uploadedFiles
             * @method ax5uploader.removeFileAll
             * @returns {ax5uploader}
             * @example
             * ```js
             *
             * ```
             */
            this.removeFileAll = function () {
                this.uploadedFiles = [];
                bound_repaintUploadedBox();
                return this;
            };

            /**
             * @method ax5uploader.selectFile
             * @returns {Boolean}
             */
            this.selectFile = function () {
                if (ax5.info.supportFileApi) {
                    this.$inputFile.trigger("click");
                    return true;
                }
                return false;
            };

            // 클래스 생성자
            this.main = function () {
                UI.uploader_instance = UI.uploader_instance || [];
                UI.uploader_instance.push(this);

                if (arguments && U.isObject(arguments[0])) {
                    this.setConfig(arguments[0]);
                } else {
                    //this.init();
                }
            }.apply(this, arguments);
        };
        return ax5uploader;
    }());

    UPLOADER = ax5.ui.uploader;
})();
// ax5.ui.uploader.tmpl
(function () {

    var UPLOADER = ax5.ui.uploader;

    var uploadProgress = function uploadProgress(columnKeys) {
        return "\n        ";
    };

    var inputItems = function inputItems(columnKeys) {
    	var returnStr   = '<input type="hidden" name="fileName" value="{{fileName}}"/>'
    					+ '<input type="hidden" name="fileIdName" value="{{fileIdName}}"/>'
    					+ '<input type="hidden" name="{{fileIdName}}" value="{{fileIdValue}}"/>'
    					+ '<input type="hidden" name="accept" value="{{fileTypes}}"/>'
    					+ '<input type="hidden" name="maxFileSize" value="{{maxFileSize}}"/>'
    					+ '<input type="hidden" name="maxFileCount" value="{{maxFileCount}}"/>'
    					+ '<input type="hidden" name="useSecurity" value="{{useSecurity}}"/>'
    					+ '<input type="hidden" name="uploadMode" value="{{uploadMode}}"/>';
    	return returnStr;
    };

    var inputFile = function inputFile(columnKeys) {
        return '<input type="file" id="inputFile{{name}}" data-ax5uploader-input="{{instanceId}}" name="{{name}}" {{#multiple}}multiple{{/multiple}} accept="{{accept}}"/>';
    };

    var inputFileForm = function inputFileForm(columnKeys) {
        return "<form data-ax5uploader-form=\"{{instanceId}}\" name=\"ax5uploader-{{instanceId}}-form\" method=\"post\" enctype=\"multipart/form-data\"></form>";
    };

    var progressBox = function progressBox(columnKeys) {
        return "\n<div data-ax5uploader-progressbox=\"{{instanceId}}\" class=\"{{theme}}\">\n    <div class=\"ax-progressbox-body\">\n        <div class=\"ax-pregressbox-content\">\n            <div class=\"progress\">\n              <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" style=\"width: 0\">\n                <span class=\"sr-only\">0% Complete</span>\n              </div>\n            </div>\n        </div>\n        {{#btns}}\n            <div class=\"ax-progressbox-buttons\">\n            {{#btns}}\n                {{#@each}}\n                <button data-pregressbox-btn=\"{{@key}}\" class=\"btn btn-default {{@value.theme}}\">{{@value.label}}</button>\n                {{/@each}}\n            {{/btns}}\n            </div>\n        {{/btns}}\n    </div>\n    <div class=\"ax-progressbox-arrow\"></div>\n</div>\n";
    };

    var upoadedBox = function upoadedBox(columnKeys) {
      //return '\n{{#uploadedFiles}}<div data-ax5uploader-uploaded-item="{{@i}}">\n    <div class="uploaded-item-preview">\n        {{#' + columnKeys.thumbnail + '}}<img src="' + columnKeys.apiServerUrl + '{{' + columnKeys.thumbnail + '}}">{{/' + columnKeys.thumbnail + '}}\n    </div>\n    <div class="uploaded-item-holder">\n<span class="file-txt">첨부 파일</span> \n <div class="uploaded-item-cell" data-uploaded-item-cell="filename"><span class="file-name">{{' + columnKeys.name + '}}</span></div>\n	<div class="uploaded-item-cell" data-uploaded-item-cell="filesize">({{#@fn_get_byte}}{{' + columnKeys.size + '}}{{/@fn_get_byte}})</div>\n <div class="uploaded-item-cell" data-uploaded-item-cell="download" title="파일다운"><span class="ico_dnld"></span> {{{icon.download}}} </div>\n   <div class="uploaded-item-cell" data-uploaded-item-cell="delete" title="파일삭제">{{{icon.delete}}}</div> <div class="uploaded-item-cell" data-uploaded-item-cell="arrowup" title="순서위로">{{{icon.arrowup}}}</div>  <div class="uploaded-item-cell" data-uploaded-item-cell="arrowdown" title="순서아래로">{{{icon.arrowdown}}}</div>\n  <div class="uploaded-item-cell" data-uploaded-item-cell="previewUrl" title="이미지URL">URL</div>\n    </div>\n</div>{{/uploadedFiles}}\n{{^uploadedFiles}}\n{{#supportFileApi}}{{{lang.supportedHTML5_emptyListMsg}}}{{/supportFileApi}}\n{{^supportFileApi}}{{{lang.emptyListMsg}}}{{/supportFileApi}}\n{{/uploadedFiles}}\n';
    	return '\n{{#uploadedFiles}}<span data-ax5uploader-uploaded-item="{{@i}}">\n <span class="uploaded-item-holder">\n<span class="uploaded-item-cell attach-file" data-uploaded-item-cell="filename">	<li><a href="#none" id="DownFile">{{' + columnKeys.name + '}}</a></li></span>\n</span>\n</span>{{/uploadedFiles}}\n{{^uploadedFiles}}\n{{#supportFileApi}}{{{lang.supportedHTML5_emptyListMsg}}}{{/supportFileApi}}\n{{^supportFileApi}}{{{lang.emptyListMsg}}}{{/supportFileApi}}\n{{/uploadedFiles}}\n';
    	};

    UPLOADER.tmpl = {
        "uploadProgress": uploadProgress,
        "inputItems": inputItems,
        "inputFile": inputFile,
        "inputFileForm": inputFileForm,
        "progressBox": progressBox,
        "upoadedBox": upoadedBox,

        get: function get(tmplName, data, columnKeys) {
            data["@fn_get_byte"] = function () {
                return function (text, render) {
                    return ax5.util.number(render(text), { round: 2, byte: true });
                };
            };
            return ax5.mustache.render(UPLOADER.tmpl[tmplName].call(this, columnKeys), data);
        }
    };
})();

//ax5.ui.modal
(function () {
  var UI = ax5.ui;
  var U = ax5.util;
  var MODAL = void 0;

  UI.addClass({
    className: "modal"
  }, function () {
    /**
     * @class ax5modal
     * @alias ax5.ui.modal
     * @author tom@axisj.com
     */
    return function () {
      var self = this,
          cfg = void 0,
          ENM = {
        mousedown: "mousedown",
        mousemove: "mousemove",
        mouseup: "mouseup"
      },
          getMousePosition = function getMousePosition(e) {
        var mouseObj = e;
        if ("changedTouches" in e && e.changedTouches) {
          mouseObj = e.changedTouches[0];
        }
        return {
          clientX: mouseObj.clientX,
          clientY: mouseObj.clientY
        };
      };

      this.instanceId = ax5.getGuid();
      this.config = {
        id: "ax5-modal-" + this.instanceId,
        position: {
          left: "center",
          top: "middle",
          margin: 10
        },
        minimizePosition: "bottom-right",
        clickEventName: "ontouchstart" in document.documentElement ? "touchstart" : "click",
        theme: "default",
        width: 300,
        height: 400,
        closeToEsc: true,
        disableDrag: false,
        disableResize: false,
        animateTime: 250,
        iframe: false
      };
      this.activeModal = null;
      this.watingModal = false;
      this.$ = {}; // UI inside of the jQuery object store

      cfg = this.config; // extended config copy cfg

      var onStateChanged = function onStateChanged(opts, that) {
        var eventProcessor = {
          resize: function resize(that) {
            if (opts && opts.onResize) {
              opts.onResize.call(that, that);
            } else if (this.onResize) {
              this.onResize.call(that, that);
            }
          },
          move: function move() {}
        };
        if (that.state in eventProcessor) {
          eventProcessor[that.state].call(this, that);
        }

        if (opts && opts.onStateChanged) {
          opts.onStateChanged.call(that, that);
        } else if (this.onStateChanged) {
          this.onStateChanged.call(that, that);
        }
        return true;
      },
          getContent = function getContent(modalId, opts) {
        var data = {
          modalId: modalId,
          theme: opts.theme,
          header: opts.header,
          fullScreen: opts.fullScreen ? "fullscreen" : "",
          styles: "",
          iframe: opts.iframe,
          iframeLoadingMsg: opts.iframeLoadingMsg,
          disableResize: opts.disableResize
        };

        if (opts.zIndex) {
          data.styles += "z-index:" + opts.zIndex + ";";
        }
        if (opts.absolute) {
          data.styles += "position:absolute;";
        }

        if (data.iframe && typeof data.iframe.param === "string") {
          data.iframe.param = ax5.util.param(data.iframe.param);
        }

        return MODAL.tmpl.get.call(this, "content", data, {});
      },
          open = function open(opts, callback) {
        var that = void 0;
        jQuery(document.body).append(getContent.call(this, opts.id, opts));

        this.activeModal = jQuery("#" + opts.id);
        // 파트수집
        this.$ = {
          root: this.activeModal,
          header: this.activeModal.find('[data-modal-els="header"]'),
          body: this.activeModal.find('[data-modal-els="body"]')
        };

        if (opts.iframe) {
          this.$["iframe-wrap"] = this.activeModal.find('[data-modal-els="iframe-wrap"]');
          this.$["iframe"] = this.activeModal.find('[data-modal-els="iframe"]');
          this.$["iframe-form"] = this.activeModal.find('[data-modal-els="iframe-form"]');
          this.$["iframe-loading"] = this.activeModal.find('[data-modal-els="iframe-loading"]');
        } else {
          this.$["body-frame"] = this.activeModal.find('[data-modal-els="body-frame"]');
        }

        //- position 정렬
        this.align();

        that = {
          self: this,
          id: opts.id,
          theme: opts.theme,
          width: opts.width,
          height: opts.height,
          state: "open",
          $: this.$
        };

        if (opts.iframe) {
          this.$["iframe-wrap"].css({ height: opts.height });
          this.$["iframe"].css({ height: opts.height });

          // iframe content load
          this.$["iframe-form"].attr({ method: opts.iframe.method });
          this.$["iframe-form"].attr({ target: opts.id + "-frame" });
          this.$["iframe-form"].attr({ action: opts.iframe.url });
          this.$["iframe"].on("load", function () {
            that.state = "load";
            if (opts.iframeLoadingMsg) {
              this.$["iframe-loading"].hide();
            }
            onStateChanged.call(this, opts, that);
          }.bind(this));
          if (!opts.iframeLoadingMsg) {
            this.$["iframe"].show();
          }
          this.$["iframe-form"].submit();
        }

        if (callback) callback.call(that, that);

        if (!this.watingModal) {
          onStateChanged.call(this, opts, that);
        }

        // bind key event
        if (opts.closeToEsc) {
          jQuery(window).bind("keydown.ax-modal", function (e) {
            onkeyup.call(this, e || window.event);
          }.bind(this));
        }

        jQuery(window).bind("resize.ax-modal", function (e) {
          this.align(null, e || window.event);
        }.bind(this));

        this.$.header.off(ENM["mousedown"]).off("dragstart").on(ENM["mousedown"], function (e) {
          /// 이벤트 필터링 추가 : 버튼엘리먼트로 부터 발생된 이벤트이면 moveModal 시작하지 않도록 필터링
          var isButton = U.findParentNode(e.target, function (_target) {
            if (_target.getAttribute("data-modal-header-btn")) {
              return true;
            }
          });

          if (!opts.isFullScreen && !isButton && opts.disableDrag != true) {
            self.mousePosition = getMousePosition(e);
            moveModal.on.call(self);
          }
          if (isButton) {
            btnOnClick.call(self, e || window.event, opts);
          }
        }).on("dragstart", function (e) {
          U.stopEvent(e.originalEvent);
          return false;
        });

        this.activeModal.off(ENM["mousedown"]).off("dragstart").on(ENM["mousedown"], "[data-ax5modal-resizer]", function (e) {
          if (opts.disableDrag || opts.isFullScreen) return false;
          self.mousePosition = getMousePosition(e);
          resizeModal.on.call(self, this.getAttribute("data-ax5modal-resizer"));
        }).on("dragstart", function (e) {
          U.stopEvent(e.originalEvent);
          return false;
        });
      },
          btnOnClick = function btnOnClick(e, opts, callback, target, k) {
        var that = void 0;
        if (e.srcElement) e.target = e.srcElement;

        target = U.findParentNode(e.target, function (target) {
          if (target.getAttribute("data-modal-header-btn")) {
            return true;
          }
        });

        if (target) {
          k = target.getAttribute("data-modal-header-btn");

          that = {
            self: this,
            key: k,
            value: opts.header.btns[k],
            dialogId: opts.id,
            btnTarget: target
          };

          if (opts.header.btns[k].onClick) {
            opts.header.btns[k].onClick.call(that, k);
          }
        }

        that = null;
        opts = null;
        callback = null;
        target = null;
        k = null;
      },
          onkeyup = function onkeyup(e) {
        if (e.keyCode == ax5.info.eventKeys.ESC) {
          this.close();
        }
      },
          alignProcessor = {
        "top-left": function topLeft() {
          this.align({ left: "left", top: "top" });
        },
        "top-right": function topRight() {
          this.align({ left: "right", top: "top" });
        },
        "bottom-left": function bottomLeft() {
          this.align({ left: "left", top: "bottom" });
        },
        "bottom-right": function bottomRight() {
          this.align({ left: "right", top: "bottom" });
        },
        "center-middle": function centerMiddle() {
          this.align({ left: "center", top: "middle" });
        }
      },
          moveModal = {
        on: function on() {
          var modalZIndex = this.activeModal.css("z-index"),
              modalOffset = this.activeModal.offset(),
              modalBox = {
            width: this.activeModal.outerWidth(),
            height: this.activeModal.outerHeight()
          },
              windowBox = {
            width: jQuery(window).width(),
            height: jQuery(window).height(),
            scrollLeft: jQuery(document).scrollLeft(),
            scrollTop: jQuery(document).scrollTop()
          },
              getResizerPosition = function getResizerPosition(e) {
            self.__dx = e.clientX - self.mousePosition.clientX;
            self.__dy = e.clientY - self.mousePosition.clientY;

            /*
            if (minX > modalOffset.left + self.__dx) {
              self.__dx = -modalOffset.left;
            } else if (maxX < modalOffset.left + self.__dx) {
              self.__dx = maxX - modalOffset.left;
            }
             if (minY > modalOffset.top + self.__dy) {
              self.__dy = -modalOffset.top;
            } else if (maxY < modalOffset.top + self.__dy) {
              self.__dy = maxY - modalOffset.top;
            }
              */

            return {
              left: modalOffset.left + self.__dx,
              top: modalOffset.top + self.__dy
            };
          };

          var minX = 0,
              maxX = windowBox.width - modalBox.width,
              minY = 0,
              maxY = windowBox.height - modalBox.height;

          self.__dx = 0; // 변화량 X
          self.__dy = 0; // 변화량 Y

          // self.resizerBg : body 가 window보다 작을 때 문제 해결을 위한 DIV
          self.resizerBg = jQuery('<div class="ax5modal-resizer-background" ondragstart="return false;"></div>');
          self.resizer = jQuery('<div class="ax5modal-resizer" ondragstart="return false;"></div>');
          self.resizerBg.css({ zIndex: modalZIndex });
          self.resizer.css({
            left: modalOffset.left,
            top: modalOffset.top,
            width: modalBox.width,
            height: modalBox.height,
            zIndex: modalZIndex + 1
          });

          jQuery(document.body).append(self.resizerBg).append(self.resizer);

          self.activeModal.addClass("draged");

          jQuery(document.body).on(ENM["mousemove"] + ".ax5modal-move-" + this.instanceId, function (e) {
            self.resizer.css(getResizerPosition(e));
          }).on(ENM["mouseup"] + ".ax5modal-move-" + this.instanceId, function (e) {
            moveModal.off.call(self);
          }).on("mouseleave.ax5modal-move-" + this.instanceId, function (e) {
            moveModal.off.call(self);
          });

          jQuery(document.body).attr("unselectable", "on").css("user-select", "none").on("selectstart", false);
        },
        off: function off() {
          var setModalPosition = function setModalPosition() {
            var box = this.resizer.offset();
            if (!this.modalConfig.absolute) {
              box.left -= jQuery(document).scrollLeft();
              box.top -= jQuery(document).scrollTop();
            }
            this.activeModal.css(box);
            this.modalConfig.left = box.left;
            this.modalConfig.top = box.top;

            box = null;
          };

          this.activeModal.removeClass("draged");
          setModalPosition.call(this);

          this.resizer.remove();
          this.resizer = null;
          this.resizerBg.remove();
          this.resizerBg = null;
          //this.align();

          jQuery(document.body).off(ENM["mousemove"] + ".ax5modal-move-" + this.instanceId).off(ENM["mouseup"] + ".ax5modal-move-" + this.instanceId).off("mouseleave.ax5modal-move-" + this.instanceId);

          jQuery(document.body).removeAttr("unselectable").css("user-select", "auto").off("selectstart");

          onStateChanged.call(this, self.modalConfig, {
            self: this,
            state: "move"
          });
        }
      },
          resizeModal = {
        on: function on(resizerType) {
          var modalZIndex = this.activeModal.css("z-index"),
              modalOffset = this.activeModal.offset(),
              modalBox = {
            width: this.activeModal.outerWidth(),
            height: this.activeModal.outerHeight()
          },
              windowBox = {
            width: jQuery(window).width(),
            height: jQuery(window).height(),
            scrollLeft: jQuery(document).scrollLeft(),
            scrollTop: jQuery(document).scrollTop()
          },
              resizerProcessor = {
            top: function top(e) {
              if (minHeight > modalBox.height - self.__dy) {
                self.__dy = modalBox.height - minHeight;
              }

              if (e.shiftKey) {
                if (minHeight > modalBox.height - self.__dy * 2) {
                  self.__dy = (modalBox.height - minHeight) / 2;
                }

                return {
                  left: modalOffset.left,
                  top: modalOffset.top + self.__dy,
                  width: modalBox.width,
                  height: modalBox.height - self.__dy * 2
                };
              } else if (e.altKey) {
                if (minHeight > modalBox.height - self.__dy * 2) {
                  self.__dy = (modalBox.height - minHeight) / 2;
                }

                return {
                  left: modalOffset.left + self.__dy,
                  top: modalOffset.top + self.__dy,
                  width: modalBox.width - self.__dy * 2,
                  height: modalBox.height - self.__dy * 2
                };
              } else {
                return {
                  left: modalOffset.left,
                  top: modalOffset.top + self.__dy,
                  width: modalBox.width,
                  height: modalBox.height - self.__dy
                };
              }
            },
            bottom: function bottom(e) {
              if (minHeight > modalBox.height + self.__dy) {
                self.__dy = -modalBox.height + minHeight;
              }

              if (e.shiftKey) {
                if (minHeight > modalBox.height + self.__dy * 2) {
                  self.__dy = (-modalBox.height + minHeight) / 2;
                }

                return {
                  left: modalOffset.left,
                  top: modalOffset.top - self.__dy,
                  width: modalBox.width,
                  height: modalBox.height + self.__dy * 2
                };
              } else if (e.altKey) {
                if (minHeight > modalBox.height + self.__dy * 2) {
                  self.__dy = (-modalBox.height + minHeight) / 2;
                }

                return {
                  left: modalOffset.left - self.__dy,
                  top: modalOffset.top - self.__dy,
                  width: modalBox.width + self.__dy * 2,
                  height: modalBox.height + self.__dy * 2
                };
              } else {
                return {
                  left: modalOffset.left,
                  top: modalOffset.top,
                  width: modalBox.width,
                  height: modalBox.height + self.__dy
                };
              }
            },
            left: function left(e) {
              if (minWidth > modalBox.width - self.__dx) {
                self.__dx = modalBox.width - minWidth;
              }

              if (e.shiftKey) {
                if (minWidth > modalBox.width - self.__dx * 2) {
                  self.__dx = (modalBox.width - minWidth) / 2;
                }

                return {
                  left: modalOffset.left + self.__dx,
                  top: modalOffset.top,
                  width: modalBox.width - self.__dx * 2,
                  height: modalBox.height
                };
              } else if (e.altKey) {
                if (minWidth > modalBox.width - self.__dx * 2) {
                  self.__dx = (modalBox.width - minWidth) / 2;
                }

                return {
                  left: modalOffset.left + self.__dx,
                  top: modalOffset.top + self.__dx,
                  width: modalBox.width - self.__dx * 2,
                  height: modalBox.height - self.__dx * 2
                };
              } else {
                return {
                  left: modalOffset.left + self.__dx,
                  top: modalOffset.top,
                  width: modalBox.width - self.__dx,
                  height: modalBox.height
                };
              }
            },
            right: function right(e) {
              if (minWidth > modalBox.width + self.__dx) {
                self.__dx = -modalBox.width + minWidth;
              }

              if (e.shiftKey) {
                if (minWidth > modalBox.width + self.__dx * 2) {
                  self.__dx = (-modalBox.width + minWidth) / 2;
                }

                return {
                  left: modalOffset.left - self.__dx,
                  top: modalOffset.top,
                  width: modalBox.width + self.__dx * 2,
                  height: modalBox.height
                };
              } else if (e.altKey) {
                if (minWidth > modalBox.width + self.__dx * 2) {
                  self.__dx = (-modalBox.width + minWidth) / 2;
                }

                return {
                  left: modalOffset.left - self.__dx,
                  top: modalOffset.top - self.__dx,
                  width: modalBox.width + self.__dx * 2,
                  height: modalBox.height + self.__dx * 2
                };
              } else {
                return {
                  left: modalOffset.left,
                  top: modalOffset.top,
                  width: modalBox.width + self.__dx,
                  height: modalBox.height
                };
              }
            },
            "top-left": function topLeft(e) {
              if (minWidth > modalBox.width - self.__dx) {
                self.__dx = modalBox.width - minWidth;
              }

              if (minHeight > modalBox.height - self.__dy) {
                self.__dy = modalBox.height - minHeight;
              }

              if (e.shiftKey || e.altKey) {
                if (minHeight > modalBox.height - self.__dy * 2) {
                  self.__dy = (modalBox.height - minHeight) / 2;
                }
                if (minWidth > modalBox.width - self.__dx * 2) {
                  self.__dx = (modalBox.width - minWidth) / 2;
                }

                return {
                  left: modalOffset.left + self.__dx,
                  top: modalOffset.top + self.__dy,
                  width: modalBox.width - self.__dx * 2,
                  height: modalBox.height - self.__dy * 2
                };
              } else {
                if (minHeight > modalBox.height - self.__dy * 2) {
                  self.__dy = (modalBox.height - minHeight) / 2;
                }
                if (minWidth > modalBox.width - self.__dx * 2) {
                  self.__dx = (modalBox.width - minWidth) / 2;
                }

                return {
                  left: modalOffset.left + self.__dx,
                  top: modalOffset.top + self.__dy,
                  width: modalBox.width - self.__dx,
                  height: modalBox.height - self.__dy
                };
              }
            },
            "top-right": function topRight(e) {
              if (minWidth > modalBox.width + self.__dx) {
                self.__dx = -modalBox.width + minWidth;
              }

              if (minHeight > modalBox.height - self.__dy) {
                self.__dy = modalBox.height - minHeight;
              }

              if (e.shiftKey || e.altKey) {
                if (minHeight > modalBox.height - self.__dy * 2) {
                  self.__dy = (modalBox.height - minHeight) / 2;
                }
                if (minWidth > modalBox.width + self.__dx * 2) {
                  self.__dx = (-modalBox.width + minWidth) / 2;
                }

                return {
                  left: modalOffset.left - self.__dx,
                  top: modalOffset.top + self.__dy,
                  width: modalBox.width + self.__dx * 2,
                  height: modalBox.height - self.__dy * 2
                };
              } else {
                return {
                  left: modalOffset.left,
                  top: modalOffset.top + self.__dy,
                  width: modalBox.width + self.__dx,
                  height: modalBox.height - self.__dy
                };
              }
            },
            "bottom-left": function bottomLeft(e) {
              if (minWidth > modalBox.width - self.__dx) {
                self.__dx = modalBox.width - minWidth;
              }

              if (minHeight > modalBox.height + self.__dy) {
                self.__dy = -modalBox.height + minHeight;
              }

              if (e.shiftKey || e.altKey) {
                if (minWidth > modalBox.width - self.__dx * 2) {
                  self.__dx = (modalBox.width - minWidth) / 2;
                }
                if (minHeight > modalBox.height + self.__dy * 2) {
                  self.__dy = (-modalBox.height + minHeight) / 2;
                }
                return {
                  left: modalOffset.left + self.__dx,
                  top: modalOffset.top - self.__dy,
                  width: modalBox.width - self.__dx * 2,
                  height: modalBox.height + self.__dy * 2
                };
              } else {
                return {
                  left: modalOffset.left + self.__dx,
                  top: modalOffset.top,
                  width: modalBox.width - self.__dx,
                  height: modalBox.height + self.__dy
                };
              }
            },
            "bottom-right": function bottomRight(e) {
              if (minWidth > modalBox.width + self.__dx) {
                self.__dx = -modalBox.width + minWidth;
              }

              if (minHeight > modalBox.height + self.__dy) {
                self.__dy = -modalBox.height + minHeight;
              }

              if (e.shiftKey || e.altKey) {
                if (minWidth > modalBox.width + self.__dx * 2) {
                  self.__dx = (-modalBox.width + minWidth) / 2;
                }
                if (minHeight > modalBox.height + self.__dy * 2) {
                  self.__dy = (-modalBox.height + minHeight) / 2;
                }
                return {
                  left: modalOffset.left - self.__dx,
                  top: modalOffset.top - self.__dy,
                  width: modalBox.width + self.__dx * 2,
                  height: modalBox.height + self.__dy * 2
                };
              } else {
                return {
                  left: modalOffset.left,
                  top: modalOffset.top,
                  width: modalBox.width + self.__dx,
                  height: modalBox.height + self.__dy
                };
              }
            }
          },
              getResizerPosition = function getResizerPosition(e) {
            self.__dx = e.clientX - self.mousePosition.clientX;
            self.__dy = e.clientY - self.mousePosition.clientY;

            return resizerProcessor[resizerType](e);
          };

          var minWidth = 100,
              minHeight = 100;

          var cursorType = {
            top: "row-resize",
            bottom: "row-resize",
            left: "col-resize",
            right: "col-resize",
            "top-left": "nwse-resize",
            "top-right": "nesw-resize",
            "bottom-left": "nesw-resize",
            "bottom-right": "nwse-resize"
          };

          self.__dx = 0; // 변화량 X
          self.__dy = 0; // 변화량 Y

          // self.resizerBg : body 가 window보다 작을 때 문제 해결을 위한 DIV
          self.resizerBg = jQuery('<div class="ax5modal-resizer-background" ondragstart="return false;"></div>');
          self.resizer = jQuery('<div class="ax5modal-resizer" ondragstart="return false;"></div>');
          self.resizerBg.css({
            zIndex: modalZIndex,
            cursor: cursorType[resizerType]
          });
          self.resizer.css({
            left: modalOffset.left,
            top: modalOffset.top,
            width: modalBox.width,
            height: modalBox.height,
            zIndex: modalZIndex + 1,
            cursor: cursorType[resizerType]
          });
          jQuery(document.body).append(self.resizerBg).append(self.resizer);
          self.activeModal.addClass("draged");

          jQuery(document.body).bind(ENM["mousemove"] + ".ax5modal-resize-" + this.instanceId, function (e) {
            self.resizer.css(getResizerPosition(e));
          }).bind(ENM["mouseup"] + ".ax5modal-resize-" + this.instanceId, function (e) {
            resizeModal.off.call(self);
          }).bind("mouseleave.ax5modal-resize-" + this.instanceId, function (e) {
            resizeModal.off.call(self);
          });

          jQuery(document.body).attr("unselectable", "on").css("user-select", "none").bind("selectstart", false);
        },
        off: function off() {
          var setModalPosition = function setModalPosition() {
            var box = this.resizer.offset();
            jQuery.extend(box, {
              width: this.resizer.width(),
              height: this.resizer.height()
            });
            if (!this.modalConfig.absolute) {
              box.left -= jQuery(document).scrollLeft();
              box.top -= jQuery(document).scrollTop();
            }
            this.activeModal.css(box);

            this.modalConfig.left = box.left;
            this.modalConfig.top = box.top;
            this.modalConfig.width = box.width;
            this.modalConfig.height = box.height;
            this.$["body"].css({
              height: box.height - this.modalConfig.headerHeight
            });
            if (this.modalConfig.iframe) {
              this.$["iframe-wrap"].css({
                height: box.height - this.modalConfig.headerHeight
              });
              this.$["iframe"].css({
                height: box.height - this.modalConfig.headerHeight
              });
            }

            box = null;
          };

          this.activeModal.removeClass("draged");
          setModalPosition.call(this);

          this.resizer.remove();
          this.resizer = null;
          this.resizerBg.remove();
          this.resizerBg = null;

          onStateChanged.call(this, self.modalConfig, {
            self: this,
            state: "resize"
          });

          jQuery(document.body).unbind(ENM["mousemove"] + ".ax5modal-resize-" + this.instanceId).unbind(ENM["mouseup"] + ".ax5modal-resize-" + this.instanceId).unbind("mouseleave.ax5modal-resize-" + this.instanceId);

          jQuery(document.body).removeAttr("unselectable").css("user-select", "auto").unbind("selectstart");
        }
      };

      /// private end

      /**
       * Preferences of modal UI
       * @method ax5modal.setConfig
       * @param {Object} config - 클래스 속성값
       * @param {Number} [config.zIndex]
       * @param {Object} [config.position]
       * @param {String} [config.position.left="center"]
       * @param {String} [config.position.top="middle"]
       * @param {Number} [config.position.margin=10]
       * @param {String} [config.minimizePosition="bottom-right"]
       * @param {Number} [config.width=300]
       * @param {Number} [config.height=400]
       * @param {Boolean} [config.closeToEsc=true]
       * @param {Boolean} [config.absolute=false]
       * @param {Boolean} [config.disableDrag=false]
       * @param {Boolean} [config.disableResize=false]
       * @param {Number} [config.animateTime=250]
       * @param {Function} [config.fullScreen]
       * @param {Function} [config.onStateChanged] - `onStateChanged` function can be defined in setConfig method or new ax5.ui.modal initialization method. However, you can us to define an event function after initialization, if necessary
       * @param {Function} [config.onResize]
       * @returns {ax5modal}
       * @example
       * ```js
       * var modal = new ax5.ui.modal({
       *     iframeLoadingMsg: '<i class="fa fa-spinner fa-5x fa-spin" aria-hidden="true"></i>',
       *     header: {
       *         title: "MODAL TITLE",
       *         btns: {
       *             minimize: {
       *                 label: '<i class="fa fa-minus-circle" aria-hidden="true"></i>', onClick: function () {
       *                     modal.minimize();
       *                 }
       *             },
       *             maximize: {
       *                 label: '<i class="fa fa-plus-circle" aria-hidden="true"></i>', onClick: function () {
       *                     modal.maximize();
       *                 }
       *             },
       *             close: {
       *                 label: '<i class="fa fa-times-circle" aria-hidden="true"></i>', onClick: function () {
       *                     modal.close();
       *                 }
       *             }
       *         }
       *     }
       * });
       *
       * modal.open({
       *     width: 800,
       *     height: 600,
       *     fullScreen: function(){
       *         return ($(window).width() < 600);
       *     },
       *     iframe: {
       *         method: "get",
       *         url: "http://chequer-app:2017/html/login.html",
       *         param: "callback=modalCallback"
       *     },
       *     onStateChanged: function(){
       *          console.log(this);
       *     },
       *     onResize: function(){
       *          console.log(this);
       *     }
       * });
       * ```
       */
      //== class body start
      this.init = function () {
        this.onStateChanged = cfg.onStateChanged;
        this.onResize = cfg.onResize;
      };

      /**
       * open the modal
       * @method ax5modal.open
       * @returns {ax5modal}
       * @example
       * ```
       * modal.open();
       * modal.open({
       *  width: 500,
       *  height: 500
       * });
       * moaal.open({}, function(){
       *  console.log(this);
       * });
       * ```
       */
      this.open = function (opts, callback, tryCount) {
        if (typeof tryCount === "undefined") tryCount = 0;
        if (!this.activeModal) {
          opts = self.modalConfig = jQuery.extend(true, {}, cfg, opts);
          open.call(this, opts, callback);
          this.watingModal = false;
        } else if (tryCount < 3) {
          // 3번까지 재 시도
          this.watingModal = true;
          setTimeout(function () {
            this.open(opts, callback, tryCount + 1);
          }.bind(this), cfg.animateTime);
        } else {
          // 열기 시도 종료
          this.watingModal = false;
        }
        return this;
      };

      /**
       * close the modal
       * @method ax5modal.close
       * @param _option
       * @returns {ax5modal}
       * @example
       * ```
       * my_modal.close();
       * my_modal.close({callback: function(){
       *  // on close event
       * });
       * // close 함수에 callback을 전달하면 정확한 close 타이밍을 캐치할 수 있습니다
       * ```
       */

      this.close = function (_option) {
        var opts = void 0,
            that = void 0;

        if (this.activeModal) {
          opts = self.modalConfig;
          this.activeModal.addClass("destroy");
          jQuery(window).unbind("keydown.ax-modal");
          jQuery(window).unbind("resize.ax-modal");

          setTimeout(function () {
            // 프레임 제거
            if (opts.iframe) {
              var $iframe = this.$["iframe"]; // iframe jQuery Object
              if ($iframe) {
                var iframeObject = $iframe.get(0),
                    idoc = iframeObject.contentDocument ? iframeObject.contentDocument : iframeObject.contentWindow.document;

                try {
                  $(idoc.body).children().each(function () {
                    $(this).remove();
                  });
                } catch (e) {}
                idoc.innerHTML = "";
                $iframe.attr("src", "about:blank").remove();

                // force garbarge collection for IE only
                window.CollectGarbage && window.CollectGarbage();
              }
            }

            this.activeModal.remove();
            this.activeModal = null;

            // 모달 오픈 대기중이면 닫기 상태 전달 안함.
            if (!this.watingModal) {
              onStateChanged.call(this, opts, {
                self: this,
                state: "close"
              });
            }

            if (_option && U.isFunction(_option.callback)) {
              that = {
                self: this,
                id: opts.id,
                theme: opts.theme,
                width: opts.width,
                height: opts.height,
                state: "close",
                $: this.$
              };
              _option.callback.call(that, that);
            }
          }.bind(this), cfg.animateTime);
        }

        this.minimized = false; // hoksi

        return this;
      };

      /**
       * @method ax5modal.minimize
       * @returns {ax5modal}
       */
      this.minimize = function () {
        return function (minimizePosition) {
          if (this.minimized !== true) {
            var opts = self.modalConfig;
            if (typeof minimizePosition === "undefined") minimizePosition = cfg.minimizePosition;

            this.minimized = true;
            this.$.body.hide();
            self.modalConfig.originalHeight = opts.height;
            self.modalConfig.height = 0;
            alignProcessor[minimizePosition].call(this);

            onStateChanged.call(this, opts, {
              self: this,
              state: "minimize"
            });
          }

          return this;
        };
      }();

      /**
       * @method ax5modal.restore
       * @returns {ax5modal}
       */
      this.restore = function () {
        var opts = self.modalConfig;
        if (this.minimized) {
          this.minimized = false;
          this.$.body.show();
          self.modalConfig.height = self.modalConfig.originalHeight;
          self.modalConfig.originalHeight = undefined;

          this.align({ left: "center", top: "middle" });
          onStateChanged.call(this, opts, {
            self: this,
            state: "restore"
          });
        }
        return this;
      };

      /**
       * setCSS
       * @method ax5modal.css
       * @param {Object} css -
       * @returns {ax5modal}
       */
      this.css = function (css) {
        if (this.activeModal && !self.fullScreen) {
          this.activeModal.css(css);
          if (typeof css.width !== "undefined") {
            self.modalConfig.width = css.width;
          }
          if (typeof css.height !== "undefined") {
            self.modalConfig.height = css.height;
          }

          this.align();
        }
        return this;
      };

      /**
       * @method ax5modal.setModalConfig
       * @param _config
       * @returns {ax5.ui.ax5modal}
       */
      this.setModalConfig = function (_config) {
        self.modalConfig = jQuery.extend({}, self.modalConfig, _config);
        this.align();
        return this;
      };

      /**
       * @method ax5modal.align
       * @param position
       * @param e
       * @returns {ax5modal}
       * @example
       * ```js
       * modal.align({left:"center", top:"middle"});
       * modal.align({left:"left", top:"top", margin: 20});
       * ```
       */
      this.align = function () {
        return function (position, e) {
          if (!this.activeModal) return this;

          var opts = self.modalConfig,
              box = {
            width: opts.width,
            height: opts.height
          };

          var fullScreen = opts.isFullScreen = function (_fullScreen) {
            if (typeof _fullScreen === "undefined") {
              return false;
            } else if (U.isFunction(_fullScreen)) {
              return _fullScreen();
            }
          }(opts.fullScreen);

          if (fullScreen) {
            if (opts.header) this.$.header.show();
            if (opts.header) {
              opts.headerHeight = this.$.header.outerHeight();
              box.height += opts.headerHeight;
            } else {
              opts.headerHeight = 0;
            }
            box.width = jQuery(window).width();
            box.height = opts.height;
            box.left = 0;
            box.top = 0;
          } else {
            if (opts.header) this.$.header.show();
            if (position) {
              jQuery.extend(true, opts.position, position);
            }

            if (opts.header) {
              opts.headerHeight = this.$.header.outerHeight();
              box.height += opts.headerHeight;
            } else {
              opts.headerHeight = 0;
            }

            //- position 정렬
            if (opts.position.left == "left") {
              box.left = opts.position.margin || 0;
            } else if (opts.position.left == "right") {
              // window.innerWidth;
              box.left = jQuery(window).width() - box.width - (opts.position.margin || 0);
            } else if (opts.position.left == "center") {
              box.left = jQuery(window).width() / 2 - box.width / 2;
            } else {
              box.left = opts.position.left || 0;
            }

            if (opts.position.top == "top") {
              box.top = opts.position.margin || 0;
            } else if (opts.position.top == "bottom") {
              box.top = jQuery(window).height() - box.height - (opts.position.margin || 0);
            } else if (opts.position.top == "middle") {
              box.top = jQuery(window).height() / 2 - box.height / 2;
            } else {
              box.top = opts.position.top || 0;
            }
            if (box.left < 0) box.left = 0;
            if (box.top < 0) box.top = 0;

            if (opts.absolute) {
              box.top += jQuery(window).scrollTop();
              box.left += jQuery(window).scrollLeft();
            }
          }

          this.activeModal.css(box);

          this.$["body"].css({
            height: box.height - (opts.headerHeight || 0)
          });

          if (opts.iframe) {
            this.$["iframe-wrap"].css({
              height: box.height - opts.headerHeight
            });
            this.$["iframe"].css({ height: box.height - opts.headerHeight });
          } else {}
          return this;
        };
      }();

      // 클래스 생성자
      this.main = function () {
        UI.modal_instance = UI.modal_instance || [];
        UI.modal_instance.push(this);

        if (arguments && U.isObject(arguments[0])) {
          this.setConfig(arguments[0]);
        }
      }.apply(this, arguments);
    };
  }());

  MODAL = ax5.ui.modal;
})();

// ax5.ui.modal.tmpl
(function () {
  var MODAL = ax5.ui.modal;

  var content = function content() {
    return " \n        <div id=\"{{modalId}}\" data-modal-els=\"root\" class=\"ax5modal {{theme}} {{fullscreen}}\" style=\"{{styles}}\">\n            {{#header}}\n            <div class=\"ax-modal-header\" data-modal-els=\"header\">\n                {{{title}}}\n                {{#btns}}\n                    <div class=\"ax-modal-header-addon\">\n                    {{#@each}}\n                    <button tabindex=\"-1\" data-modal-header-btn=\"{{@key}}\" class=\"{{@value.theme}}\">{{{@value.label}}}</button>\n                    {{/@each}}\n                    </div>\n                {{/btns}}\n            </div>\n            {{/header}}\n            <div class=\"ax-modal-body\" data-modal-els=\"body\">\n            {{#iframe}}\n                <div data-modal-els=\"iframe-wrap\" style=\"-webkit-overflow-scrolling: touch; overflow: auto;position: relative;\">\n                    <table data-modal-els=\"iframe-loading\" style=\"width:100%;height:100%;\"><tr><td style=\"text-align: center;vertical-align: middle\">{{{iframeLoadingMsg}}}</td></tr></table>\n                    <iframe name=\"{{modalId}}-frame\" src=\"\" width=\"100%\" height=\"100%\" frameborder=\"0\" data-modal-els=\"iframe\" style=\"position: absolute;left:0;top:0;\"></iframe>\n                </div>\n                <form name=\"{{modalId}}-form\" data-modal-els=\"iframe-form\">\n                <input type=\"hidden\" name=\"modalId\" value=\"{{modalId}}\" />\n                {{#param}}\n                {{#@each}}\n                <input type=\"hidden\" name=\"{{@key}}\" value=\"{{@value}}\" />\n                {{/@each}}\n                {{/param}}\n                </form>\n            {{/iframe}}\n            {{^iframe}}\n                <div data-modal-els=\"body-frame\" style=\"position: absolute;left:0;top:0;width:100%;height:100%;\"></div>\n            {{/iframe}}\n            </div>\n            {{^disableResize}}\n            <div data-ax5modal-resizer=\"top\"></div>\n            <div data-ax5modal-resizer=\"right\"></div>\n            <div data-ax5modal-resizer=\"bottom\"></div>\n            <div data-ax5modal-resizer=\"left\"></div>\n            <div data-ax5modal-resizer=\"top-left\"></div>\n            <div data-ax5modal-resizer=\"top-right\"></div>\n            <div data-ax5modal-resizer=\"bottom-left\"></div>\n            <div data-ax5modal-resizer=\"bottom-right\"></div>\n            {{/disableResize}}\n        </div>\n        ";
  };

  MODAL.tmpl = {
    "content": content,

    get: function get(tmplName, data, columnKeys) {
      return ax5.mustache.render(MODAL.tmpl[tmplName].call(this, columnKeys), data);
    }
  };
})();

//ax5.ui.dialog
(function () {

 var UI = ax5.ui;
 var U = ax5.util;
 var DIALOG = void 0;

 UI.addClass({
     className: "dialog"
 }, function () {
     /**
      * @class ax5dialog
      * @classdesc
      * @author tom@axisj.com
      * @example
      * ```js
      * var dialog = new ax5.ui.dialog();
      * var mask = new ax5.ui.mask();
      * dialog.setConfig({
      *     zIndex: 5000,
      *     onStateChanged: function () {
      *         if (this.state === "open") {
      *             mask.open();
      *         }
      *         else if (this.state === "close") {
      *             mask.close();
      *         }
      *     }
      * });
      *
      * dialog.alert({
      *     theme: 'default',
      *     title: 'Alert default',
      *     msg: theme + ' color'
      * }, function () {
      *     console.log(this);
      * });
      * ```
      */
     var ax5dialog = function ax5dialog() {
         var self = this,
             cfg = void 0;

         this.instanceId = ax5.getGuid();
         this.config = {
             id: 'ax5-dialog-' + this.instanceId,
             clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchend" : "click"),
             theme: 'default',
             width: 400,
             title: '',
             msg: '',
             lang: {
                 "ok": "ok", "cancel": "cancel"
             },
             animateTime: 150,
             autoCloseTime: 0
         };
         this.activeDialog = null;
         this.autoCloseTimer = null;
         this.queue = [];

         cfg = this.config;

         var onStateChanged = function onStateChanged(opts, that) {
             if (opts && opts.onStateChanged) {
                 opts.onStateChanged.call(that, that);
             } else if (this.onStateChanged) {
                 this.onStateChanged.call(that, that);
             }

             that = null;
             return true;
         };
         /**
          * @private ax5dialog.getContent
          * @param {String} dialogId
          * @param {Object} opts
          * @returns dialogDisplay
          */
         var getContent = function getContent(dialogId, opts) {

             var data = {
                 dialogId: dialogId,
                 title: opts.title || cfg.title || "",
                 msg: (opts.msg || cfg.msg || "").replace(/\n/g, "<br/>"),
                 input: opts.input,
                 btns: opts.btns,
                 '_crlf': function _crlf() {
                     return this.replace(/\n/g, "<br/>");
                 },
                 additionalContent: function (additionalContent) {
                     if (U.isFunction(additionalContent)) {
                         return additionalContent.call(opts);
                     } else {
                         return additionalContent;
                     }
                 }(opts.additionalContent)
             };

             try {
                 return DIALOG.tmpl.get.call(this, "dialogDisplay", data);
             } finally {
                 data = null;
             }
         };
         /**
          * @private ax5dialog.open
          * @param {Object} opts
          * @param callback
          */
         var open = function open(opts, callback) {
             var pos = {},
                 box = void 0;

             opts.id = opts.id || cfg.id;

             box = {
                 width: opts.width
             };
             jQuery(document.body).append(getContent.call(this, opts.id, opts));

             this.dialogConfig = opts;
             this.activeDialog = jQuery('#' + opts.id);
             this.activeDialog.css({ width: box.width });

             if (typeof callback === "undefined") {
                 callback = opts.callback;
             }

             // dialog 높이 구하기 - 너비가 정해지면 높이가 변경 될 것.
             opts.height = box.height = this.activeDialog.height();

             //- position 정렬
             if (typeof opts.position === "undefined" || opts.position === "center") {
                 pos.top = jQuery(window).height() / 2 - box.height / 2;
                 pos.left = jQuery(window).width() / 2 - box.width / 2;
             } else {
                 pos.left = opts.position.left || 0;
                 pos.top = opts.position.top || 0;
             }
             if (cfg.zIndex) {
                 pos["z-index"] = cfg.zIndex;
             }
             this.activeDialog.css(pos);

             // bind button event
             if (opts.dialogType === "prompt") {
                 this.activeDialog.find("[data-dialog-prompt]").get(0).focus();
             } else {
                 this.activeDialog.find("[data-dialog-btn]").get(0).focus();
             }

             this.activeDialog.find("[data-dialog-btn]").on(cfg.clickEventName, function (e) {
                 btnOnClick.call(this, e || window.event, opts, callback);
             }.bind(this));

             // bind key event
             jQuery(window).bind("keydown.ax5dialog", function (e) {
                 onKeyup.call(this, e || window.event, opts, callback);
             }.bind(this));

             jQuery(window).bind("resize.ax5dialog", function (e) {
                 align.call(this, e || window.event);
             }.bind(this));

             onStateChanged.call(this, opts, {
                 self: this,
                 state: "open"
             });

             if (opts.autoCloseTime) {
                 this.autoCloseTimer = setTimeout(function () {
                     self.close();
                 }, opts.autoCloseTime);
             }

             pos = null;
             box = null;
         };
         var align = function align(e) {
             if (!this.activeDialog) return this;
             var opts = self.dialogConfig,
                 box = {
                 width: opts.width,
                 height: opts.height
             };

             //- position 정렬
             if (typeof opts.position === "undefined" || opts.position === "center") {
                 box.top = window.innerHeight / 2 - box.height / 2;
                 box.left = window.innerWidth / 2 - box.width / 2;
             } else {
                 box.left = opts.position.left || 0;
                 box.top = opts.position.top || 0;
             }
             if (box.left < 0) box.left = 0;
             if (box.top < 0) box.top = 0;

             this.activeDialog.css(box);

             opts = null;
             box = null;

             return this;
         };
         var btnOnClick = function btnOnClick(e, opts, callback, target, k) {
             var that = void 0,
                 emptyKey = null;

             if (e.srcElement) e.target = e.srcElement;

             target = U.findParentNode(e.target, function (target) {
                 if (target.getAttribute("data-dialog-btn")) {
                     return true;
                 }
             });

             if (target) {
                 k = target.getAttribute("data-dialog-btn");

                 that = {
                     self: this,
                     key: k, value: opts.btns[k],
                     dialogId: opts.id,
                     btnTarget: target
                 };
                 if (opts.dialogType === "prompt") {
                     that.input = {};
                     for (var oi in opts.input) {
                         that.input[oi] = this.activeDialog.find('[data-dialog-prompt=' + oi + ']').val();
                         if (opts.input[oi].required && (that.input[oi] == "" || that.input[oi] == null)) {
                             emptyKey = oi;
                             break;
                         }
                     }
                 }
                 if (opts.btns[k].onClick) {
                     opts.btns[k].onClick.call(that, k);
                 } else if (opts.dialogType === "alert") {
                     if (callback) callback.call(that, k);
                     this.close({ doNotCallback: true });
                 } else if (opts.dialogType === "confirm") {
                     if (callback) callback.call(that, k);
                     this.close({ doNotCallback: true });
                 } else if (opts.dialogType === "prompt") {
                     if (k === 'ok') {
                         if (emptyKey) {
                             this.activeDialog.find('[data-dialog-prompt="' + emptyKey + '"]').get(0).focus();
                             return false;
                         }
                     }
                     if (callback) callback.call(that, k);
                     this.close({ doNotCallback: true });
                 }
             }

             that = null;
             opts = null;
             callback = null;
             target = null;
             k = null;
         };
         var onKeyup = function onKeyup(e, opts, callback, target, k) {
             var that = void 0,
                 emptyKey = null;

             if (e.keyCode == ax5.info.eventKeys.ESC) {
                 this.close();
             }
             if (opts.dialogType === "prompt") {
                 if (e.keyCode == ax5.info.eventKeys.RETURN) {
                     that = {
                         self: this,
                         key: k, value: opts.btns[k],
                         dialogId: opts.id,
                         btnTarget: target
                     };
                     that.input = {};

                     for (var oi in opts.input) {
                         that.input[oi] = this.activeDialog.find('[data-dialog-prompt=' + oi + ']').val();
                         if (opts.input[oi].required && (that.input[oi] == "" || that.input[oi] == null)) {
                             emptyKey = oi;
                             break;
                         }
                     }
                     if (emptyKey) {
                         that = null;
                         emptyKey = null;
                         return false;
                     }
                     if (callback) callback.call(that, k);
                     this.close({ doNotCallback: true });
                 }
             }

             that = null;
             emptyKey = null;
             opts = null;
             callback = null;
             target = null;
             k = null;
         };

         /**
          * Preferences of dialog UI
          * @method ax5dialog.setConfig
          * @param {Object} config - 클래스 속성값
          * @param {String} [config.theme="default"]
          * @param {Number} [config.width=300]
          * @param {String} [config.title=""]
          * @param {Number} [config.zIndex]
          * @param {Function} [config.onStateChanged] - `onStateChanged` function can be defined in setConfig method or new ax5.ui.dialog initialization method. However, you can us to define an
          * event function after initialization, if necessary
          * @param {Object} [config.lang]
          * @param {String} [config.lang.ok="ok"]
          * @param {String} [config.lang.cancel="cancel"]
          * @param {Number} [config.animateTime=150]
          * @param {Number} [config.autoCloseTime=0] - 0보다 크면 autoCloseTime 프레임후에 dialog auto close
          * @returns {ax5dialog}
          * @example
          * ```
          * var dialog = new ax5.ui.dialog();
          * dialog.setConfig({
          *      title: "app dialog title",
          *      zIndex: 5000,
          *      onStateChanged: function () {
          *          if (this.state === "open") {
          *              mask.open();
          *          }
          *          else if (this.state === "close") {
          *              mask.close();
          *          }
          *      }
          * });
          * ```
          */
         //== class body start
         this.init = function () {
             this.onStateChanged = cfg.onStateChanged;
             // this.onLoad = cfg.onLoad;
         };

         /**
          * open the dialog of alert type
          * @method ax5dialog.alert
          * @param {Object|String} config - dialog 속성을 json으로 정의하거나 msg만 전달
          * @param {String} [config.theme="default"]
          * @param {Number} [config.width=300]
          * @param {String} [config.title=""]
          * @param {Number} [config.zIndex]
          * @param {Function} [config.onStateChanged]
          * @param {Object} [config.lang]
          * @param {String} [config.lang.ok="ok"]
          * @param {String} [config.lang.cancel="cancel"]
          * @param {Number} [config.animateTime=150]
          * @param {Number} [config.autoCloseTime=0] - 0보다 크면 autoCloseTime 프레임후에 dialog auto close
          * @param {Function|String} [config.additionalContent]
          * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
          * @returns {ax5dialog}
          * @example
          * ```
          * myDialog.alert({
          *  title: 'app title',
          *  msg: 'alert'
          * }, function(){});
          * ```
          */
         this.alert = function (opts, callback, tryCount) {
             if (U.isString(opts)) {
                 opts = {
                     title: cfg.title,
                     msg: opts
                 };
             }

             opts = jQuery.extend(true, {}, cfg, opts);
             opts.dialogType = "alert";
             opts.theme = opts.theme || cfg.theme || "";
             opts.callback = callback;

             if (typeof opts.btns === "undefined") {
                 opts.btns = {
                     ok: { label: cfg.lang["ok"], theme: opts.theme }
                 };
             }

             if (this.activeDialog) {
                 this.queue.push(opts);
             } else {
                 open.call(this, opts, callback);
             }
             return this;
         };

         /**
          * open the dialog of confirm type
          * @method ax5dialog.confirm
          * @param {Object|String} config - dialog 속성을 json으로 정의하거나 msg만 전달
          * @param {String} [config.theme="default"]
          * @param {Number} [config.width=300]
          * @param {String} [config.title=""]
          * @param {Number} [config.zIndex]
          * @param {Function} [config.onStateChanged]
          * @param {Object} [config.lang]
          * @param {String} [config.lang.ok="ok"]
          * @param {String} [config.lang.cancel="cancel"]
          * @param {Number} [config.animateTime=150]
          * @param {Number} [config.autoCloseTime=0] - 0보다 크면 autoCloseTime 프레임후에 dialog auto close
          * @param {Function|String} [config.additionalContent]
          * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
          * @returns {ax5dialog}
          * @example
          * ```
          * myDialog.confirm({
          *      title: 'app title',
          *      msg: 'confirm',
          *      additionalContent: function () {
          *          return "<div style='border:1px solid #ccc;border-radius: 5px;background: #eee;padding: 10px;'>추가정보</div>";
          *      }
          * }, function(){});
          * ```
          */
         this.confirm = function (opts, callback, tryCount) {
             if (U.isString(opts)) {
                 opts = {
                     title: cfg.title,
                     msg: opts
                 };
             }

             opts = jQuery.extend(true, {}, cfg, opts);
             opts.dialogType = "confirm";
             opts.theme = opts.theme || cfg.theme || "";
             opts.callback = callback;

             if (typeof opts.btns === "undefined") {
                 opts.btns = {
                     ok: { label: cfg.lang["ok"], theme: opts.theme },
                     cancel: { label: cfg.lang["cancel"] }
                 };
             }

             if (this.activeDialog) {
                 this.queue.push(opts);
             } else {
                 open.call(this, opts, callback);
             }

             return this;
         };

         /**
          * open the dialog of prompt type
          * @method ax5dialog.prompt
          * @param {Object|String} config - dialog 속성을 json으로 정의하거나 msg만 전달
          * @param {String} [config.theme="default"]
          * @param {Number} [config.width=300]
          * @param {String} [config.title=""]
          * @param {Number} [config.zIndex]
          * @param {Function} [config.onStateChanged]
          * @param {Object} [config.lang]
          * @param {String} [config.lang.ok="ok"]
          * @param {String} [config.lang.cancel="cancel"]
          * @param {Number} [config.animateTime=150]
          * @param {Number} [config.autoCloseTime=0] - 0보다 크면 autoCloseTime 프레임후에 dialog auto close
          * @param {Function|String} [config.additionalContent]
          * @param {Function} [callback] - 사용자 확인 이벤트시 호출될 callback 함수
          * @returns {ax5dialog}
          * @example
          * ```
          * myDialog.prompt({
          *  title: 'app title',
          *  msg: 'alert'
          * }, function(){});
          * ```
          */
         this.prompt = function (opts, callback, tryCount) {
             if (U.isString(opts)) {
                 opts = {
                     title: cfg.title,
                     msg: opts
                 };
             }

             opts = jQuery.extend(true, {}, cfg, opts);
             opts.dialogType = "prompt";
             opts.theme = opts.theme || cfg.theme || "";
             opts.callback = callback;

             if (typeof opts.input === "undefined") {
                 opts.input = {
                     value: { label: "" }
                 };
             }
             if (typeof opts.btns === "undefined") {
                 opts.btns = {
                     ok: { label: cfg.lang["ok"], theme: opts.theme },
                     cancel: { label: cfg.lang["cancel"] }
                 };
             }

             if (this.activeDialog) {
                 this.queue.push(opts);
             } else {
                 open.call(this, opts, callback);
             }

             return this;
         };

         /**
          * close the dialog
          * @method ax5dialog.close
          * @returns {ax5dialog}
          * @example
          * ```
          * myDialog.close();
          * ```
          */
         this.close = function (_option) {
             var opts = void 0,
                 that = void 0;

             if (this.activeDialog) {
                 if (this.autoCloseTimer) clearTimeout(this.autoCloseTimer);

                 opts = self.dialogConfig;

                 this.activeDialog.addClass("destroy");
                 jQuery(window).unbind("keydown.ax5dialog");
                 jQuery(window).unbind("resize.ax5dialog");

                 setTimeout(function () {
                     if (this.activeDialog) {
                         this.activeDialog.remove();
                         this.activeDialog = null;
                     }

                     that = {
                         self: this,
                         state: "close",
                         dialogId: opts.id
                     };

                     if (opts.callback && (!_option || !_option.doNotCallback)) {
                         opts.callback.call(that);
                     }

                     if (opts && opts.onStateChanged) {
                         opts.onStateChanged.call(that, that);
                     } else if (this.onStateChanged) {
                         this.onStateChanged.call(that, that);
                     }

                     if (this.queue && this.queue.length) {
                         open.call(this, this.queue.shift());
                     }

                     opts = null;
                     that = null;
                 }.bind(this), cfg.animateTime);
             }
             return this;
         };

         // 클래스 생성자
         this.main = function () {

             UI.dialog_instance = UI.dialog_instance || [];
             UI.dialog_instance.push(this);

             if (arguments && U.isObject(arguments[0])) {
                 this.setConfig(arguments[0]);
             }
         }.apply(this, arguments);
     };
     return ax5dialog;
 }());

 DIALOG = ax5.ui.dialog;
})();

//ax5.ui.dialog.tmpl
(function () {

 var DIALOG = ax5.ui.dialog;

 //  <div class=\"ax-dialog-header\" data-dialog-els=\"header\">\n                {{{title}}}\n            </div>\n  삭제   (<div class=\"ax-dialog-body\" data-dialog-els=\"body\">\n) 앞부분
 var dialogDisplay = function dialogDisplay(columnKeys) {
     return " \n        <div id=\"{{dialogId}}\" data-dialog-els=\"root\" class=\"ax5-ui-dialog {{theme}}\">\n                     <div class=\"ax-dialog-body\" data-dialog-els=\"body\">\n                <div class=\"ax-dialog-msg\">{{{msg}}}</div>\n                \n                {{#input}}\n                <div class=\"ax-dialog-prompt\">\n                    {{#@each}}\n                    <div class=\"form-group\">\n                    {{#@value.label}}\n                    <label>{{#_crlf}}{{{.}}}{{/_crlf}}</label>\n                    {{/@value.label}}\n                    <input type=\"{{@value.type}}\" placeholder=\"{{@value.placeholder}}\" class=\"form-control {{@value.theme}}\" data-dialog-prompt=\"{{@key}}\" style=\"width:100%;\" value=\"{{@value.value}}\" />\n                    {{#@value.help}}\n                    <p class=\"help-block\">{{#_crlf}}{{.}}{{/_crlf}}</p>\n                    {{/@value.help}}\n                    </div>\n                    {{/@each}}\n                </div>\n                {{/input}}\n                \n                <div class=\"ax-dialog-buttons\" data-dialog-els=\"buttons\">\n                    <div class=\"ax-button-wrap\">\n                    {{#btns}}\n                        {{#@each}}\n                        <button type=\"button\" data-dialog-btn=\"{{@key}}\" class=\"btn btn-{{@value.theme}}\">{{@value.label}}</button>\n                        {{/@each}}\n                    {{/btns}}\n                    </div>\n                </div>\n                \n                {{#additionalContent}}\n                <div data-dialog-els=\"additional-content\">{{{.}}}</div>\n                {{/additionalContent}}\n            </div>\n        </div>  \n        ";
 };

 DIALOG.tmpl = {
     "dialogDisplay": dialogDisplay,
     get: function get(tmplName, data, columnKeys) {
         return ax5.mustache.render(DIALOG.tmpl[tmplName].call(this, columnKeys), data);
     }
 };
})();