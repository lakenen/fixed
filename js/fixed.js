var marked = require('meta-marked'),
    highlight = require('highlight.js'),
    currentPath = null,
    path = require('path'),
    url = require('url');


marked.setOptions({
    highlight: function (code, lang, callback) {
        return highlight.highlightAuto(code).value;
    }
});

function get(u, success, fail) {
    var req = new XMLHttpRequest();
    sucess = success || function () {};
    fail = fail || function () {};
    req.open('GET', u, true);
    req.onload = function () {
        if (req.status === 200) {
            success.call(req, req.responseText);
        } else {
            fail.call(req, req.statusText);
        }
    };
    req.send();
}

function renderLayout(name) {
    document.body.innerHTML = window.layouts[name] || window.layouts['default'];
}

function renderBreadcrumbs() {
    var breadcrumbsEl = document.querySelector('.breadcrumbs'),
        crumbs = currentPath.split('/').splice(1),
        html = '<ul><li><a href="#/">[home]</a></li>',
        pathSoFar = '/';
    if (breadcrumbsEl) {
        crumbs.forEach(function (c, i) {
            if (c === 'index') {
                return;
            }
            pathSoFar = path.join(pathSoFar, c, i === crumbs.length ? '' : '/');
            html += '<li><a href="#' + pathSoFar + '">' + c + '</a></li>';
        });
        html += '</ul>';
        breadcrumbsEl.innerHTML = html;
    }
}

function renderPage(markdownString) {
    var mainEl,
        anchors,
        output = marked(markdownString),
        layout = output.meta && output.meta.layout;

    console.log(output.meta);
    renderLayout(layout);
    renderBreadcrumbs();

    mainEl = document.querySelector('.main');
    if (mainEl) {
        mainEl.innerHTML = output.html;
        anchors = mainEl.querySelectorAll('a[href]');
        [].forEach.call(anchors, function (a) {
            var parsedURL = url.parse(a.href);
            if (parsedURL.host === window.location.host) {
                a.href = '#' + parsedURL.pathname;
            }
        });
    }
}

function renderError(errorText) {
    var mainEl = document.querySelector('.main');
    if (mainEl) {
        mainEl.innerText = errorText;
    }
}

function loadPage(pagePath) {
    var pageURL = path.join(window.location.pathname, 'pages', pagePath + '.md');
    get(pageURL, renderPage, renderError);
}

function parseHash() {
    var pagePath = window.location.hash.substr(1);
    if (pagePath === '' || pagePath.substr(-1) === '/') {
        pagePath = path.join(pagePath, 'index');
    }
    return pagePath;
}

function handleHashChange() {
    var newPath = parseHash();
    if (newPath !== currentPath) {
        currentPath = newPath;
        loadPage(newPath);
    }
}

function handleLoad() {
    renderLayout();
    handleHashChange();
}

window.addEventListener('hashchange', handleHashChange, false);
window.addEventListener('load', handleLoad, false);
