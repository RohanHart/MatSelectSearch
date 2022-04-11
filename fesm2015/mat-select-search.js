import * as i0 from '@angular/core';
import { Injectable, EventEmitter, ElementRef, Component, Inject, Optional, Input, Output, ViewChild, NgModule } from '@angular/core';
import * as i6 from '@angular/material/core';
import { MatOption } from '@angular/material/core';
import * as i5 from '@angular/material/select';
import { MatSelect } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as i2 from '@angular/material/progress-spinner';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as i3 from '@angular/material/divider';
import { MatDividerModule } from '@angular/material/divider';
import * as i4 from '@angular/common';
import { CommonModule } from '@angular/common';

class Searcher {
    constructor() {
        this.list = [];
        this.searchProperty = '';
        this.searchText = '';
        this.previousSearchText = '';
        this.previousInputtype = '';
        this.filteredList = [];
        this.previousFilteredList = [];
        this.shouldReturnPreviousFilteredList = true;
    }
    initSearch(list, searchProperties) {
        if (searchProperties.length > 1) {
            this.list = list.map(item => (Object.assign(Object.assign({}, item), { concatedValues: this.concateValues(item, searchProperties) })));
            this.searchProperty = 'concatedValues';
        }
        else {
            this.list = list;
            this.searchProperty = searchProperties[0];
        }
        this.previousFilteredList = this.list;
    }
    filterList(inputEvent) {
        if (inputEvent.data === ' ') {
            return;
        }
        const searchText = inputEvent.target.value;
        const removeWhitespaces = (text) => text.split(' ').join('');
        const searchTextInLowerCase = removeWhitespaces(searchText).toLocaleLowerCase();
        this.searchText = searchTextInLowerCase;
        const list = this.getList();
        this.previousSearchText = searchTextInLowerCase;
        this.previousInputtype = inputEvent.inputType;
        if (!list) {
            this.filteredList = this.previousFilteredList;
            return this.previousFilteredList;
        }
        this.filteredList = list.filter(item => removeWhitespaces(item[this.searchProperty]).toLowerCase().includes(this.searchText));
        return this.filteredList;
    }
    concateValues(item, searchProperties) {
        let concatedValues = '';
        searchProperties.forEach(property => concatedValues += item[property]);
        return concatedValues;
    }
    getList() {
        if (this.previousSearchText && this.searchText.includes(this.previousSearchText)) {
            this.previousFilteredList = this.filteredList;
            this.shouldReturnPreviousFilteredList = true;
            return this.filteredList;
        }
        const isLastTextFromPaste = this.previousInputtype === 'insertFromPaste';
        const canReturnPreviousFilteredList = this.isBackSpacedLastChar() &&
            !isLastTextFromPaste && this.shouldReturnPreviousFilteredList;
        if (canReturnPreviousFilteredList) {
            this.shouldReturnPreviousFilteredList = false;
            return;
        }
        return this.list;
    }
    isBackSpacedLastChar() {
        const isTextDecrementedBy1 = this.previousSearchText.length - this.searchText.length === 1;
        const lastChar = this.previousSearchText.charAt(this.previousSearchText.length - 1);
        const concatedText = this.searchText + lastChar;
        return isTextDecrementedBy1 && concatedText === this.previousSearchText;
    }
}
Searcher.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: Searcher, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
Searcher.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: Searcher });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: Searcher, decorators: [{
            type: Injectable
        }] });

