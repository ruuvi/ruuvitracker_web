define([], function () {
    var prefix = 'tmpls/';
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
                    callback(tmpls[tmplName](data));
                }
            } else {
                // Request tmpl

                tmpls[tmplName] = 1; // Flag it to being requested

                require(['hbs!'+prefix + tmplName], function(tmpl) {
                    tmpls[tmplName] = tmpl;
                    if (stash[tmplName]) {
                        while (stashed = stash[tmplName].shift()) {
                            stashed.callback(tmpl(
                                stashed.data
                            ));
                        }
                        delete stash[tmplName];
                    }
                    callback(tmpl(data));
                });
            }
        }
    };
});
