define(['jquery', 'jqueryTmpl'], function ($) {
    var prefix = '/_tmpls/';
    var ext = '.html';

    var tmpls = {};
    var stash = {};

    return {
        render: function(tmplName, data, callback, options) {
            if (tmpls[tmplName]) {

                if (tmpls[tmplName] === 1) {
                    // Tmpl is being requested

                    // Stash callbacks
                    if (!stash[tmplName]) stash[tmplName] = [];

                    stash[tmplName].push({
                        data: data,
                        callback: callback,
                        options: options
                    });

                } else {
                    // Tmpl is ready to be rendered
                    callback($.tmpl(tmpls[tmplName], data, options));
                }
            } else {
                // Request tmpl

                tmpls[tmplName] = 1; // Flag it to being requested

                $.get(prefix + tmplName + ext, function (content) {
                    var tmpl = tmpls[tmplName] = $.template(null, content);
                    if (stash[tmplName]) {
                        var stashed;
                        while (stashed = stash[tmplName].shift()) {
                            stashed.callback($.tmpl(
                                tmpl,
                                stashed.data,
                                stashed.options
                            ));
                        }
                        delete stash[tmplName];
                    }
                    callback($.tmpl(tmpl, data, options));
                });
            }
        }
    };
});