const NON_ITEM_OPTIONS_COUNT = 2;
const INDEX_SELECT_ALL = 1;
class MatSelectSearchComponent {
    constructor(matSelect, matOption, renderer, searcher) {
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
        this.filtered = new EventEmitter();
        this.isLoading = false;
        this.filteredList = [];
        this.fullList = [];
        this.hasFilteredBefore = false;
        this.subscriptions = new Subscription();
        this.selectedOptions = [];
        this.clickListenerSelectAll = () => { };
    }
    ngAfterViewInit() {
        // If there is option to select all options then it should support multi select
        if (this.hasSelectAll)
            this.isMultiSelect = true;
        this.configMatOption();
        this.subscriptions.add(this.matSelect.openedChange.subscribe(() => {
            const input = this.element.nativeElement;
            input.focus();
            if ((this.filteredList && this.filteredList.length === 0 && this.hasFilteredBefore) || this.clearSearchInput) {
                input.value = '';
                this.filtered.emit(this.fullList);
            }
        }));
        this.subscriptions
            .add(this.filtered.subscribe(() => (this.isLoading = false)));
        this.subscriptions.add(this.matSelect.stateChanges
            .pipe(filter(() => this.hasSelectAll))
            .subscribe(() => {
            const matOptions = this.matSelect.options.toArray();
            const selectAll = matOptions[INDEX_SELECT_ALL]._getHostElement();
            if (matOptions.length > NON_ITEM_OPTIONS_COUNT) {
                this.renderer.setStyle(selectAll, 'display', 'flex');
            }
            else {
                this.renderer.setStyle(selectAll, 'display', 'none');
            }
            const items = matOptions.slice(NON_ITEM_OPTIONS_COUNT);
            const isAllItemsSelected = items.every(item => item.selected);
            if (isAllItemsSelected && items.length > NON_ITEM_OPTIONS_COUNT) {
                this.selectNativeSelectAllCheckbox();
            }
            else {
                this.deselectNativeSelectAllCheckbox();
            }
        }));
    }
    ngOnChanges(event) {
        if (event.list && event.list.currentValue !== event.list.previousValue) {
            this.fullList = this.list;
            this.searcher.initSearch(this.list, this.searchProperties);
            this.filtered.emit(this.fullList);
        }
    }
    filterList(event) {
        const inputEvent = event;
        this.hasFilteredBefore = true;
        this.isLoading = true;
        this.filteredList = this.searcher.filterList(inputEvent);
        if (!this.filteredList) {
            this.isLoading = false;
            return;
        }
        const listWithoutConcatedValues = this.filteredList.map(item => {
            const itemCopy = Object.assign({}, item);
            delete itemCopy['concatedValues'];
            return itemCopy;
        });
        this.filtered.emit(listWithoutConcatedValues);
    }
    stopCharPropagation(event) {
        const key = event.key;
        const isTextControlKey = key === ' ' || key === 'Home' || key === 'End' || (key >= 'a' && key <= 'z');
        if (isTextControlKey) {
            event.stopPropagation();
        }
    }
    configMatOption() {
        if (!this.matOption) {
            console.error('<lib-mat-select-search> must be placed inside a <mat-option> element');
            return;
        }
        this.matOption.disabled = true;
        const nativeMatOption = this.matOption._getHostElement();
        const checkBox = nativeMatOption.childNodes[0];
        this.renderer.removeChild(nativeMatOption, checkBox);
        if (this.isMultiSelect)
            this.configMultiSelect();
        if (this.hasSelectAll)
            this.enableSelectAll();
        if (this.fixOnTop)
            this.fixSearchBarOnTopWhileScroll();
    }
    /*
      This method is used to retain the old selected options after selecting an option from the new filtered list.
      The old selected options are stored in selectedOptions and the new matSelect value is appended with selected options.
    */
    configMultiSelect() {
        this.subscriptions.add(this.matSelect.optionSelectionChanges.subscribe(change => {
            const isSelectAllOption = this.hasSelectAll && change.source.id === 'mat-option-1';
            if (!change.isUserInput || isSelectAllOption)
                return;
            const itemIndex = this.selectedOptions.indexOf(change.source.value);
            if (itemIndex > -1) {
                this.selectedOptions.splice(itemIndex, 1);
            }
            else {
                this.selectedOptions.push(change.source.value);
            }
            this.matSelect.value = [...this.selectedOptions];
            if (!this.hasSelectAll)
                return;
            const selectedOptionsCount = this.matSelect.options.filter(option => option.selected).length;
            const isAllOptionsSelected = selectedOptionsCount === this.matSelect.options.length - NON_ITEM_OPTIONS_COUNT;
            if (isAllOptionsSelected) {
                this.selectNativeSelectAllCheckbox();
                return;
            }
            if (this.nativeSelectAllCheckbox.getAttribute('checked')) {
                this.deselectNativeSelectAllCheckbox();
            }
        }));
    }
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
    enableSelectAll() {
        const selectAll = this.matSelect.options.toArray()[INDEX_SELECT_ALL];
        const nativeSelectAll = selectAll._getHostElement();
        const matPseudoCheckbox = nativeSelectAll.childNodes[0];
        this.renderer.removeChild(nativeSelectAll, matPseudoCheckbox);
        this.nativeSelectAllCheckbox = this.renderer.createElement('input');
        this.renderer.setAttribute(this.nativeSelectAllCheckbox, 'type', 'checkbox');
        this.renderer.addClass(this.nativeSelectAllCheckbox, 'native-checkbox');
        this.renderer.insertBefore(nativeSelectAll, this.nativeSelectAllCheckbox, nativeSelectAll.childNodes[0]);
        this.clickListenerSelectAll = this.renderer.listen(nativeSelectAll, 'click', () => {
            if (this.nativeSelectAllCheckbox.getAttribute('checked')) {
                this.deselectNativeSelectAllCheckbox();
                this.deselectAlloptions();
            }
            else {
                this.selectNativeSelectAllCheckbox();
                this.selectAllOptions();
            }
        });
    }
    selectAllOptions() {
        const matOptions = this.matSelect.options;
        const items = matOptions.toArray().slice(NON_ITEM_OPTIONS_COUNT);
        let nonSelectedItems = [];
        items.forEach(item => {
            if (!item.selected)
                nonSelectedItems.push(item.value);
        });
        this.selectedOptions = [...this.selectedOptions, ...nonSelectedItems];
        this.matSelect.value = [...this.selectedOptions];
    }
    deselectAlloptions() {
        const matOptions = this.matSelect.options;
        const items = matOptions.toArray().slice(NON_ITEM_OPTIONS_COUNT);
        const itemValues = items.map(item => item.value);
        this.matSelect.value = this.selectedOptions = this.selectedOptions.filter(option => !itemValues.includes(option));
    }
    fixSearchBarOnTopWhileScroll() {
        const searchBar = this.matSelect.options.toArray()[0]._getHostElement();
        this.renderer.setStyle(searchBar, 'position', 'sticky');
        this.renderer.setStyle(searchBar, 'top', '0');
        this.renderer.setStyle(searchBar, 'z-index', '1');
        this.renderer.setStyle(searchBar, 'background-color', 'white');
    }
    selectNativeSelectAllCheckbox() {
        this.renderer.setAttribute(this.nativeSelectAllCheckbox, 'checked', 'true');
    }
    deselectNativeSelectAllCheckbox() {
        this.renderer.removeAttribute(this.nativeSelectAllCheckbox, 'checked');
    }
    ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.clickListenerSelectAll();
    }
}
MatSelectSearchComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MatSelectSearchComponent, deps: [{ token: MatSelect }, { token: MatOption, optional: true }, { token: i0.Renderer2 }, { token: Searcher }], target: i0.ɵɵFactoryTarget.Component });
MatSelectSearchComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.0.5", type: MatSelectSearchComponent, selector: "lib-mat-select-search", inputs: { list: "list", searchProperties: "searchProperties", clearSearchInput: "clearSearchInput", isMultiSelect: "isMultiSelect", hasSelectAll: "hasSelectAll", fixOnTop: "fixOnTop" }, outputs: { filtered: "filtered" }, providers: [Searcher], viewQueries: [{ propertyName: "element", first: true, predicate: ["input"], descendants: true, read: ElementRef, static: true }], usesOnChanges: true, ngImport: i0, template: "<div class=\"flex-container\">\n  <input\n    #input\n    id=\"input\"\n    placeholder=\"Search\"\n    autocomplete=\"off\"\n    (input)=\"filterList($event)\"\n    (keydown)=\"stopCharPropagation($event)\">\n    <mat-spinner *ngIf=\"isLoading\" [diameter]=\"25\"></mat-spinner>\n</div>\n<mat-divider></mat-divider>\n", styles: [".flex-container{display:flex;align-items:center;justify-content:space-between;height:100%}input{border:none;width:calc(100% - 25px);outline:none;margin-top:2%;margin-bottom:2%;height:100%}\n"], components: [{ type: i2.MatSpinner, selector: "mat-spinner", inputs: ["color"] }, { type: i3.MatDivider, selector: "mat-divider", inputs: ["vertical", "inset"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MatSelectSearchComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'lib-mat-select-search',
                    templateUrl: './mat-select-search.component.html',
                    styleUrls: ['./mat-select-search.scss'],
                    //changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [Searcher]
                }]
        }], ctorParameters: function () { return [{ type: i5.MatSelect, decorators: [{
                    type: Inject,
                    args: [MatSelect]
                }] }, { type: i6.MatOption, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MatOption]
                }] }, { type: i0.Renderer2 }, { type: Searcher }]; }, propDecorators: { list: [{
                type: Input
            }], searchProperties: [{
                type: Input
            }], clearSearchInput: [{
                type: Input
            }], isMultiSelect: [{
                type: Input
            }], hasSelectAll: [{
                type: Input
            }], fixOnTop: [{
                type: Input
            }], filtered: [{
                type: Output
            }], element: [{
                type: ViewChild,
                args: ['input', { read: ElementRef, static: true }]
            }] } });

class MatSelectSearchModule {
}
MatSelectSearchModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MatSelectSearchModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MatSelectSearchModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MatSelectSearchModule, declarations: [MatSelectSearchComponent], imports: [MatProgressSpinnerModule,
        MatDividerModule,
        CommonModule], exports: [MatSelectSearchComponent] });
MatSelectSearchModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MatSelectSearchModule, imports: [[
            MatProgressSpinnerModule,
            MatDividerModule,
            CommonModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MatSelectSearchModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        MatSelectSearchComponent
                    ],
                    imports: [
                        MatProgressSpinnerModule,
                        MatDividerModule,
                        CommonModule
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

export { MatSelectSearchComponent, MatSelectSearchModule, Searcher };
//# sourceMappingURL=mat-select-search.js.map
