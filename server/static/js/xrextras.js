! function(e) {
    var n = {};

    function t(i) {
        if (n[i]) return n[i].exports;
        var r = n[i] = {
            i: i,
            l: !1,
            exports: {}
        };
        return e[i].call(r.exports, r, r.exports, t), r.l = !0, r.exports
    }
    t.m = e, t.c = n, t.d = function(e, n, i) {
        t.o(e, n) || Object.defineProperty(e, n, {
            enumerable: !0,
            get: i
        })
    }, t.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, t.t = function(e, n) {
        if (1 & n && (e = t(e)), 8 & n) return e;
        if (4 & n && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (t.r(i), Object.defineProperty(i, "default", {
                enumerable: !0,
                value: e
            }), 2 & n && "string" != typeof e)
            for (var r in e) t.d(i, r, function(n) {
                return e[n]
            }.bind(null, r));
        return i
    }, t.n = function(e) {
        var n = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return t.d(n, "a", n), n
    }, t.o = function(e, n) {
        return Object.prototype.hasOwnProperty.call(e, n)
    }, t.p = "", t(t.s = 3)
}([function(e, n, t) {
    "use strict";
    e.exports = function(e) {
        var n = [];
        return n.toString = function() {
            return this.map(function(n) {
                var t = function(e, n) {
                    var t = e[1] || "",
                        i = e[3];
                    if (!i) return t;
                    if (n && "function" == typeof btoa) {
                        var r = (a = i, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(a)))) + " */"),
                            o = i.sources.map(function(e) {
                                return "/*# sourceURL=" + i.sourceRoot + e + " */"
                            });
                        return [t].concat(o).concat([r]).join("\n")
                    }
                    var a;
                    return [t].join("\n")
                }(n, e);
                return n[2] ? "@media " + n[2] + "{" + t + "}" : t
            }).join("")
        }, n.i = function(e, t) {
            "string" == typeof e && (e = [[null, e, ""]]);
            for (var i = {}, r = 0; r < this.length; r++) {
                var o = this[r][0];
                null != o && (i[o] = !0)
            }
            for (r = 0; r < e.length; r++) {
                var a = e[r];
                null != a[0] && i[a[0]] || (t && !a[2] ? a[2] = t : t && (a[2] = "(" + a[2] + ") and (" + t + ")"), n.push(a))
            }
        }, n
    }
}, function(e, n, t) {
    var i, r, o = {},
        a = (i = function() {
            return window && document && document.all && !window.atob
        }, function() {
            return void 0 === r && (r = i.apply(this, arguments)), r
        }),
        s = function(e) {
            var n = {};
            return function(e, t) {
                if ("function" == typeof e) return e();
                if (void 0 === n[e]) {
                    var i = function(e, n) {
                        return n ? n.querySelector(e) : document.querySelector(e)
                    }.call(this, e, t);
                    if (window.HTMLIFrameElement && i instanceof window.HTMLIFrameElement) try {
                        i = i.contentDocument.head
                    } catch (e) {
                        i = null
                    }
                    n[e] = i
                }
                return n[e]
            }
        }(),
        l = null,
        d = 0,
        c = [],
        u = t(8);

    function m(e, n) {
        for (var t = 0; t < e.length; t++) {
            var i = e[t],
                r = o[i.id];
            if (r) {
                r.refs++;
                for (var a = 0; a < r.parts.length; a++) r.parts[a](i.parts[a]);
                for (; a < i.parts.length; a++) r.parts.push(w(i.parts[a], n))
            } else {
                var s = [];
                for (a = 0; a < i.parts.length; a++) s.push(w(i.parts[a], n));
                o[i.id] = {
                    id: i.id,
                    refs: 1,
                    parts: s
                }
            }
        }
    }

    function p(e, n) {
        for (var t = [], i = {}, r = 0; r < e.length; r++) {
            var o = e[r],
                a = n.base ? o[0] + n.base : o[0],
                s = {
                    css: o[1],
                    media: o[2],
                    sourceMap: o[3]
                };
            i[a] ? i[a].parts.push(s) : t.push(i[a] = {
                id: a,
                parts: [s]
            })
        }
        return t
    }

    function h(e, n) {
        var t = s(e.insertInto);
        if (!t) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        var i = c[c.length - 1];
        if ("top" === e.insertAt) i ? i.nextSibling ? t.insertBefore(n, i.nextSibling) : t.appendChild(n) : t.insertBefore(n, t.firstChild), c.push(n);
        else if ("bottom" === e.insertAt) t.appendChild(n);
        else {
            if ("object" != typeof e.insertAt || !e.insertAt.before) throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
            var r = s(e.insertAt.before, t);
            t.insertBefore(n, r)
        }
    }

    function f(e) {
        if (null === e.parentNode) return !1;
        e.parentNode.removeChild(e);
        var n = c.indexOf(e);
        n >= 0 && c.splice(n, 1)
    }

    function g(e) {
        var n = document.createElement("style");
        if (void 0 === e.attrs.type && (e.attrs.type = "text/css"), void 0 === e.attrs.nonce) {
            var i = function() {
                0;
                return t.nc
            }();
            i && (e.attrs.nonce = i)
        }
        return v(n, e.attrs), h(e, n), n
    }

    function v(e, n) {
        Object.keys(n).forEach(function(t) {
            e.setAttribute(t, n[t])
        })
    }

    function w(e, n) {
        var t, i, r, o;
        if (n.transform && e.css) {
            if (!(o = "function" == typeof n.transform ? n.transform(e.css) : n.transform.default(e.css))) return function() {};
            e.css = o
        }
        if (n.singleton) {
            var a = d++;
            t = l || (l = g(n)), i = y.bind(null, t, a, !1), r = y.bind(null, t, a, !0)
        } else e.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (t = function(e) {
            var n = document.createElement("link");
            return void 0 === e.attrs.type && (e.attrs.type = "text/css"), e.attrs.rel = "stylesheet", v(n, e.attrs), h(e, n), n
        }(n), i = function(e, n, t) {
            var i = t.css,
                r = t.sourceMap,
                o = void 0 === n.convertToAbsoluteUrls && r;
            (n.convertToAbsoluteUrls || o) && (i = u(i));
            r && (i += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(r)))) + " */");
            var a = new Blob([i], {
                    type: "text/css"
                }),
                s = e.href;
            e.href = URL.createObjectURL(a), s && URL.revokeObjectURL(s)
        }.bind(null, t, n), r = function() {
            f(t), t.href && URL.revokeObjectURL(t.href)
        }) : (t = g(n), i = function(e, n) {
            var t = n.css,
                i = n.media;
            i && e.setAttribute("media", i);
            if (e.styleSheet) e.styleSheet.cssText = t;
            else {
                for (; e.firstChild;) e.removeChild(e.firstChild);
                e.appendChild(document.createTextNode(t))
            }
        }.bind(null, t), r = function() {
            f(t)
        });
        return i(e),
            function(n) {
                if (n) {
                    if (n.css === e.css && n.media === e.media && n.sourceMap === e.sourceMap) return;
                    i(e = n)
                } else r()
            }
    }
    e.exports = function(e, n) {
        if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
        (n = n || {}).attrs = "object" == typeof n.attrs ? n.attrs : {}, n.singleton || "boolean" == typeof n.singleton || (n.singleton = a()), n.insertInto || (n.insertInto = "head"), n.insertAt || (n.insertAt = "bottom");
        var t = p(e, n);
        return m(t, n),
            function(e) {
                for (var i = [], r = 0; r < t.length; r++) {
                    var a = t[r];
                    (s = o[a.id]).refs--, i.push(s)
                }
                e && m(p(e, n), n);
                for (r = 0; r < i.length; r++) {
                    var s;
                    if (0 === (s = i[r]).refs) {
                        for (var l = 0; l < s.parts.length; l++) s.parts[l]();
                        delete o[s.id]
                    }
                }
            }
    };
    var x, b = (x = [], function(e, n) {
        return x[e] = n, x.filter(Boolean).join("\n")
    });

    function y(e, n, t, i) {
        var r = t ? "" : i.css;
        if (e.styleSheet) e.styleSheet.cssText = b(n, r);
        else {
            var o = document.createTextNode(r),
                a = e.childNodes;
            a[n] && e.removeChild(a[n]), a.length ? e.insertBefore(o, a[n]) : e.appendChild(o)
        }
    }
}, function(e, n, t) {
    var i = t(7);
    "string" == typeof i && (i = [[e.i, i, ""]]);
    var r = {
        hmr: !0,
        transform: void 0,
        insertInto: void 0
    };
    t(1)(i, r);
    i.locals && (e.exports = i.locals)
}, function(e, n, t) {
    const i = t(4),
        r = () => {
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent("xrandextrasloaded"))
            }, 1)
        };
    window.XR && "function" == typeof window.XR && (window.nativeXR = window.XR, window.XR = void 0), window.XRExtras = i.XRExtras, setTimeout(() => {
        window.dispatchEvent(new CustomEvent("xrextrasloaded"))
    }, 1), window.XR ? r() : window.addEventListener("xrloaded", r)
}, function(e, n, t) {
    const {
        AFrameFactory: i
    } = t(5), {
        AlmostThereFactory: r
    } = t(6), {
        DebugWebViewsFactory: o
    } = t(12), {
        FullWindowCanvasFactory: a
    } = t(13), {
        LoadingFactory: s
    } = t(14), {
        RuntimeErrorFactory: l
    } = t(18);
    e.exports = {
        XRExtras: {
            AFrame: i(),
            AlmostThere: r(),
            DebugWebViews: o(),
            FullWindowCanvas: a(),
            Loading: s(),
            RuntimeError: l()
        }
    }
}, function(e, n) {
    let t = null;
    const i = () => {
        XR.addCameraPipelineModule(XRExtras.Loading.pipelineModule())
    };
    const r = () => {
            const e = document.getElementsByTagName("a-scene")[0];
            if (!e) return;
            const n = e.attributes;
            Object.keys(n).forEach(e => {
                const t = n.item(e).name;
                if ("xrextras-almost-there" == t) {
                    const t = new RegExp("url:([^;]*)").exec(n.item(e).value);
                    t && window.XRExtras.AlmostThere.configure({
                        url: t[1]
                    }), window.XR ? window.XRExtras.AlmostThere.checkCompatibility() : window.addEventListener("xrloaded", window.XRExtras.AlmostThere.checkCompatibility)
                }
                "xrextras-loading" == t && window.XRExtras.Loading.showLoading({
                    onxrloaded: i
                })
            })
        },
        o = window.onload;
    window.onload = (() => {
        o && o(), window.XRExtras ? r() : window.addEventListener("xrextrasloaded", r)
    }), e.exports = {
        AFrameFactory: () => (t || (t = function() {
            let e = !1;
            const n = () => {
                !e && window.AFRAME && (e = !0, AFRAME.registerComponent("xrextras-almost-there", {
                    schema: {
                        url: {
                            default: ""
                        }
                    },
                    init: function() {
                        const e = () => {
                            this.data.url && XRExtras.AlmostThere.configure({
                                url: this.data.url
                            }), XR.addCameraPipelineModule(XRExtras.AlmostThere.pipelineModule())
                        };
                        window.XRExtras && window.XR ? e() : window.addEventListener("xrandextrasloaded", e)
                    }
                }), AFRAME.registerComponent("xrextras-loading", {
                    init: function() {
                        let e = !1;
                        this.el.addEventListener("loaded", () => {
                            e = !0
                        });
                        const n = () => e,
                            t = () => {
                                XRExtras.Loading.setAppLoadedProvider(n), XRExtras.Loading.showLoading({
                                    onxrloaded: i
                                })
                            };
                        window.XRExtras ? t() : window.addEventListener("xrextrasloaded", t)
                    }
                }), AFRAME.registerComponent("xrextras-runtime-error", {
                    init: function() {
                        const e = () => {
                            XR.addCameraPipelineModule(XRExtras.RuntimeError.pipelineModule())
                        };
                        window.XRExtras && window.XR ? e() : window.addEventListener("xrandextrasloaded", e)
                    }
                }), AFRAME.registerComponent("xrextras-tap-recenter", {
                    init: function() {
                        const e = this.el.sceneEl;
                        e.addEventListener("click", () => {
                            e.emit("recenter", {})
                        })
                    }
                }), AFRAME.registerComponent("xrextras-generate-image-targets", {
                    schema: {
                        primitive: {
                            type: "string"
                        }
                    },
                    init: function() {
                        const e = {},
                            n = n => {
                                const t = e[n.detail.name];
                                t && t.emit(n.type, n.detail, !1)
                            };
                        this.el.sceneEl.addEventListener("xrimageloading", ({
                            detail: n
                        }) => {
                            n.imageTargets.forEach(({
                                name: n,
                                metadata: t,
                                properties: i
                            }) => {
                                const r = document.createElement(this.data.primitive);
                                r.setAttribute("id", `xrextras-imagetargets-${n}`), r.setAttribute("name", n), r.setAttribute("rotated", i.isRotated ? "true" : "false"), r.setAttribute("metadata", "string" == typeof t ? t : JSON.stringify(t)), document.querySelector("a-scene").appendChild(r), e[n] = r
                            })
                        }), this.el.sceneEl.addEventListener("xrimagefound", n), this.el.sceneEl.addEventListener("xrimageupdated", n), this.el.sceneEl.addEventListener("xrimagelost", n)
                    }
                }), AFRAME.registerComponent("xrextras-named-image-target", {
                    schema: {
                        name: {
                            type: "string"
                        }
                    },
                    init: function() {
                        const e = this.el.object3D,
                            n = this.data.name;
                        e.visible = !1;
                        const t = ({
                            detail: t
                        }) => {
                            n == t.name && (e.position.copy(t.position), e.quaternion.copy(t.rotation), e.scale.set(t.scale, t.scale, t.scale), e.visible = !0)
                        };
                        this.el.sceneEl.addEventListener("xrimagefound", t), this.el.sceneEl.addEventListener("xrimageupdated", t), this.el.sceneEl.addEventListener("xrimagelost", ({
                            detail: t
                        }) => {
                            n == t.name // && (e.visible = !1)
                        })
                    }
                }), AFRAME.registerComponent("xrextras-gesture-detector", {
                    schema: {
                        element: {
                            default: ""
                        }
                    },
                    init: function() {
                        this.targetElement = this.data.element && document.querySelector(this.data.element), this.targetElement || (this.targetElement = this.el), this.internalState = {
                            previousState: null
                        }, this.emitGestureEvent = this.emitGestureEvent.bind(this), this.targetElement.addEventListener("touchstart", this.emitGestureEvent), this.targetElement.addEventListener("touchend", this.emitGestureEvent), this.targetElement.addEventListener("touchmove", this.emitGestureEvent)
                    },
                    remove: function() {
                        this.targetElement.removeEventListener("touchstart", this.emitGestureEvent), this.targetElement.removeEventListener("touchend", this.emitGestureEvent), this.targetElement.removeEventListener("touchmove", this.emitGestureEvent)
                    },
                    emitGestureEvent(e) {
                        const n = this.getTouchState(e),
                            t = this.internalState.previousState,
                            i = t && n && n.touchCount == t.touchCount,
                            r = t && !i,
                            o = n && !i;
                        if (r) {
                            const e = this.getEventPrefix(t.touchCount) + "fingerend";
                            this.el.emit(e, t), this.internalState.previousState = null
                        }
                        if (o) {
                            n.startTime = performance.now(), n.startPosition = n.position, n.startSpread = n.spread;
                            const e = this.getEventPrefix(n.touchCount) + "fingerstart";
                            this.el.emit(e, n), this.internalState.previousState = n
                        }
                        if (i) {
                            const e = {
                                positionChange: {
                                    x: n.position.x - t.position.x,
                                    y: n.position.y - t.position.y
                                }
                            };
                            n.spread && (e.spreadChange = n.spread - t.spread), Object.assign(t, n), Object.assign(e, t);
                            const i = this.getEventPrefix(n.touchCount) + "fingermove";
                            this.el.emit(i, e)
                        }
                    },
                    getTouchState: function(e) {
                        if (0 == e.touches.length) return null;
                        const n = [];
                        for (let t = 0; t < e.touches.length; t++) n.push(e.touches[t]);
                        const t = {
                                touchCount: n.length
                            },
                            i = n.reduce((e, n) => e + n.clientX, 0) / n.length,
                            r = n.reduce((e, n) => e + n.clientY, 0) / n.length;
                        t.positionRaw = {
                            x: i,
                            y: r
                        };
                        const o = 2 / (window.innerWidth + window.innerHeight);
                        if (t.position = {
                                x: i * o,
                                y: r * o
                            }, n.length >= 2) {
                            const e = n.reduce((e, n) => e + Math.sqrt(Math.pow(i - n.clientX, 2) + Math.pow(r - n.clientY, 2)), 0) / n.length;
                            t.spread = e * o
                        }
                        return t
                    },
                    getEventPrefix: e => ["one", "two", "three", "many"][Math.min(e, 4) - 1]
                }), AFRAME.registerComponent("xrextras-one-finger-rotate", {
                    init: function() {
                        this.handleEvent = this.handleEvent.bind(this), this.el.sceneEl.addEventListener("onefingermove", this.handleEvent), this.el.setAttribute("class", "cantap")
                    },
                    remove: function() {
                        this.el.sceneEl.removeEventListener("onefingermove", this.handleEvent)
                    },
                    handleEvent: function(e) {
                        this.el.object3D.rotation.y += 6 * e.detail.positionChange.x
                    }
                }), AFRAME.registerComponent("xrextras-play-video", {
                    schema: {
                        video: {
                            type: "string"
                        },
                        thumb: {
                            type: "string"
                        },
                        canstop: {
                            type: "bool"
                        }
                    },
                    init: function() {
                        const e = document.querySelector(this.data.video),
                            n = this.data.thumb && document.querySelector(this.data.thumb),
                            t = this.el;
                        t.setAttribute("material", "src", n || e), t.setAttribute("class", "cantap");
                        let i = !1;
                        t.addEventListener("click", () => {
                            i ? this.data.canstop && (t.setAttribute("material", "src", n || e), e.pause(), i = !1) : (t.setAttribute("material", "src", e), e.play(), i = !0)
                        })
                    }
                }), AFRAME.registerComponent("xrextras-log-to-screen", {
                    init: function() {
                        XRExtras.DebugWebViews.enableLogToScreen()
                    }
                }))
            };
            return n(), {
                registerXrExtrasComponents: n
            }
        }()), t)
    }
}, function(e, n, t) {
    t(2), t(9);
    const i = t(11);
    let r = null;
    e.exports = {
        AlmostThereFactory: () => (r || (r = function() {
            let e, n = !1;
            const t = e => {
                    document.getElementById(e).classList.remove("hidden")
                },
                r = () => !(n || !XR.XrDevice.isDeviceBrowserCompatible() && ((() => {
                    const n = document.createElement("template");
                    n.innerHTML = i.trim();
                    const r = n.content.firstChild;
                    document.getElementsByTagName("body")[0].appendChild(r);
                    const o = e || window.location.href,
                        a = r.querySelectorAll(".desktop-home-link");
                    for (let e = 0; e < a.length; e++) a[e].textContent = o;
                    const s = XR.XrDevice.incompatibleReasons(),
                        l = XR.XrDevice.incompatibleReasonDetails(),
                        d = XR.XrDevice.deviceEstimate();
                    for (let e of s) switch (e) {
                        case XR.XrDevice.IncompatibilityReasons.UNSUPPORTED_BROWSER:
                            if ("iOS" == d.os) {
                                if ("Safari" == l.inAppBrowserType) return t("error_msg_open_in_safari"), void t("apple_open_safari_hint");
                                if ("Ellipsis" == l.inAppBrowserType) return t("error_msg_open_in_safari"), void t("apple_tap_to_open_safari_hint")
                            }
                    }
                    if ("iOS" == d.os) return void t("error_msg_apple_almost_there");
                    if ("Android" == d.os) return void t("error_msg_android_almost_there");
                    t("error_msg_device");
                    const c = document.createElement("script");
                    c.type = "text/javascript", c.src = "https://cdn.8thwall.com/web/share/qrcode8.js", c.onload = (() => {
                        document.getElementById("qrcode").innerHTML = qrcode8.generateQRHtml(o)
                    }), document.getElementById("almostthereContainer").appendChild(c)
                })(), n = !0, XR.pause(), XR.stop(), 1));
            return {
                pipelineModule: () => ({
                    name: "almostthere",
                    onCameraStatusChange: () => {
                        if (!r()) throw Error("Device or browser incompatible with XR.")
                    },
                    onException: () => {
                        r()
                    }
                }),
                checkCompatibility: r,
                configure: ({
                    url: n
                }) => {
                    void 0 !== n && (e = n)
                }
            }
        }()), r)
    }
}, function(e, n, t) {
    (e.exports = t(0)(!1)).push([e.i, "@font-face {\n  font-family: 'Raleway-Regular';\n  src: url('//cdn.8thwall.com/web/fonts/raleway-regular.woff') format('woff'), /* Modern Browsers */\n       url('//cdn.8thwall.com/web/fonts/raleway-regular.ttf')  format('truetype') /* Safari, Android, iOS */\n}\n\n@font-face {\n  font-family: 'Raleway-Bold';\n  src: url('//cdn.8thwall.com/web/fonts/raleway-bold.woff') format('woff'), /* Modern Browsers */\n       url('//cdn.8thwall.com/web/fonts/raleway-bold.ttf')  format('truetype') /* Safari, Android, iOS */\n}\n\n@font-face {\n  font-family: 'Varela-Round';\n  src: url('//cdn.8thwall.com/web/fonts/VarelaRound-Regular.woff') format('woff'), /* Modern Browsers */\n       url('//cdn.8thwall.com/web/fonts/VarelaRound-Regular.ttf')  format('truetype') /* Safari, Android, iOS */\n}\n", ""])
}, function(e, n) {
    e.exports = function(e) {
        var n = "undefined" != typeof window && window.location;
        if (!n) throw new Error("fixUrls requires window.location");
        if (!e || "string" != typeof e) return e;
        var t = n.protocol + "//" + n.host,
            i = t + n.pathname.replace(/\/[^\/]*$/, "/");
        return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(e, n) {
            var r, o = n.trim().replace(/^"(.*)"$/, function(e, n) {
                return n
            }).replace(/^'(.*)'$/, function(e, n) {
                return n
            });
            return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(o) ? e : (r = 0 === o.indexOf("//") ? o : 0 === o.indexOf("/") ? t + o : i + o.replace(/^\.\//, ""), "url(" + JSON.stringify(r) + ")")
        })
    }
}, function(e, n, t) {
    var i = t(10);
    "string" == typeof i && (i = [[e.i, i, ""]]);
    var r = {
        hmr: !0,
        transform: void 0,
        insertInto: void 0
    };
    t(1)(i, r);
    i.locals && (e.exports = i.locals)
}, function(e, n, t) {
    (e.exports = t(0)(!1)).push([e.i, "* {\n  font-family: inherit;\n  box-sizing: inherit;\n}\n\n#almostthereContainer {\n  z-index: 820;\n  background-color: #FFFFFF;\n}\n\n.absolute-fill {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n}\n\n.hidden {\n  display: none !important;\n}\n\n.apple-safari-hint {\n  position: fixed;\n  bottom: 3%;\n  right: 8%;\n  height: 72px;\n}\n\n.desktop-home-link {\n  padding-top: 5px;\n  padding-bottom: 5px;\n  padding-left: 5px;\n  padding-right: 5px;\n  background-color:rgba(173, 80, 255, 0.2);\n  -webkit-user-select: all;  /* Chrome 49+ */\n  -moz-user-select: all;     /* Firefox 43+ */\n  -ms-user-select: all;      /* No support yet */\n  user-select: all;\n  pointer-events: auto;\n}\n\n.error-text-outer-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.error-margin-top-5 {\n  margin-top: 5vh;\n}\n\n.error-margin-top-20 {\n  margin-top: 20vh;\n}\n\n.error-text-container {\n  flex: 0 0 auto;\n  text-align: center;\n  width: 90%;\n}\n\n.error-text-header {\n  font-family: 'Varela-Round', sans-serif;\n  font-size: 18pt;\n  color: #323232;\n  letter-spacing: .37;\n  line-height: 23pt;\n}\n\n.error-text-detail {\n  font-family: 'Varela-Round', sans-serif;\n  font-size: 14pt;\n  color: #323232;\n  letter-spacing: .37;\n  line-height: 23pt;\n}\n\n.error-text-hint {\n  font-family: 'Raleway-Regular', sans-serif;\n  font-size: 14pt;\n  color: #A8A8BA;\n  letter-spacing: .37;\n}\n", ""])
}, function(e, n) {
    e.exports = '<div id="almostthereContainer" class="absolute-fill">\n  \x3c!--Not on mobile --\x3e\n  <div id="error_msg_device" class="hidden">\n    <div class="error-text-outer-container">\n      <div class="error-text-container error-margin-top-20">\n        <div id="qrcode"></div>\n        <br/>\n        <div class="error-text-header">\n          <span style="font-size:24pt;line-height:20pt;">\n            Hey! Looks like you\'re on a desktop.\n          </span>\n        </div>\n        <div class="error-text-hint">\n          <span style="font-size:15pt;line-height:50pt;letter-spacing:-.21;color:#323232">\n            For the augmented reality experience, scan this code\n          </span>\n        </div>\n        <div class="error-text-hint">\n          <span style="font-size:15pt;line-height:20pt;letter-spacing:-.21;color:#323232">\n            or visit <span class="desktop-home-link"></span>\n            on a smartphone or tablet.\n          </span>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  \x3c!--iOS webview, reachable from button press --\x3e\n  <div id="error_msg_open_in_safari" class="hidden">\n    <div class="error-text-outer-container">\n      <div class="error-text-container error-margin-top-5">\n        <p><img src="//cdn.8thwall.com/web/img/almostthere/v1/safari-icon.png"></p>\n        <div class="error-text-header">You\'re almost there!</div>\n        <div class="error-text-detail">\n          To view this experience on your iPhone, please open in Safari.\n        </div>\n        <br/>\n        <img id="apple_open_safari_hint"\n          src="//cdn.8thwall.com/web/img/almostthere/v1/open-in-safari.png"\n          class="apple-safari-hint hidden"/>\n        <img id="apple_tap_to_open_safari_hint"\n          src="//cdn.8thwall.com/web/img/almostthere/v1/tap-to-open-in-safari.png"\n          class="apple-safari-hint hidden"/>\n      </div>\n    </div>\n  </div>\n\n  \x3c!--iOS webview, requires copy/paste of link --\x3e\n  <div id="error_msg_apple_almost_there" class="hidden">\n    <div class="error-text-outer-container">\n      <div class="error-text-container error-margin-top-5">\n        <p><img src="//cdn.8thwall.com/web/img/almostthere/v1/safari-icon.png"></p>\n        <div class="error-text-header">You\'re almost there!</div>\n        <div class="error-text-detail">\n          To view this experience on your iPhone, please open in Safari.\n        </div>\n        <br/>\n        <p><span class="desktop-home-link"></span></p>\n        <div id="apple_copy_hint" class="error-text-hint">\n          Open your Safari browser and paste.\n        </div>\n      </div>\n    </div>\n  </div>\n\n  \x3c!--Android unsupported browser --\x3e\n  <div id="error_msg_android_almost_there" class="hidden">\n    <div class="error-text-outer-container">\n      <div class="error-text-container error-margin-top-5">\n        <p><img height="100px" src="//cdn.8thwall.com/web/img/almostthere/v1/google-chrome.png"></p>\n        <div class="error-text-header">You\'re almost there!</div>\n        <div class="error-text-detail">\n          To view this experience on your Android device, please open in Google Chrome or your\n          native browser.\n        </div>\n        <br/>\n        <p><span class="desktop-home-link"></span></p>\n        <div id="android_copy_hint" class="error-text-hint">Open your browser and paste.</div>\n      </div>\n    </div>\n  </div>\n</div>\n'
}, function(e, n) {
    let t = null;
    e.exports = {
        DebugWebViewsFactory: () => (t || (t = function() {
            let e = "";
            const n = window.console.log;
            return {
                enableLogToScreen: () => {
                    const t = t => {
                        n(t), e = e + "* " + t + "<br>";
                        let i = document.getElementById("logdiv");
                        if (!i) {
                            const e = document.getElementsByTagName("body")[0];
                            if (!e) return;
                            i = document.createElement("div"), e.appendChild(i), i.style.zIndex = 850, i.style.position = "absolute", i.style.top = "0px", i.style.left = "0px", i.style.backgroundColor = "#FFFFFF", i.id = "logdiv"
                        }
                        i.innerHTML = "<pre>" + e + "</pre>"
                    };
                    window.console.log = t, window.console.error = (e => {
                        t(`<font color=red>${e}</font>`)
                    }), window.console.warn = (e => {
                        t(`<font color=orange>${e}</font>`)
                    })
                }
            }
        }()), t)
    }
}, function(e, n) {
    let t = null;
    e.exports = {
        FullWindowCanvasFactory: () => (null == t && (t = function() {
            let e = null;
            const n = ({
                    orientation: t
                }) => {
                    const i = window.innerWidth,
                        r = window.innerHeight;
                    (0 == t || 180 == t) && i > r || (90 == t || -90 == t) && r > i ? window.requestAnimationFrame(() => n({
                        orientation: t
                    })) : (e.width = i, e.height = r)
                },
                t = ({
                    canvas: t,
                    orientation: i
                }) => {
                    e = t;
                    const r = document.getElementsByTagName("body")[0];
                    r.style.margin = "0px", r.style.width = "100%", r.style.height = "100%", r.appendChild(e), n({
                        orientation: i
                    })
                },
                i = ({
                    orientation: e
                }) => {
                    n({
                        orientation: e
                    })
                };
            return {
                pipelineModule: () => ({
                    name: "fullwindowcanvas",
                    onStart: t,
                    onDeviceOrientationChange: i
                })
            }
        }()), t)
    }
}, function(e, n, t) {
    t(2), t(15);
    const i = t(17);
    let r = null;
    e.exports = {
        LoadingFactory: () => (r || (r = function() {
            let e, n, t, r, o, a, s, l = null,
                d = () => !0,
                c = 0,
                u = !1,
                m = !1;
            const p = navigator.userAgent;
            let h = !1;
            const f = () => {
                h = !0, window.removeEventListener("devicemotion", f)
            };
            window.addEventListener("devicemotion", f);
            const g = e => {
                (e.data.deviceOrientation8w || e.data.deviceMotion8w) && (h = !0, window.removeEventListener("message", g))
            };
            window.addEventListener("message", g);
            const v = (n = !0) => {
                    e.classList.add("hidden"), n && l.parentNode && l.parentNode.removeChild(l)
                },
                w = (t = !0) => {
                    n.classList.add("fade-out"), setTimeout(() => {
                        e.classList.add("fade-out"), e.style.pointerEvents = "none", setTimeout(() => v(t), 400)
                    }, 400)
                },
                x = () => {
                    t.classList.add("fade-out")
                },
                b = () => {
                    if (d() && !u) return m && (document.cookie = "previouslyGotCameraPermission=true;max-age=31536000"), void w();
                    requestAnimationFrame(() => {
                        b()
                    })
                },
                y = p.includes("Linux");
            m = y && !document.cookie.includes("previouslyGotCameraPermission=true");
            const E = y && !m,
                R = d => {
                    if (l) return;
                    const c = document.createElement("template");
                    c.innerHTML = i.trim();
                    const m = c.content.firstChild;
                    document.getElementsByTagName("body")[0].appendChild(m), (i => {
                        e = (l = i).querySelector("#loadBackground"), n = l.querySelector("#loadImageContainer"), t = document.getElementById("requestingCameraPermissions"), r = document.getElementById("cameraPermissionsErrorAndroid"), o = document.getElementById("cameraPermissionsErrorApple"), a = document.getElementById("cameraPermissionsErrorSamsung"), s = document.getElementById("deviceMotionErrorApple")
                    })(m), u = !0, d && d.onxrloaded && (window.XR ? d.onxrloaded() : window.addEventListener("xrloaded", d.onxrloaded))
                };
            return {
                pipelineModule: () => ({
                    name: "loading",
                    onStart: () => {
                        !0 !== h && (() => {
                            if (window.removeEventListener("devicemotion", f), window.removeEventListener("message", g), "iOS" === XR.XrDevice.deviceEstimate().os) {
                                if (XR.XrPermissions) {
                                    const e = XR.XrPermissions.permissions(),
                                        n = XR.requiredPermissions();
                                    if (!n.has(e.DEVICE_MOTION) && !n.has(e.DEVICE_ORIENTATION)) return
                                }
                                s.classList.remove("hidden"), w(!1), XR.pause(), XR.stop()
                            }
                        })()
                    },
                    onUpdate: () => {
                        u && (c < 5 ? ++c : (u = !1, b()))
                    },
                    onCameraStatusChange: ({
                        status: e
                    }) => {
                        XR.XrDevice.isDeviceBrowserCompatible() && ("requesting" == e ? (R(), E || t.classList.remove("hidden")) : "hasStream" == e ? E || x() : "hasVideo" == e || "failed" == e && (() => {
                            if (t.classList.add("hidden"), p.includes("Linux")) {
                                let e;
                                const n = l.querySelectorAll(".domain-view");
                                for (let e = 0; e < n.length; e++) n[e].textContent = window.location.hostname;
                                e = navigator.userAgent.includes("SamsungBrowser") ? l.querySelectorAll(".samsung-instruction") : l.querySelectorAll(".chrome-instruction"), r.classList.remove("hidden");
                                for (let n = 0; n < e.length; n++) e[n].classList.remove("hidden")
                            } else o.classList.remove("hidden");
                            w(!1), XR.pause(), XR.stop()
                        })())
                    },
                    onException: () => {
                        l && (x(), v())
                    }
                }),
                showLoading: R,
                setAppLoadedProvider: e => {
                    d = e
                }
            }
        }()), r)
    }
}, function(e, n, t) {
    var i = t(16);
    "string" == typeof i && (i = [[e.i, i, ""]]);
    var r = {
        hmr: !0,
        transform: void 0,
        insertInto: void 0
    };
    t(1)(i, r);
    i.locals && (e.exports = i.locals)
}, function(e, n, t) {
    (e.exports = t(0)(!1)).push([e.i, "#loadingContainer * {\n  font-family: inherit;\n  box-sizing: inherit;\n}\n\n#loadingContainer {\n  z-index: 800;\n  font-family: 'Varela-Round', sans-serif;\n}\n\n.absolute-fill {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n}\n\n.hidden {\n  display: none !important;\n}\n\n#loadBackground {\n  z-index: 10;\n  background-color: white;\n  pointer-events: auto;\n}\n\n#requestingCameraPermissions {\n  z-index: 11;\n  position: absolute;\n  top: 0;\n  width: 100vw;\n  text-align: center;\n  color: white;\n  font-size: 3.7vh;\n  background-color: #7611B7;\n  padding: 3vh 0;\n}\n\n#requestingCameraIcon {\n  display: block;\n  margin: 0 auto;\n  margin-bottom: 2vh;\n  height: 7vh;\n}\n\n#loadImage {\n  position: absolute;\n  margin-top: -2.5em;\n  margin-left: -2.5em;\n  top: 50%;\n  left: 50%;\n  height: 5em;\n  width: 5em;\n  transform: translate(-50%, -50%);\n}\n\n#cameraPermissionsErrorApple {\n  padding: 20vh 5vw;\n  font-size: 6.5vmin;\n  text-align: center;\n  background-color: white;\n}\n\n#cameraPermissionsErrorAppleArrow {\n  position: absolute;\n  right: 5vmin;\n  top: 15vmin;\n  width: 20vmin;\n  transform: rotate(130deg);\n}\n\n#cameraPermissionsErrorAppleReloadCamera {\n  display: block;\n  margin: 0 auto;\n  margin-top: 10vh;\n  max-width: 30vw;\n}\n\n#cameraPermissionsErrorAndroid {\n  padding: 2vh 0;\n  display: flex;\n  flex-direction: column;\n  pointer-events: auto;\n  justify-content: space-around;\n  align-items: center;\n  background-color: white;\n}\n\n#deviceMotionErrorApple {\n  padding: 3vh 2vh;\n  color: #2D2E43;\n  display: flex;\n  flex-direction: column;\n  pointer-events: auto;\n  justify-content: space-around;\n  align-items: center;\n  background-color: white;\n}\n\n#cameraPermissionsCameraIcon{\n  overflow: hidden;\n  flex: 0 0 auto;\n  margin-bottom: 2vh;\n}\n\n#cameraPermissionsCameraIcon img {\n  display: block;\n  margin: 0 auto;\n  height: 5vh;\n}\n\n.loading-error-header {\n  font-size: 3.5vh;\n  flex: 0 0 auto;\n}\n\n.loading-error-footer {\n  font-size: 3vh;\n  line-height: 5.5vh;\n  flex: 0 0 auto;\n  text-align: center;\n  width: 80vmin\n}\n\n.loading-error-footer img {\n  display: block;\n  height: 5vh;\n  margin: 0 auto;\n  margin-bottom: 2vh;\n}\n\n.loading-error-instructions {\n  font-family: 'Raleway-Regular', sans-serif;\n  color: #2D2E43;\n  font-size: 2.5vh;\n  list-style: none;\n  margin-left: 1em;\n  counter-reset: line;\n  flex: 0 0 auto;\n}\n\n.loading-error-instructions > li {\n  position: relative;\n  margin-bottom: 5vh;\n}\n\n.loading-error-instructions > li > img {\n  max-height: 3vh;\n  vertical-align: middle;\n  margin: 0 .5vh;\n}\n\n.loading-error-instructions > li:before {\n  font-family: 'Varela-Round', sans-serif;\n  position: absolute;\n  width: 6vh;\n  height: 6vh;\n  border-radius: 3vh;\n  color: #fff;\n  background-color: rgba(218, 209, 228, 128);\n  text-align:center;\n  left: -8vh;\n  top: -1vh;\n  font-size: 2.5vh;\n  line-height: 6.5vh;\n  counter-increment: line;\n  content: counter(line);\n}\n\n.highlight {\n  color: #7611B7;\n  font-family: 'Raleway-Bold', sans-serif;\n  font-weight: bold;\n}\n\n.camera-instruction-block {\n  display: inline-block;\n  background-color: #EBEBEB;\n  padding: 1vh;\n}\n\n.camera-instruction-button {\n  display: inline-block;\n  background-color: #EBEBEB;\n  padding: 1vh;\n  background-color: #359AFF;\n  color: white;\n  font-size: 2vh;\n  box-shadow: 0 .125vh .25vh rgba(0, 0, 0, 0.5);\n}\n\n.rotate-center {animation: rotate-center 1.1s cubic-bezier(0.785, 0.135, 0.150, 0.860) infinite both;}\n@keyframes rotate-center {\n  0% {transform: rotate(0);}\n  100% {transform: rotate(360deg);}\n}\n\n.fade-out { animation: fade-out 0.3s linear forwards; }\n@keyframes fade-out {\n  0% {opacity: 1;}\n  100% {opacity: 0;}\n}\n\n", ""])
}, function(e, n) {
    e.exports = '<div id="loadingContainer" class="absolute-fill">\n  \x3c!--Loading screen--\x3e\n  <div id="loadBackground" class="absolute-fill">\n    <div id="loadImageContainer" class="absolute-fill">\n      <img src="//cdn.8thwall.com/web/img/loading/v1/eight.png" id="loadImage" class="rotate-center" />\n    </div>\n  </div>\n\n  \x3c!--Camera Permissions--\x3e\n  <div id="requestingCameraPermissions" class="hidden" />\n    <img id="requestingCameraIcon" src="//cdn.8thwall.com/web/img/loading/v1/camera-purple.png" />\n    Tap "Allow" so we can<br>augment your reality.\n  </div>\n\n  \x3c!--Permission error, iOS--\x3e\n  <div id="cameraPermissionsErrorApple" class="absolute-fill hidden" />\n    Refresh the page to enable<br>your camera for AR\n    <img id="cameraPermissionsErrorAppleArrow" src="//cdn.8thwall.com/web/img/loading/v1/arrow.png" />\n    <img id="cameraPermissionsErrorAppleReloadCamera" src="//cdn.8thwall.com/web/img/loading/v1/reload-camera.png" />\n  </div>\n\n  \x3c!--Permission error, Android--\x3e\n  <div id="cameraPermissionsErrorAndroid" class="absolute-fill hidden">\n    <div id="cameraPermissionsCameraIcon">\n      <img src="//cdn.8thwall.com/web/img/loading/v1/camera-purple.png" />\n    </div>\n    <div class="loading-error-header">Let\'s enable your camera</div>\n    <ol class="loading-error-instructions">\n      <li>Tap the <img src="//cdn.8thwall.com/web/img/loading/v1/ellipsis.png"> in the top right</li>\n      <li>Tap <span class="highlight">Settings</li>\n      <li class="chrome-instruction hidden">\n        <span class="highlight">Site settings</span>\n      </li>\n      <li class="chrome-instruction hidden">\n        <span class="highlight">Camera</span>\n      </li>\n      <li class="chrome-instruction hidden">\n        <span class="highlight">Blocked</span>\n        <br>\n        <span class="camera-instruction-block domain-view">apps.8thwall.com</span>\n      </li>\n      <li class="chrome-instruction hidden">\n        <span class="camera-instruction-button">CLEAR & RESET</span>\n      </li>\n      <li class="samsung-instruction hidden">\n        <span class="highlight">Advanced</span>\n      </li>\n      <li class="samsung-instruction hidden">\n        <span class="highlight">Manage website data</span>\n      </li>\n      <li class="samsung-instruction hidden">\n        Press and hold<br>\n        <span class="camera-instruction-block domain-view">apps.8thwall.com</span>\n      </li>\n      <li class="samsung-instruction hidden">\n        <span class="highlight" style="color: #1500ba">DELETE</span>\n      </li>\n    </ol>\n    <div class="loading-error-footer">\n      <img src="//cdn.8thwall.com/web/img/loading/v1/reload.png" />\n      Then, reload the page to experience some AR magic!\n    </div>\n  </div>\n\n    \x3c!--iOS devicemotion sensor is disabled --\x3e\n  <div id="deviceMotionErrorApple" class="absolute-fill hidden">\n    <div class="loading-error-header">Let\'s enable your motion sensors</div>\n    <ol class="loading-error-instructions">\n      <li>Open <img src="https://cdn.8thwall.com/web/img/loading/v1/settings-icon-ios.png" style="max-height: 4vh"><b>Settings</b></li>\n      <li>Select <img src="https://cdn.8thwall.com/web/img/loading/v1/safari-icon.png" style="max-height: 4vh"><b>Safari</b></li>\n      <li>Enable <span class="highlight">Motion&nbsp;&amp;&nbsp;Orientation Access</span></li>\n      <li>Reload the page <img src="//cdn.8thwall.com/web/img/loading/v1/reload.png"></li>\n    </ol>\n    \x3c!-- Empty footer to take up space --\x3e\n    <div class="loading-error-footer"></div>\n  </div>\n</div>\n'
}, function(e, n, t) {
    t(2), t(19);
    const i = t(21);
    let r = null;
    const o = () => {
        let e = !1;
        return {
            pipelineModule: () => ({
                name: "error",
                onStart: () => {
                    e = !0
                },
                onException: n => {
                    if (!e) return;
                    if (document.getElementById("error_msg_unknown")) return;
                    console.log("[RuntimeError] XR caught an error; stopping:"), console.log(n);
                    const t = document.createElement("template");
                    t.innerHTML = i.trim(), document.getElementsByTagName("body")[0].appendChild(t.content.firstChild), document.getElementById("error_msg_unknown").classList.remove("hidden"), XR.pause(), XR.stop()
                }
            })
        }
    };
    e.exports = {
        RuntimeErrorFactory: () => (r || (r = o()), r)
    }
}, function(e, n, t) {
    var i = t(20);
    "string" == typeof i && (i = [[e.i, i, ""]]);
    var r = {
        hmr: !0,
        transform: void 0,
        insertInto: void 0
    };
    t(1)(i, r);
    i.locals && (e.exports = i.locals)
}, function(e, n, t) {
    (e.exports = t(0)(!1)).push([e.i, "* {\n  font-family: inherit;\n  box-sizing: inherit;\n}\n\n#runtimeErrorContainer {\n  z-index: 800;\n  background-color: #FFFFFF;\n}\n\n.absolute-fill {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n}\n\n.hidden {\n  display: none !important;\n}\n\n.error-text-outer-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.error-margin-top-5 {\n  margin-top: 5vh;\n}\n\n.error-text-container {\n  flex: 0 0 auto;\n  text-align: center;\n  width: 90%;\n}\n\n.error-text-header {\n  font-family: 'Varela-Round', sans-serif;\n  font-size: 18pt;\n  color: #323232;\n  letter-spacing: .37;\n  line-height: 23pt;\n}\n\n.error-text-hint {\n  font-family: 'Raleway-Regular', sans-serif;\n  font-size: 14pt;\n  color: #A8A8BA;\n  letter-spacing: .37;\n}\n\n.floater {\n  -webkit-filter: drop-shadow(5px 5px 5px #222);\n}\n", ""])
}, function(e, n) {
    e.exports = '<div id="runtimeErrorContainer" class="absolute-fill">\n  <div id="error_msg_unknown" class="hidden">\n    <div class="error-text-outer-container">\n      <div class="error-text-container error-margin-top-5">\n        <p><img height="75px" src="//cdn.8thwall.com/web/img/runtimeerror/v1/computer-voxel.png" class="floater"></p>\n        <div class="error-text-header">Oops, something went wrong!</div>\n        <div class="error-text-hint">\n          <p id="error_unknown_detail" />\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n'
}]);