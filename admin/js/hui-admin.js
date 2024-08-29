layui.use(['jquery', 'form', 'layer', 'drawer', 'toast'], function () {
  var $ = layui.jquery;
  var form = layui.form;
  var layer = layui.layer;
  var drawer = layui.drawer;
  var table = layui.table;
  var toast = layui.toast;
  var treeTable = layui.treeTable;

  // 监听弹出层的打开
  $('body').on('click', '[data-open]', function () {
    let title = $(this).attr('data-title') ?? '';
    let url = $(this).attr('data-open') ?? '';
    let w = $(this).attr('data-width') ?? '';
    HuiAdminShow(title, url, w);
  });

  // 监听弹出层的全屏打开
  $('body').on('click', '[data-open-full]', function () {
    let title = $(this).attr('data-title') ?? '';
    let url = $(this).attr('data-open-full') ?? '';
    HuiAdminOpenFull(title, url);
  });

  // 监听提示框弹出
  $('body').on('click', '[data-confirm]', function () {
    let title = $(this).attr('data-title') ?? '';
    let url = $(this).attr('data-confirm') ?? '';
    let reload = $(this).attr('data-reload') ?? 0;
    let tableId = $(this).attr('data-table-id') ?? '';
    let tableType = $(this).attr('data-table-type') ?? 1;
    let data = $(this).attr('data-data') ?? "";
    HuiAdminConfirm(url, title, reload, data, tableId, tableType);
  });

  //监听图片选择弹窗打开
  $('body').on('click', '[data-open-pic]', function () {
    ShowPicList(this);
  });

  //监听单图图片页面删除功能
  $('body').on("click", '.upload_pic_box dl dd', function () {
    var id = $(this).parents('.upload_pic_box').attr('id');
    var url = $(this).siblings('dt').find('img').data('url');
    var input = $('#' + id);
    var input2 = $('#' + id.replace('_box', ''));
    input2.val('');

    var value = input.val();
    value = value.replace(url, '');
    value = value.replace(/^,/, '');
    value = value.replace(/,$/, '');
    value = value.replace(/,,/, ',');
    input.val(value);
    $(this).parents('dl').remove();
  });

  /**
   * 右侧抽屉方式打开弹框
   * @param title
   * @param url
   * @param w
   * @param reload
   * @returns {boolean}
   * @constructor
   */
  window.HuiAdminShow = function (title, url, w) {
    if (title == null || title == '') {
      title = false;
    }
    if (url == null || url == '') {
      layer.msg("url地址不能为空");
      return false;
    }
    if (w == null || w == '' || w === undefined) {
      var window_width = $(window).width();
      if (window_width < 700) {
        w = window_width;
      } else if (window_width >= 700 && window_width < 1200) {
        w = 700;
      } else {
        w = window_width * 0.55;
      }
    } else {
      if (w.includes('%')) {
        w = parseInt(w) * $(window).width() / 100 - 232;
      }
    }

    window.drawer_index = drawer.open({
      legacy: false,
      title: [title, 'font-size:16px;color:#2d8cf0'],
      offset: 'r',
      area: w + 'px',
      closeBtn: 1,
      url: url,
      end: function () {
        form.render('select');
      }
    });
  }
  /*满屏（全屏）打开窗口*/
  window.HuiAdminOpenFull = function (title, url, w) {
    if (title == null || title == '') {
      title = false;
    }
    if (url == null || url == '') {
      layer.msg("url地址不能为空");
      return false;
    }
    if (w == null || w == '' || w === undefined) {
      var window_width = $(window).width();
      w = window_width;
    }

    window.drawer_index = drawer.open({
      legacy: false,
      title: [title, 'font-size:16px;color:#2d8cf0'],
      offset: 't',
      area: w + 'px',
      closeBtn: 1,
      url: url,
      end: function () {
        form.render('select');
      }
    });
  }

  /**
   * 弹出层询问框提示
   * @param url   访问的url地址
   * @param msg   询问提示词
   * @param reload    执行后是否刷新：1=刷新
   * @param data    传递的数据
   * @param tableId   要刷新的数据表格id，reload=1生效
   * @param tableType   要刷新的数据表格类型（1=普通数据表格，2=树形表格），reload=1生效
   * @returns {boolean}
   * @constructor
   */
  window.HuiAdminConfirm = function (url, msg = '真的要这样操作么？', reload = 0, data = {}, tableId = '', tableType = 1) {
    if (url == null || url === '') {
      layer.msg("url地址不能为空");
      return false;
    }
    layer.confirm(msg, {skin: 'skin-layer-hui'}, function (index) {
      var loading = layer.load(0);
      $.post(url, data, function (res) {
        layer.close(loading);
        if (res.code === 1 || res.code === 200) {
          layer.msg(res.msg, {icon: 1, time: 1500}, function () {
            if (parseInt(reload) === 1) {
              //刷新数据表格
              if (window.hasOwnProperty('refreshTable') && (tableId != '' || tableId != null)) {
                refreshTable(tableId, tableType);
              }
            }
          });
        } else {
          layer.msg(res.msg, {icon: 2});
        }
      });
    });
  }

  /*
      参数解释：
      title   标题
      url     请求的url
      id      需要操作的数据id
      w       弹出层宽度（缺省调默认值）
      h       弹出层高度（缺省调默认值）
  */
  window.ShowPicList = function (element) {
    var url = $(element).data('open-pic');

    drawer.open({
      legacy: false,
      title: ["选择附件", 'font-size:16px;color:#2d8cf0'],
      offset: 't',
      area: ['100%', '100%'],
      closeBtn: 1,
      url: url,
      scrollbar: false,
      yes: function (index, layero) {
        console.log(index);
        console.log(layero);
      }
    });
  }
  window.ShowPicListOld = function (element) {
    var url = $(element).data('open-pic');
    if (!arguments.callee.hWnd || arguments.callee.hWnd.closed) {
      let widowWidth = Math.floor(window.screen.availWidth * 0.8);
      let widowHeight = Math.floor(window.screen.availHeight * 0.72);
      let windowLeft = (window.screenX || window.screenLeft || 0) + (screen.width - widowWidth) / 2;
      let windowTop = Math.floor(window.screen.availHeight * 0.15);
      arguments.callee.hWnd = window.open(url, 'ckeditor', 'titlebar=no, toolbar=no, menubar=no, resizable=no,location=no, status=no,fullscreen=no, width=' + widowWidth + ', height=' + widowHeight + ', left=' + windowLeft + ', top=' + windowTop + '');
    }
    arguments.callee.hWnd.focus();
    window['ckeditor_select_callback'] = function (url, type, input_select_id) {
      if (!url) {
        return false;
      }
      var input = $(element).closest('.huicmf-upload').find('#' + input_select_id)[0];
      if (type === 'one') {
        $(input).val(url);
      } else {
        var str = "";
        var i1 = 0;
        var getItemLength = parseInt($(input).find('.file-item').length);
        var length = GV.site.pic_more_nums;

        $.each(url, function (i, val) {
          let find = $(input).find('.file-item-id-' + val.file_id).html();
          let pidDataName = layui.$("#" + input_select_id).attr('data-name');
          if (pidDataName == '' || pidDataName == null || pidDataName == 'undefined') {
            pidDataName = 'params[thumbs][]';
          }
          if (typeof (find) === 'undefined') {
            i1 += 1;
            str += ' <div class="file-item file-item-id-' + val.file_id + '">\n' +
              '    <img src="' + val.file_path + '">\n' +
              '    <input type="hidden" name="' + pidDataName + '" value="' + val.file_path + '">\n' +
              '    <i class="layui-icon layui-icon-close file-item-delete" onclick="fileItemDelete(' + val.file_id + ')"></i>\n' +
              '</div>';
          }
        })
        var check_length = i1;
        if (length > 1 && length < (check_length + getItemLength)) {
          layer.msg('文件最大同时选择数为：' + length, {
            icon: 2
          });
          return false;
        }
        $(input).append(str);
        $(input).attr('data-nums', (check_length + getItemLength));
      }

    }
  }

  /* 监听状态设置开关 */
  form.on('switch(switchStatus)', function (data) {
    var that = $(this);
    var primaryKey = that.attr('data-primary-key') ?? 'id';
    var url = that.attr('data-href');
    var field = that.attr('data-field') ?? 'status';
    if (!url) {
      layer.msg('请设置data-href参数');
      return false;
    }
    let postData = {};
    postData[primaryKey] = this.value;
    postData[field] = data.elem.checked ? 1 : 0;
    $.post(url, postData, function (res) {
      if (res.code !== 200) {
        return hui_toast("error", res.msg, function () {
          that.trigger('click');
          form.render('checkbox');
        });
      }
      return hui_toast("success", res.msg);
    });
  });

  /**
   * 刷新数据表格
   * @param tableId 数据表格id
   * @param type  刷新类型：1=普通数据表格；2=树形表格
   */
  window.refreshTable = function (tableId, type = 1) {
    if (type === 1) {
      table.reload(tableId);
    } else {
      treeTable.reloadData(tableId);
    }
  }

  //图片预览
  window.hui_img_preview = function (id, src) {
    if (src.trim().length === 0 || src === null) return;
    layer.tips('<img src="' + htmlspecialchars(src) + '" height="160">', '#' + id, {
      tips: [1, '#fff'],
      time: 10000,
    });
  }

  // 多图上传删除图片
  window.fileItemDelete = function (id) {
    layer.confirm('您确定要删除该图片吗？', {
      title: '友情提示'
    }, function (index) {
      let picNums = parent.layui.$(".uploader-list").attr('data-nums');
      parent.layui.$(".uploader-list").attr('data-nums', parseInt(picNums) - 1);
      $('.file-item-id-' + id).remove();
      layer.close(index);
    });
  }
  /**
   * 多图选中查看大图相册
   * @param vvv 图片层，比如：#id
   */
  window.bigMapImg = function (vvv) {
    layer.photos({
      photos: vvv
    });
  }

  /**
   * 封装 toast 消息
   * @param type | info success warning error question
   * @param msg | 消息内容
   * @param callback  | 回调
   */
  window.hui_toast = function (type, msg, callback = function () {
  }) {
    if (type === 'info') {
      toast.info({
        message: msg,
        position: "topRight",
        timeout: 2000,
        zindex: 99999999,
        onOpened: callback
      });
    } else if (type === 'success') {
      toast.success({
        message: msg,
        position: "topRight",
        timeout: 2000,
        zindex: 99999999,
        onClosing: callback
      });
    } else if (type === 'warning') {
      toast.warning({
        message: msg,
        position: "topRight",
        timeout: 2000,
        zindex: 99999999,
        onOpened: callback
      });
    } else if (type === 'error') {
      toast.error({
        message: msg,
        position: "topRight",
        timeout: 2000,
        zindex: 99999999,
        onOpened: callback
      });
    } else if (type === 'question') {
      toast.question({
        message: msg,
        position: "topRight",
        timeout: 2000,
        zindex: 99999999,
        onOpened: callback
      });
    }
    return false;
  }

});

//html实体转换
function htmlspecialchars(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/'/g, '&#039;');
  return str;
}

/**
 * 判断访问类型是PC端还是手机端
 */
function isMobile() {
  var userAgentInfo = navigator.userAgent;
  var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
  var mobile_flag = false;
  //根据userAgent判断是否是手机
  for (var v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobile_flag = true;
      break;
    }
  }
  var screen_width = window.screen.width;
  var screen_height = window.screen.height;
  //根据屏幕分辨率判断是否是手机
  if (screen_width < 500 && screen_height < 800) {
    mobile_flag = true;
  }
  return mobile_flag;
}

/**
 * 格式化文件大小
 * @param value
 * @returns {string}
 */
function formatSize(value) {
  if (null == value || "" === value || value === 0) {
    return "0 Bytes";
  }
  let unitArr = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let index = 0;
  let srcSize = parseFloat(value);
  index = Math.floor(Math.log(srcSize) / Math.log(1024));
  let size = srcSize / Math.pow(1024, index);
  size = size.toFixed(2);
  return size + unitArr[index];
}
