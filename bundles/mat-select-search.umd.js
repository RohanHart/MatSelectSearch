(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/material/core'), require('@angular/material/select'), require('rxjs'), require('rxjs/operators'), require('@angular/material/progress-spinner'), require('@angular/material/divider'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('mat-select-search', ['exports', '@angular/core', '@angular/material/core', '@angular/material/select', 'rxjs', 'rxjs/operators', '@angular/material/progress-spinner', '@angular/material/divider', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["mat-select-search"] = {}, global.ng.core, global.ng.material.core, global.ng.material.select, global.rxjs, global.rxjs.operators, global.ng.material.progressSpinner, global.ng.material.divider, global.ng.common));
})(this, (function (exports, i0, i6, i5, rxjs, operators, i2, i3, i4) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var i6__namespace = /*#__PURE__*/_interopNamespace(i6);
    var i5__namespace = /*#__PURE__*/_interopNamespace(i5);
    var i2__namespace = /*#__PURE__*/_interopNamespace(i2);
    var i3__namespace = /*#__PURE__*/_interopNamespace(i3);
    var i4__namespace = /*#__PURE__*/_interopNamespace(i4);

    var Searcher = /** @class */ (function () {
        function Searcher() {
            this.list = [];
            this.searchProperty = '';
            this.searchText = '';
            this.previousSearchText = '';
            this.previousInputtype = '';
            this.filteredList = [];
            this.previousFilteredList = [];
            this.shouldReturnPreviousFilteredList = true;
        }
        Searcher.prototype.initSearch = function (list, searchProperties) {
            var _this = this;
            if (searchProperties.length > 1) {
                this.list = list.map(function (item) { return (Object.assign(Object.assign({}, item), { concatedValues: _this.concateValues(item, searchProperties) })); });
                this.searchProperty = 'concatedValues';
            }
            else {
                this.list = list;
                this.searchProperty = searchProperties[0];
            }
            this.previousFilteredList = this.list;
        };
        Searcher.prototype.filterList = function (inputEvent) {
            var _this = this;
            if (inputEvent.data === ' ') {
                return;
            }
            var searchText = inputEvent.target.value;
            var removeWhitespaces = function (text) { return text.split(' ').join(''); };
            var searchTextInLowerCase = removeWhitespaces(searchText).toLocaleLowerCase();
            this.searchText = searchTextInLowerCase;
            var list = this.getList();
            this.previousSearchText = searchTextInLowerCase;
            this.previousInputtype = inputEvent.inputType;
            if (!list) {
                this.filteredList = this.previousFilteredList;
                return this.previousFilteredList;
            }
            this.filteredList = list.filter(function (item) { return removeWhitespaces(item[_this.searchProperty]).toLowerCase().includes(_this.searchText); });
            return this.filteredList;
        };
        Searcher.prototype.concateValues = function (item, searchProperties) {
            var concatedValues = '';
            searchProperties.forEach(function (property) { return concatedValues += item[property]; });
            return concatedValues;
        };
        Searcher.prototype.getList = function () {
            if (this.previousSearchText && this.searchText.includes(this.previousSearchText)) {
                this.previousFilteredList = this.filteredList;
                this.shouldReturnPreviousFilteredList = true;
                return this.filteredList;
            }
            var isLastTextFromPaste = this.previousInputtype === 'insertFromPaste';
            var canReturnPreviousFilteredList = this.isBackSpacedLastChar() &&
                !isLastTextFromPaste && this.shouldReturnPreviousFilteredList;
            if (canReturnPreviousFilteredList) {
                this.shouldReturnPreviousFilteredList = false;
                return;
            }
            return this.list;
        };
        Searcher.prototype.isBackSpacedLastChar = function () {
            var isTextDecrementedBy1 = this.previousSearchText.length - this.searchText.length === 1;
            var lastChar = this.previousSearchText.charAt(this.previousSearchText.length - 1);
            var concatedText = this.searchText + lastChar;
            return isTextDecrementedBy1 && concatedText === this.previousSearchText;
        };
        return Searcher;
    }());
    Searcher.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: Searcher, deps: [], target: i0__namespace.ɵɵFactoryTarget.Injectable });
    Searcher.ɵprov = i0__namespace.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: Searcher });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: Searcher, decorators: [{
                type: i0.Injectable
            }] });

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || Array.prototype.slice.call(from));
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var NON_ITEM_OPTIONS_COUNT = 2;
    var INDEX_SELECT_ALL = 1;
    var MatSelectSearchComponent = /** @class */ (function () {
        function MatSelectSearchComponent(matSelect, matOption, renderer, searcher) {
            this.matSelect = matSelect;
            this.matOption = matOption;
            this.renderer = renderer;
            this.searcher = searcher;
            // Send the array which is to be searched/filtered
            this.list = [];
            // Send the keys of the object properties that is to be searched/filtered
            this.searchProperties = [];
            // Make true if input should be cleared on opening
            this.clearSearchInput = false;
            // Make true if mat-select has multiple attribute with true value
            this.isMultiSelect = false;
            // Make true if there is a mat-option for selecting all values
            this.hasSelectAll = false;
            // Make true if it is needed to fix the search bar on top while scrolling.
            this.fixOnTop = false;
            this.filtered = new i0.EventEmitter();
            this.isLoading = false;
            this.filteredList = [];
            this.fullList = [];
            this.hasFilteredBefore = false;
            this.subscriptions = new rxjs.Subscription();
            this.selectedOptions = [];
            this.clickListenerSelectAll = function () { };
        }
        MatSelectSearchComponent.prototype.ngAfterViewInit = function () {
            var _this = this;
            // If there is option to select all options then it should support multi select
            if (this.hasSelectAll)
                this.isMultiSelect = true;
            this.configMatOption();
            this.subscriptions.add(this.matSelect.openedChange.subscribe(function () {
                var input = _this.element.nativeElement;
                input.focus();
                if ((_this.filteredList && _this.filteredList.length === 0 && _this.hasFilteredBefore) || _this.clearSearchInput) {
                    input.value = '';
                    _this.filtered.emit(_this.fullList);
                }
            }));
            this.subscriptions
                .add(this.filtered.subscribe(function () { return (_this.isLoading = false); }));
            this.subscriptions.add(this.matSelect.stateChanges
                .pipe(operators.filter(function () { return _this.hasSelectAll; }))
                .subscribe(function () {
                var matOptions = _this.matSelect.options.toArray();
                var selectAll = matOptions[INDEX_SELECT_ALL]._getHostElement();
                if (matOptions.length > NON_ITEM_OPTIONS_COUNT) {
                    _this.renderer.setStyle(selectAll, 'display', 'flex');
                }
                else {
                    _this.renderer.setStyle(selectAll, 'display', 'none');
                }
                var items = matOptions.slice(NON_ITEM_OPTIONS_COUNT);
                var isAllItemsSelected = items.every(function (item) { return item.selected; });
                if (isAllItemsSelected && items.length > NON_ITEM_OPTIONS_COUNT) {
                    _this.selectNativeSelectAllCheckbox();
                }
                else {
                    _this.deselectNativeSelectAllCheckbox();
                }
            }));
        };
        MatSelectSearchComponent.prototype.ngOnChanges = function (event) {
            if (event.list && event.list.currentValue !== event.list.previousValue) {
                this.fullList = this.list;
                this.searcher.initSearch(this.list, this.searchProperties);
                this.filtered.emit(this.fullList);
            }
        };
        MatSelectSearchComponent.prototype.filterList = function (event) {
            var inputEvent = event;
            this.hasFilteredBefore = true;
            this.isLoading = true;
            this.filteredList = this.searcher.filterList(inputEvent);
            if (!this.filteredList) {
                this.isLoading = false;
                return;
            }
            var listWithoutConcatedValues = this.filteredList.map(function (item) {
                var itemCopy = Object.assign({}, item);
                delete itemCopy['concatedValues'];
                return itemCopy;
            });
            this.filtered.emit(listWithoutConcatedValues);
        };
        MatSelectSearchComponent.prototype.stopCharPropagation = function (event) {
            var key = event.key;
            var isTextControlKey = key === ' ' || key === 'Home' || key === 'End' || (key >= 'a' && key <= 'z');
            if (isTextControlKey) {
                event.stopPropagation();
            }
        };
        MatSelectSearchComponent.prototype.configMatOption = function () {
            if (!this.matOption) {
                console.error('<lib-mat-select-search> must be placed inside a <mat-option> element');
                return;
            }
            this.matOption.disabled = true;
            var nativeMatOption = this.matOption._getHostElement();
            var checkBox = nativeMatOption.childNodes[0];
            this.renderer.removeChild(nativeMatOption, checkBox);
            if (this.isMultiSelect)
                this.configMultiSelect();
            if (this.hasSelectAll)
                this.enableSelectAll();
            if (this.fixOnTop)
                this.fixSearchBarOnTopWhileScroll();
        };
        /*
          This method is used to retain the old selected options after selecting an option from the new filtered list.
          The old selected options are stored in selectedOptions and the new matSelect value is appended with selected options.
        */
        MatSelectSearchComponent.prototype.configMultiSelect = function () {
            var _this = this;
            this.subscriptions.add(this.matSelect.optionSelectionChanges.subscribe(function (change) {
                var isSelectAllOption = _this.hasSelectAll && change.source.id === 'mat-option-1';
                if (!change.isUserInput || isSelectAllOption)
                    return;
                var itemIndex = _this.selectedOptions.indexOf(change.source.value);
                if (itemIndex > -1) {
                    _this.selectedOptions.splice(itemIndex, 1);
                }
                else {
                    _this.selectedOptions.push(change.source.value);
                }
                _this.matSelect.value = __spreadArray([], __read(_this.selectedOptions));
                if (!_this.hasSelectAll)
                    return;
                var selectedOptionsCount = _this.matSelect.options.filter(function (option) { return option.selected; }).length;
                var isAllOptionsSelected = selectedOptionsCount === _this.matSelect.options.length - NON_ITEM_OPTIONS_COUNT;
                if (isAllOptionsSelected) {
                    _this.selectNativeSelectAllCheckbox();
                    return;
                }
                if (_this.nativeSelectAllCheckbox.getAttribute('checked')) {
                    _this.deselectNativeSelectAllCheckbox();
                }
            }));
        };
        /*
          This method helps the user to select all the options in a list. It must also be able to retain the old selected options
          after clicking Select All in new filtered list. But this has a problem.
          The checkbox before every mat-option is the default checkbox given by angular on a mat-option.
          This checkbox can only be checked manually by a method option.select().
          But this method not only checks the chekbox but also updates the value of the matSelect and hence after clicking on it,
          the matSelect value loses the old selected options and will only have all the options in the new filtered list.
      
          To overcome this we remove the default checkbox and create a new checkbox of our own. The newly created checkbox has also
          a slightly different appearance and hence contrasts with the rest of the checkboxes in the options so which is good as the
          user will get a feel that this particular option(Select All) is different from the rest of the options
        */
        MatSelectSearchComponent.prototype.enableSelectAll = function () {
            var _this = this;
            var selectAll = this.matSelect.options.toArray()[INDEX_SELECT_ALL];
            var nativeSelectAll = selectAll._getHostElement();
            var matPseudoCheckbox = nativeSelectAll.childNodes[0];
            this.renderer.removeChild(nativeSelectAll, matPseudoCheckbox);
            this.nativeSelectAllCheckbox = this.renderer.createElement('input');
            this.renderer.setAttribute(this.nativeSelectAllCheckbox, 'type', 'checkbox');
            this.renderer.addClass(this.nativeSelectAllCheckbox, 'native-checkbox');
            this.renderer.insertBefore(nativeSelectAll, this.nativeSelectAllCheckbox, nativeSelectAll.childNodes[0]);
            this.clickListenerSelectAll = this.renderer.listen(nativeSelectAll, 'click', function () {
                if (_this.nativeSelectAllCheckbox.getAttribute('checked')) {
                    _this.deselectNativeSelectAllCheckbox();
                    _this.deselectAlloptions();
                }
                else {
                    _this.selectNativeSelectAllCheckbox();
                    _this.selectAllOptions();
                }
            });
        };
        MatSelectSearchComponent.prototype.selectAllOptions = function () {
            var matOptions = this.matSelect.options;
            var items = matOptions.toArray().slice(NON_ITEM_OPTIONS_COUNT);
            var nonSelectedItems = [];
            items.forEach(function (item) {
                if (!item.selected)
                    nonSelectedItems.push(item.value);
            });
            this.selectedOptions = __spreadArray(__spreadArray([], __read(this.selectedOptions)), __read(nonSelectedItems));
            this.matSelect.value = __spreadArray([], __read(this.selectedOptions));
        };
        MatSelectSearchComponent.prototype.deselectAlloptions = function () {
            var matOptions = this.matSelect.options;
            var items = matOptions.toArray().slice(NON_ITEM_OPTIONS_COUNT);
            var itemValues = items.map(function (item) { return item.value; });
            this.matSelect.value = this.selectedOptions = this.selectedOptions.filter(function (option) { return !itemValues.includes(option); });
        };
        MatSelectSearchComponent.prototype.fixSearchBarOnTopWhileScroll = function () {
            var searchBar = this.matSelect.options.toArray()[0]._getHostElement();
            this.renderer.setStyle(searchBar, 'position', 'sticky');
            this.renderer.setStyle(searchBar, 'top', '0');
            this.renderer.setStyle(searchBar, 'z-index', '1');
            this.renderer.setStyle(searchBar, 'background-color', 'white');
        };
        MatSelectSearchComponent.prototype.selectNativeSelectAllCheckbox = function () {
            this.renderer.setAttribute(this.nativeSelectAllCheckbox, 'checked', 'true');
        };
        MatSelectSearchComponent.prototype.deselectNativeSelectAllCheckbox = function () {
            this.renderer.removeAttribute(this.nativeSelectAllCheckbox, 'checked');
        };
        MatSelectSearchComponent.prototype.ngOnDestroy = function () {
            this.subscriptions.unsubscribe();
            this.clickListenerSelectAll();
        };
        return MatSelectSearchComponent;
    }());
    MatSelectSearchComponent.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: MatSelectSearchComponent, deps: [{ token: i5.MatSelect }, { token: i6.MatOption, optional: true }, { token: i0__namespace.Renderer2 }, { token: Searcher }], target: i0__namespace.ɵɵFactoryTarget.Component });
    MatSelectSearchComponent.ɵcmp = i0__namespace.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.0.5", type: MatSelectSearchComponent, selector: "lib-mat-select-search", inputs: { list: "list", searchProperties: "searchProperties", clearSearchInput: "clearSearchInput", isMultiSelect: "isMultiSelect", hasSelectAll: "hasSelectAll", fixOnTop: "fixOnTop" }, outputs: { filtered: "filtered" }, providers: [Searcher], viewQueries: [{ propertyName: "element", first: true, predicate: ["input"], descendants: true, read: i0.ElementRef, static: true }], usesOnChanges: true, ngImport: i0__namespace, template: "<div class=\"flex-container\">\n  <input\n    #input\n    id=\"input\"\n    placeholder=\"Search\"\n    autocomplete=\"off\"\n    (input)=\"filterList($event)\"\n    (keydown)=\"stopCharPropagation($event)\">\n    <mat-spinner *ngIf=\"isLoading\" [diameter]=\"25\"></mat-spinner>\n</div>\n<mat-divider></mat-divider>\n", styles: [".flex-container{display:flex;align-items:center;justify-content:space-between;height:100%}input{border:none;width:calc(100% - 25px);outline:none;margin-top:2%;margin-bottom:2%;height:100%}\n"], components: [{ type: i2__namespace.MatSpinner, selector: "mat-spinner", inputs: ["color"] }, { type: i3__namespace.MatDivider, selector: "mat-divider", inputs: ["vertical", "inset"] }], directives: [{ type: i4__namespace.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: MatSelectSearchComponent, decorators: [{
                type: i0.Component,
                args: [{
                        selector: 'lib-mat-select-search',
                        templateUrl: './mat-select-search.component.html',
                        styleUrls: ['./mat-select-search.scss'],
                        //changeDetection: ChangeDetectionStrategy.OnPush,
                        providers: [Searcher]
                    }]
            }], ctorParameters: function () {
            return [{ type: i5__namespace.MatSelect, decorators: [{
                            type: i0.Inject,
                            args: [i5.MatSelect]
                        }] }, { type: i6__namespace.MatOption, decorators: [{
                            type: i0.Optional
                        }, {
                            type: i0.Inject,
                            args: [i6.MatOption]
                        }] }, { type: i0__namespace.Renderer2 }, { type: Searcher }];
        }, propDecorators: { list: [{
                    type: i0.Input
                }], searchProperties: [{
                    type: i0.Input
                }], clearSearchInput: [{
                    type: i0.Input
                }], isMultiSelect: [{
                    type: i0.Input
                }], hasSelectAll: [{
                    type: i0.Input
                }], fixOnTop: [{
                    type: i0.Input
                }], filtered: [{
                    type: i0.Output
                }], element: [{
                    type: i0.ViewChild,
                    args: ['input', { read: i0.ElementRef, static: true }]
                }] } });

    var MatSelectSearchModule = /** @class */ (function () {
        function MatSelectSearchModule() {
        }
        return MatSelectSearchModule;
    }());
    MatSelectSearchModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: MatSelectSearchModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    MatSelectSearchModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: MatSelectSearchModule, declarations: [MatSelectSearchComponent], imports: [i2.MatProgressSpinnerModule,
            i3.MatDividerModule,
            i4.CommonModule], exports: [MatSelectSearchComponent] });
    MatSelectSearchModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: MatSelectSearchModule, imports: [[
                i2.MatProgressSpinnerModule,
                i3.MatDividerModule,
                i4.CommonModule
            ]] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0__namespace, type: MatSelectSearchModule, decorators: [{
                type: i0.NgModule,
                args: [{
                        declarations: [
                            MatSelectSearchComponent
                        ],
                        imports: [
                            i2.MatProgressSpinnerModule,
                            i3.MatDividerModule,
                            i4.CommonModule
                        ],
                        exports: [
                            MatSelectSearchComponent
                        ]
                    }]
            }] });

    /*
     * Public API Surface of mat-select-search
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MatSelectSearchComponent = MatSelectSearchComponent;
    exports.MatSelectSearchModule = MatSelectSearchModule;
    exports.Searcher = Searcher;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=mat-select-search.umd.js.map
