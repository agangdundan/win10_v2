/*
 * Global JavaScript Document
 */

window.path = "http://localhost:8080/ms/";
window.authorization = "Authorization";

window.book = "book";
window.books = "books";

window.msg = "msg";
window.msgs = "msgs";

window.user = "user";
window.users = "users";
window.login = "login";
window.logout = "logout";

window.token = localStorage.getItem('token');

window.learningplan = "learningplan";
window.learningplans = "learningplans";

window.learningplancolumn = "learningplancolumn";
window.learningplancolumns = "learningplancolumns";

window.learningplancolumnmanager = "learningplancolumnmanager";
window.learningplancolumnmanagers = "learningplancolumnmanagers";

window.usergroup = "usergroup";
window.usergroups = "usergroups";

window.action = "action";
window.actions = "actions";

window.actiongroup = "actiongroup";
window.actiongroups = "actiongroups";

window.file = "file";
window.image = "image";

/**
 * 检查form表单里的元素是否有空值
 * @param form 表单控件
 */
function checkForm (form) {

}

/**
 *
 * @param opts
 * @returns {boolean}
 */
function doAjax(opts) {
    if (typeof opts === 'undefined' || opts === null) {
        layer.msg('Undefined Params');
        return false;
    }
    $.ajax({
        url: path + opts[ 'action' ]
        ,type: opts[ 'type' ]
        ,data: opts[ 'data' ]
        ,dataType: 'json'
        ,async: opts[ 'async' ]
        ,beforeSend: function (xhr) {
            xhr.setRequestHeader(authorization, token);
        }
        ,success: typeof opts[ 'success' ] !== 'undefined' ? opts[ 'success' ] : function (data) {
            if (typeof data === 'undefined') {
                layer.msg("操作失败")
            } else {
                layer.msg(data.message);
            }
        }
        ,error: typeof opts[ 'error' ] !== 'undefined' ? opts[ 'error' ] : function (xhr, msg, thrown) {
            console.log(xhr);
            console.log(msg);
            console.log(thrown);
        }
    });
}

/**
 * refresh the layui-table
 * @param opts
 */
function reloadTableIns(opts) {

    if (typeof opts === 'undefined' || opts === null) {
        layer.msg('Undefined Params');
        return false;
    }

    var tabIns = opts['tabIns'];
    console.log(typeof tabIns);
    doAjax({
        action: opts['action']
        ,type: 'get'
        ,data: opts['data']
        ,success: function (data) {
            layer.msg(data.message);
        }
    })
}

/**
 * render the layui-table
 * @param opts
 */
function renderTable(opts) {

    if (typeof opts === 'undefined' || opts === null) {
        layer.msg('Undefined Params');
        return false;
    }

    var action = opts['action'];
    var data = opts['data'];

    var elem = opts['elem'];
    var page = true;
    var cellMinWidth = typeof opts['cellMinWidth'] === 'undefined' ? '80' : opts['cellMinWidth'];
    var cols = opts['cols'];
    var done = typeof opts['done'] === 'function' ? opts['done'] : function (data) {
        layer.msg(data.message);
    };

    doAjax({
        action: action
        ,type: 'get'
        ,data: data
        ,async: false
        ,success: function (data) {
            if (data.status === 200) {
                table.render({
                    elem : elem
                    ,data: data.data.data
                    ,page: page
                    ,cellMinWidth: cellMinWidth
                    ,cols: cols
                    ,done: done
                });
            }

        }
    });

    return table.render({
        elem: opts['id']
        ,data: opts['data']
        ,page: true
        ,cols: opts['cols']
        ,done: opts['done']
    });
}

/**
 * delete items in layui-table by ajax
 * @param opts
 * @returns {boolean}
 */
function delObject(opts) {
    if (typeof opts === 'undefined' || opts === null) {
        layer.msg('Undefined Params');
        return false;
    }
    var obj = opts['obj'];
    doAjax({
        action: opts['action']
        ,type: 'delete'
        ,data: opts['data']
        ,success: function (data) {
            if (data.status === 200) {
                obj.del();
            }
            layer.msg(data.message);
        }
    });
}

/**
 * update items in layui-table by ajax
 * @param opts
 * @returns {boolean}
 */
function updateObject(opts) {
    if (typeof opts === 'undefined' || opts === null) {
        layer.msg('Undefined Params');
        return false;
    }
    var obj = opts['obj'];
    doAjax({
        action: opts['action']
        ,type: 'post'
        ,data: opts['data']
        ,success: function (data) {
            if (data.status === 200) {
                obj.update(opts['update']);
                layer.close(opts['index']);
            }
            layer.msg(data.message);
        }
    });
}

/**
 * insert items to layui-table by ajax
 * @param opts
 * @returns {boolean}
 */
function insertObject(opts) {
    if(typeof opts === 'undefined' || opts === null) {
        layer.msg('Undefined Params');
        return false;
    }
    doAjax({
        action: opts['action']
        ,type: 'put'
        ,data: opts['data']
        ,success: typeof opts['success'] !== 'undefined' ? opts['success'] : function (data) {
            if (data.status === 200) {
                reloadTableIns({
                    action: opts['action']
                    ,tabIns: opts['tabIns']
                });
            }
        }
    });
}

function getToken () {
    return localStorage.getItem('token');
}

function onLearningPlanColumnClick(obj) {
    console.log(localStorage.getItem('currFormId'));
    var column_content =
        '       <form class="layui-form-item layui-form-text layui-bg-green">\n' +
        '            <label class="layui-form-label layui-bg-green">' + $(obj).text() + '</label>\n' +
        '            <input type="hidden" name="learningplancolumnName" value="' + $(obj).text() + '">\n' +
        '            <input type="hidden" name="learningplanformId" value="' + localStorage.getItem('currFormId') + '">\n' +
        '            <div class="layui-input-block">\n' +
        '                <textarea placeholder="请输入内容" name="learningplancolumnContent" class="layui-textarea" onblur="saveLearningPlanColumnContent(this)"></textarea>\n' +
        '            </div>\n' +
        '        </form>';

    var dom = $('#approve-content');
    if (typeof dom === 'undefined') {
        dom = $('#btns-content');
    }
    dom.before(column_content);
    $('#learning-plan-columns').hide(500);
}

function saveLearningPlanColumnContent(obj) {

    var contentStr = $(obj).val();
    console.log(contentStr);
    if (contentStr.length === 0) {
        layer.msg("内容不能为空！");
        return false;
    }

    $.ajax({
        url: path + 'learningplancolumn/content',
        data: $(obj).parent().parent().serialize(),
        dataType: 'json',
        type: 'post',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', getToken());
        },
        success: function (data) {
            if (data.status === 500) {
                layer.msg(data.message);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

}

function updateApproveContent(content) {
    if (content.length === 0) {
        layer.msg('审批内容不能为空！');
        return false;
    }
    $.ajax({
        url: path + 'learningplan',
        dataType: 'json',
        data: {approveContent: content},
        type: 'post',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', getToken());
        },
        success: function (data) {
            layer.msg(data.message);
        }
    });
}