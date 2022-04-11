import { Component, ElementRef, EventEmitter, Inject, Input, Optional, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { Searcher } from './searcher.service';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./searcher.service";
import * as i2 from "@angular/material/progress-spinner";
import * as i3 from "@angular/material/divider";
import * as i4 from "@angular/common";
import * as i5 from "@angular/material/select";
import * as i6 from "@angular/material/core";
const NON_ITEM_OPTIONS_COUNT = 2;
const INDEX_SELECT_ALL = 1;
export class MatSelectSearchComponent {
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
MatSelectSearchComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.0.5", ngImport: i0, type: MatSelectSearchComponent, deps: [{ token: MatSelect }, { token: MatOption, optional: true }, { token: i0.Renderer2 }, { token: i1.Searcher }], target: i0.ɵɵFactoryTarget.Component });
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
                }] }, { type: i0.Renderer2 }, { type: i1.Searcher }]; }, propDecorators: { list: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0LXNlbGVjdC1zZWFyY2guY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbWF0LXNlbGVjdC1zZWFyY2gvc3JjL2xpYi9tYXQtc2VsZWN0LXNlYXJjaC5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9tYXQtc2VsZWN0LXNlYXJjaC9zcmMvbGliL21hdC1zZWxlY3Qtc2VhcmNoLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBMEMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBd0IsUUFBUSxFQUFFLE1BQU0sRUFBMkIsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZNLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDckQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDOUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7OztBQUV4QyxNQUFNLHNCQUFzQixHQUFHLENBQUMsQ0FBQztBQUNqQyxNQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBQztBQVMzQixNQUFNLE9BQU8sd0JBQXdCO0lBK0JuQyxZQUM2QixTQUFvQixFQUNSLFNBQW9CLEVBQ25ELFFBQW1CLEVBQ25CLFFBQWtCO1FBSEMsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUNSLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDbkQsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBakM1QixrREFBa0Q7UUFDekMsU0FBSSxHQUE2QixFQUFFLENBQUM7UUFFN0MseUVBQXlFO1FB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QVdBOzJGRE1hLHdCQUF3QjtrQkFQcEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsdUJBQXVCO29CQUNqQyxXQUFXLEVBQUUsb0NBQW9DO29CQUNqRCxTQUFTLEVBQUUsQ0FBRSwwQkFBMEIsQ0FBRTtvQkFDekMsa0RBQWtEO29CQUNsRCxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7aUJBQ3RCOzswQkFpQ0ksTUFBTTsyQkFBQyxTQUFTOzswQkFDaEIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxTQUFTOzJGQTlCdEIsSUFBSTtzQkFBWixLQUFLO2dCQUdHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFHRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBR0csYUFBYTtzQkFBckIsS0FBSztnQkFHRyxZQUFZO3NCQUFwQixLQUFLO2dCQUdHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBRUksUUFBUTtzQkFBakIsTUFBTTtnQkFDaUQsT0FBTztzQkFBOUQsU0FBUzt1QkFBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPcHRpb25hbCwgT3V0cHV0LCBSZW5kZXJlcjIsIFNpbXBsZUNoYW5nZSwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNYXRPcHRpb24gfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7IE1hdFNlbGVjdCB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NlbGVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFNlYXJjaGVyIH0gZnJvbSAnLi9zZWFyY2hlci5zZXJ2aWNlJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuY29uc3QgTk9OX0lURU1fT1BUSU9OU19DT1VOVCA9IDI7XG5jb25zdCBJTkRFWF9TRUxFQ1RfQUxMID0gMTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbGliLW1hdC1zZWxlY3Qtc2VhcmNoJyxcbiAgdGVtcGxhdGVVcmw6ICcuL21hdC1zZWxlY3Qtc2VhcmNoLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbICcuL21hdC1zZWxlY3Qtc2VhcmNoLnNjc3MnIF0sXG4gIC8vY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1NlYXJjaGVyXVxufSlcbmV4cG9ydCBjbGFzcyBNYXRTZWxlY3RTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cbiAgLy8gU2VuZCB0aGUgYXJyYXkgd2hpY2ggaXMgdG8gYmUgc2VhcmNoZWQvZmlsdGVyZWRcbiAgQElucHV0KCkgbGlzdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG5cbiAgLy8gU2VuZCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0IHByb3BlcnRpZXMgdGhhdCBpcyB0byBiZSBzZWFyY2hlZC9maWx0ZXJlZFxuICBASW5wdXQoKSBzZWFyY2hQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIC8vIE1ha2UgdHJ1ZSBpZiBpbnB1dCBzaG91bGQgYmUgY2xlYXJlZCBvbiBvcGVuaW5nXG4gIEBJbnB1dCgpIGNsZWFyU2VhcmNoSW5wdXQgPSBmYWxzZTtcblxuICAgLy8gTWFrZSB0cnVlIGlmIG1hdC1zZWxlY3QgaGFzIG11bHRpcGxlIGF0dHJpYnV0ZSB3aXRoIHRydWUgdmFsdWVcbiAgQElucHV0KCkgaXNNdWx0aVNlbGVjdCA9IGZhbHNlO1xuXG4gIC8vIE1ha2UgdHJ1ZSBpZiB0aGVyZSBpcyBhIG1hdC1vcHRpb24gZm9yIHNlbGVjdGluZyBhbGwgdmFsdWVzXG4gIEBJbnB1dCgpIGhhc1NlbGVjdEFsbCA9IGZhbHNlO1xuXG4gIC8vIE1ha2UgdHJ1ZSBpZiBpdCBpcyBuZWVkZWQgdG8gZml4IHRoZSBzZWFyY2ggYmFyIG9uIHRvcCB3aGlsZSBzY3JvbGxpbmcuXG4gIEBJbnB1dCgpIGZpeE9uVG9wID0gZmFsc2U7XG5cbiAgQE91dHB1dCgpIGZpbHRlcmVkID0gbmV3IEV2ZW50RW1pdHRlcjxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10+KCk7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0JywgeyByZWFkOiBFbGVtZW50UmVmLCBzdGF0aWM6IHRydWUgfSkgZWxlbWVudCE6IEVsZW1lbnRSZWY7XG4gIGlzTG9hZGluZyA9IGZhbHNlO1xuICBwcml2YXRlIGZpbHRlcmVkTGlzdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdIHwgdW5kZWZpbmVkID0gW107XG4gIHByaXZhdGUgZnVsbExpc3Q6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5bXSA9IFtdO1xuICBwcml2YXRlIGhhc0ZpbHRlcmVkQmVmb3JlID0gZmFsc2U7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgcHJpdmF0ZSBzZWxlY3RlZE9wdGlvbnM6IGFueVtdID0gW107XG4gIHByaXZhdGUgbmF0aXZlU2VsZWN0QWxsQ2hlY2tib3ghOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBjbGlja0xpc3RlbmVyU2VsZWN0QWxsID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChNYXRTZWxlY3QpIHByaXZhdGUgbWF0U2VsZWN0OiBNYXRTZWxlY3QsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNYXRPcHRpb24pIHByaXZhdGUgbWF0T3B0aW9uOiBNYXRPcHRpb24sXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgc2VhcmNoZXI6IFNlYXJjaGVyLFxuICAgICkgeyB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIC8vIElmIHRoZXJlIGlzIG9wdGlvbiB0byBzZWxlY3QgYWxsIG9wdGlvbnMgdGhlbiBpdCBzaG91bGQgc3VwcG9ydCBtdWx0aSBzZWxlY3RcbiAgICBpZiAodGhpcy5oYXNTZWxlY3RBbGwpIHRoaXMuaXNNdWx0aVNlbGVjdCA9IHRydWU7XG4gICAgdGhpcy5jb25maWdNYXRPcHRpb24oKTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5tYXRTZWxlY3Qub3BlbmVkQ2hhbmdlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICAgICAgICBpbnB1dC5mb2N1cygpO1xuICAgICAgICAgIGlmICgodGhpcy5maWx0ZXJlZExpc3QgJiYgdGhpcy5maWx0ZXJlZExpc3QubGVuZ3RoID09PSAwICYmIHRoaXMuaGFzRmlsdGVyZWRCZWZvcmUpIHx8IHRoaXMuY2xlYXJTZWFyY2hJbnB1dCkge1xuICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICB0aGlzLmZpbHRlcmVkLmVtaXQodGhpcy5mdWxsTGlzdCk7XG4gICAgICAgICAgfVxuICAgICAgfSkpO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zXG4gICAgICAgICAgLmFkZCh0aGlzLmZpbHRlcmVkLnN1YnNjcmliZSgoKSA9PiAodGhpcy5pc0xvYWRpbmcgPSBmYWxzZSkpKTtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIHRoaXMubWF0U2VsZWN0LnN0YXRlQ2hhbmdlc1xuICAgICAgICAgIC5waXBlKGZpbHRlcigoKSA9PiB0aGlzLmhhc1NlbGVjdEFsbCkpXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtYXRPcHRpb25zID0gdGhpcy5tYXRTZWxlY3Qub3B0aW9ucy50b0FycmF5KCk7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RBbGwgPSBtYXRPcHRpb25zW0lOREVYX1NFTEVDVF9BTExdLl9nZXRIb3N0RWxlbWVudCgpO1xuICAgICAgICAgICAgaWYgKG1hdE9wdGlvbnMubGVuZ3RoID4gTk9OX0lURU1fT1BUSU9OU19DT1VOVCkge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHNlbGVjdEFsbCwgJ2Rpc3BsYXknLCAnZmxleCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShzZWxlY3RBbGwsICdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaXRlbXMgPSBtYXRPcHRpb25zLnNsaWNlKE5PTl9JVEVNX09QVElPTlNfQ09VTlQpO1xuICAgICAgICAgICAgY29uc3QgaXNBbGxJdGVtc1NlbGVjdGVkID0gaXRlbXMuZXZlcnkoaXRlbSA9PiBpdGVtLnNlbGVjdGVkKTtcbiAgICAgICAgICAgIGlmIChpc0FsbEl0ZW1zU2VsZWN0ZWQgJiYgaXRlbXMubGVuZ3RoID4gTk9OX0lURU1fT1BUSU9OU19DT1VOVCkge1xuICAgICAgICAgICAgICB0aGlzLnNlbGVjdE5hdGl2ZVNlbGVjdEFsbENoZWNrYm94KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmRlc2VsZWN0TmF0aXZlU2VsZWN0QWxsQ2hlY2tib3goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGV2ZW50OiB7bGlzdD86IFNpbXBsZUNoYW5nZX0pIHtcbiAgICBpZiAoZXZlbnQubGlzdCAmJiBldmVudC5saXN0LmN1cnJlbnRWYWx1ZSAhPT0gZXZlbnQubGlzdC5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICB0aGlzLmZ1bGxMaXN0ID0gdGhpcy5saXN0O1xuICAgICAgdGhpcy5zZWFyY2hlci5pbml0U2VhcmNoKHRoaXMubGlzdCwgdGhpcy5zZWFyY2hQcm9wZXJ0aWVzKTtcbiAgICAgIHRoaXMuZmlsdGVyZWQuZW1pdCh0aGlzLmZ1bGxMaXN0KTtcbiAgICB9XG4gIH1cblxuICBmaWx0ZXJMaXN0KGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0RXZlbnQgPSBldmVudCBhcyBJbnB1dEV2ZW50O1xuICAgIHRoaXMuaGFzRmlsdGVyZWRCZWZvcmUgPSB0cnVlO1xuICAgIHRoaXMuaXNMb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IHRoaXMuc2VhcmNoZXIuZmlsdGVyTGlzdChpbnB1dEV2ZW50KTtcblxuICAgIGlmICghdGhpcy5maWx0ZXJlZExpc3QpIHtcbiAgICAgIHRoaXMuaXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlzdFdpdGhvdXRDb25jYXRlZFZhbHVlcyA9IHRoaXMuZmlsdGVyZWRMaXN0Lm1hcChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGl0ZW1Db3B5ID0gey4uLml0ZW19O1xuICAgICAgZGVsZXRlIGl0ZW1Db3B5Wydjb25jYXRlZFZhbHVlcyddO1xuICAgICAgcmV0dXJuIGl0ZW1Db3B5O1xuICAgIH0pO1xuICAgIHRoaXMuZmlsdGVyZWQuZW1pdChsaXN0V2l0aG91dENvbmNhdGVkVmFsdWVzKTtcbiAgfVxuXG4gIHN0b3BDaGFyUHJvcGFnYXRpb24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBrZXkgPSBldmVudC5rZXk7XG4gICAgY29uc3QgaXNUZXh0Q29udHJvbEtleSA9IGtleSA9PT0gJyAnIHx8IGtleSA9PT0gJ0hvbWUnIHx8IGtleSA9PT0gJ0VuZCcgfHwgKGtleSA+PSAnYScgJiYga2V5IDw9ICd6Jyk7XG4gICAgaWYgKGlzVGV4dENvbnRyb2xLZXkpIHsgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IH1cbiAgfVxuXG4gIHByaXZhdGUgY29uZmlnTWF0T3B0aW9uKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5tYXRPcHRpb24pIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJzxsaWItbWF0LXNlbGVjdC1zZWFyY2g+IG11c3QgYmUgcGxhY2VkIGluc2lkZSBhIDxtYXQtb3B0aW9uPiBlbGVtZW50Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubWF0T3B0aW9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICBjb25zdCBuYXRpdmVNYXRPcHRpb24gPSB0aGlzLm1hdE9wdGlvbi5fZ2V0SG9zdEVsZW1lbnQoKTtcbiAgICBjb25zdCBjaGVja0JveCA9IG5hdGl2ZU1hdE9wdGlvbi5jaGlsZE5vZGVzWzBdO1xuICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQobmF0aXZlTWF0T3B0aW9uLCBjaGVja0JveCk7XG5cbiAgICBpZiAodGhpcy5pc011bHRpU2VsZWN0KSB0aGlzLmNvbmZpZ011bHRpU2VsZWN0KCk7XG4gICAgaWYgKHRoaXMuaGFzU2VsZWN0QWxsKSB0aGlzLmVuYWJsZVNlbGVjdEFsbCgpO1xuICAgIGlmICh0aGlzLmZpeE9uVG9wKSB0aGlzLmZpeFNlYXJjaEJhck9uVG9wV2hpbGVTY3JvbGwoKTtcbiAgfVxuXG4gIC8qXG4gICAgVGhpcyBtZXRob2QgaXMgdXNlZCB0byByZXRhaW4gdGhlIG9sZCBzZWxlY3RlZCBvcHRpb25zIGFmdGVyIHNlbGVjdGluZyBhbiBvcHRpb24gZnJvbSB0aGUgbmV3IGZpbHRlcmVkIGxpc3QuXG4gICAgVGhlIG9sZCBzZWxlY3RlZCBvcHRpb25zIGFyZSBzdG9yZWQgaW4gc2VsZWN0ZWRPcHRpb25zIGFuZCB0aGUgbmV3IG1hdFNlbGVjdCB2YWx1ZSBpcyBhcHBlbmRlZCB3aXRoIHNlbGVjdGVkIG9wdGlvbnMuXG4gICovXG4gIHByaXZhdGUgY29uZmlnTXVsdGlTZWxlY3QoKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLm1hdFNlbGVjdC5vcHRpb25TZWxlY3Rpb25DaGFuZ2VzLnN1YnNjcmliZShjaGFuZ2UgPT4ge1xuICAgICAgY29uc3QgaXNTZWxlY3RBbGxPcHRpb24gPSB0aGlzLmhhc1NlbGVjdEFsbCAmJiBjaGFuZ2Uuc291cmNlLmlkID09PSAnbWF0LW9wdGlvbi0xJztcbiAgICAgIGlmICghY2hhbmdlLmlzVXNlcklucHV0IHx8IGlzU2VsZWN0QWxsT3B0aW9uKSByZXR1cm47XG4gICAgICBjb25zdCBpdGVtSW5kZXggPSB0aGlzLnNlbGVjdGVkT3B0aW9ucy5pbmRleE9mKGNoYW5nZS5zb3VyY2UudmFsdWUpO1xuICAgICAgaWYgKGl0ZW1JbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRPcHRpb25zLnNwbGljZShpdGVtSW5kZXgsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMucHVzaChjaGFuZ2Uuc291cmNlLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubWF0U2VsZWN0LnZhbHVlID0gWy4uLnRoaXMuc2VsZWN0ZWRPcHRpb25zXTtcblxuICAgICAgaWYgKCF0aGlzLmhhc1NlbGVjdEFsbCkgcmV0dXJuO1xuICAgICAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zQ291bnQgPSB0aGlzLm1hdFNlbGVjdC5vcHRpb25zLmZpbHRlcihvcHRpb24gPT4gb3B0aW9uLnNlbGVjdGVkKS5sZW5ndGg7XG4gICAgICBjb25zdCBpc0FsbE9wdGlvbnNTZWxlY3RlZCA9XG4gICAgICAgIHNlbGVjdGVkT3B0aW9uc0NvdW50ID09PSB0aGlzLm1hdFNlbGVjdC5vcHRpb25zLmxlbmd0aCAtIE5PTl9JVEVNX09QVElPTlNfQ09VTlQ7XG4gICAgICBpZiAoaXNBbGxPcHRpb25zU2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3ROYXRpdmVTZWxlY3RBbGxDaGVja2JveCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm5hdGl2ZVNlbGVjdEFsbENoZWNrYm94LmdldEF0dHJpYnV0ZSgnY2hlY2tlZCcpKSB7XG4gICAgICAgIHRoaXMuZGVzZWxlY3ROYXRpdmVTZWxlY3RBbGxDaGVja2JveCgpO1xuICAgICAgfVxuICAgIH0pKTtcbiAgfVxuXG4gIC8qXG4gICAgVGhpcyBtZXRob2QgaGVscHMgdGhlIHVzZXIgdG8gc2VsZWN0IGFsbCB0aGUgb3B0aW9ucyBpbiBhIGxpc3QuIEl0IG11c3QgYWxzbyBiZSBhYmxlIHRvIHJldGFpbiB0aGUgb2xkIHNlbGVjdGVkIG9wdGlvbnNcbiAgICBhZnRlciBjbGlja2luZyBTZWxlY3QgQWxsIGluIG5ldyBmaWx0ZXJlZCBsaXN0LiBCdXQgdGhpcyBoYXMgYSBwcm9ibGVtLlxuICAgIFRoZSBjaGVja2JveCBiZWZvcmUgZXZlcnkgbWF0LW9wdGlvbiBpcyB0aGUgZGVmYXVsdCBjaGVja2JveCBnaXZlbiBieSBhbmd1bGFyIG9uIGEgbWF0LW9wdGlvbi5cbiAgICBUaGlzIGNoZWNrYm94IGNhbiBvbmx5IGJlIGNoZWNrZWQgbWFudWFsbHkgYnkgYSBtZXRob2Qgb3B0aW9uLnNlbGVjdCgpLlxuICAgIEJ1dCB0aGlzIG1ldGhvZCBub3Qgb25seSBjaGVja3MgdGhlIGNoZWtib3ggYnV0IGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgb2YgdGhlIG1hdFNlbGVjdCBhbmQgaGVuY2UgYWZ0ZXIgY2xpY2tpbmcgb24gaXQsXG4gICAgdGhlIG1hdFNlbGVjdCB2YWx1ZSBsb3NlcyB0aGUgb2xkIHNlbGVjdGVkIG9wdGlvbnMgYW5kIHdpbGwgb25seSBoYXZlIGFsbCB0aGUgb3B0aW9ucyBpbiB0aGUgbmV3IGZpbHRlcmVkIGxpc3QuXG5cbiAgICBUbyBvdmVyY29tZSB0aGlzIHdlIHJlbW92ZSB0aGUgZGVmYXVsdCBjaGVja2JveCBhbmQgY3JlYXRlIGEgbmV3IGNoZWNrYm94IG9mIG91ciBvd24uIFRoZSBuZXdseSBjcmVhdGVkIGNoZWNrYm94IGhhcyBhbHNvXG4gICAgYSBzbGlnaHRseSBkaWZmZXJlbnQgYXBwZWFyYW5jZSBhbmQgaGVuY2UgY29udHJhc3RzIHdpdGggdGhlIHJlc3Qgb2YgdGhlIGNoZWNrYm94ZXMgaW4gdGhlIG9wdGlvbnMgc28gd2hpY2ggaXMgZ29vZCBhcyB0aGVcbiAgICB1c2VyIHdpbGwgZ2V0IGEgZmVlbCB0aGF0IHRoaXMgcGFydGljdWxhciBvcHRpb24oU2VsZWN0IEFsbCkgaXMgZGlmZmVyZW50IGZyb20gdGhlIHJlc3Qgb2YgdGhlIG9wdGlvbnNcbiAgKi9cbiAgcHJpdmF0ZSBlbmFibGVTZWxlY3RBbGwoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZWN0QWxsID0gdGhpcy5tYXRTZWxlY3Qub3B0aW9ucy50b0FycmF5KClbSU5ERVhfU0VMRUNUX0FMTF07XG4gICAgY29uc3QgbmF0aXZlU2VsZWN0QWxsID0gc2VsZWN0QWxsLl9nZXRIb3N0RWxlbWVudCgpO1xuICAgIGNvbnN0IG1hdFBzZXVkb0NoZWNrYm94ID0gbmF0aXZlU2VsZWN0QWxsLmNoaWxkTm9kZXNbMF07XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZChuYXRpdmVTZWxlY3RBbGwsIG1hdFBzZXVkb0NoZWNrYm94KTtcblxuICAgIHRoaXMubmF0aXZlU2VsZWN0QWxsQ2hlY2tib3ggPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5uYXRpdmVTZWxlY3RBbGxDaGVja2JveCwgJ3R5cGUnLCAnY2hlY2tib3gnKTtcbiAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMubmF0aXZlU2VsZWN0QWxsQ2hlY2tib3gsICduYXRpdmUtY2hlY2tib3gnKTtcbiAgICB0aGlzLnJlbmRlcmVyLmluc2VydEJlZm9yZShuYXRpdmVTZWxlY3RBbGwsIHRoaXMubmF0aXZlU2VsZWN0QWxsQ2hlY2tib3gsIG5hdGl2ZVNlbGVjdEFsbC5jaGlsZE5vZGVzWzBdKTtcblxuICAgIHRoaXMuY2xpY2tMaXN0ZW5lclNlbGVjdEFsbCA9IHRoaXMucmVuZGVyZXIubGlzdGVuKG5hdGl2ZVNlbGVjdEFsbCwgJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMubmF0aXZlU2VsZWN0QWxsQ2hlY2tib3guZ2V0QXR0cmlidXRlKCdjaGVja2VkJykpIHtcbiAgICAgICAgdGhpcy5kZXNlbGVjdE5hdGl2ZVNlbGVjdEFsbENoZWNrYm94KCk7XG4gICAgICAgIHRoaXMuZGVzZWxlY3RBbGxvcHRpb25zKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbGVjdE5hdGl2ZVNlbGVjdEFsbENoZWNrYm94KCk7XG4gICAgICAgIHRoaXMuc2VsZWN0QWxsT3B0aW9ucygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWxlY3RBbGxPcHRpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IG1hdE9wdGlvbnMgPSB0aGlzLm1hdFNlbGVjdC5vcHRpb25zO1xuICAgIGNvbnN0IGl0ZW1zID0gbWF0T3B0aW9ucy50b0FycmF5KCkuc2xpY2UoTk9OX0lURU1fT1BUSU9OU19DT1VOVCk7XG5cbiAgICBsZXQgbm9uU2VsZWN0ZWRJdGVtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGlmICghaXRlbS5zZWxlY3RlZCkgbm9uU2VsZWN0ZWRJdGVtcy5wdXNoKGl0ZW0udmFsdWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMgPSBbLi4udGhpcy5zZWxlY3RlZE9wdGlvbnMsIC4uLm5vblNlbGVjdGVkSXRlbXNdO1xuICAgIHRoaXMubWF0U2VsZWN0LnZhbHVlID0gWy4uLnRoaXMuc2VsZWN0ZWRPcHRpb25zXTtcbiAgfVxuXG4gIHByaXZhdGUgZGVzZWxlY3RBbGxvcHRpb25zKCk6IHZvaWQge1xuICAgIGNvbnN0IG1hdE9wdGlvbnMgPSB0aGlzLm1hdFNlbGVjdC5vcHRpb25zO1xuICAgIGNvbnN0IGl0ZW1zID0gbWF0T3B0aW9ucy50b0FycmF5KCkuc2xpY2UoTk9OX0lURU1fT1BUSU9OU19DT1VOVCk7XG4gICAgY29uc3QgaXRlbVZhbHVlcyA9IGl0ZW1zLm1hcChpdGVtID0+IGl0ZW0udmFsdWUpXG4gICAgdGhpcy5tYXRTZWxlY3QudmFsdWUgPSB0aGlzLnNlbGVjdGVkT3B0aW9ucyA9IHRoaXMuc2VsZWN0ZWRPcHRpb25zLmZpbHRlcihcbiAgICAgIG9wdGlvbiA9PiAhaXRlbVZhbHVlcy5pbmNsdWRlcyhvcHRpb24pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgZml4U2VhcmNoQmFyT25Ub3BXaGlsZVNjcm9sbCgpOiB2b2lkIHtcbiAgICBjb25zdCBzZWFyY2hCYXIgPSB0aGlzLm1hdFNlbGVjdC5vcHRpb25zLnRvQXJyYXkoKVswXS5fZ2V0SG9zdEVsZW1lbnQoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHNlYXJjaEJhciwgJ3Bvc2l0aW9uJywgJ3N0aWNreScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoc2VhcmNoQmFyLCAndG9wJywgJzAnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHNlYXJjaEJhciwgJ3otaW5kZXgnLCAnMScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoc2VhcmNoQmFyLCAnYmFja2dyb3VuZC1jb2xvcicsICd3aGl0ZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWxlY3ROYXRpdmVTZWxlY3RBbGxDaGVja2JveCgpOiB2b2lkIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLm5hdGl2ZVNlbGVjdEFsbENoZWNrYm94LCAnY2hlY2tlZCcsICd0cnVlJyk7XG4gIH1cblxuICBwcml2YXRlIGRlc2VsZWN0TmF0aXZlU2VsZWN0QWxsQ2hlY2tib3goKTogdm9pZCB7XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5uYXRpdmVTZWxlY3RBbGxDaGVja2JveCwgJ2NoZWNrZWQnKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuY2xpY2tMaXN0ZW5lclNlbGVjdEFsbCgpO1xuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwiZmxleC1jb250YWluZXJcIj5cbiAgPGlucHV0XG4gICAgI2lucHV0XG4gICAgaWQ9XCJpbnB1dFwiXG4gICAgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIlxuICAgIGF1dG9jb21wbGV0ZT1cIm9mZlwiXG4gICAgKGlucHV0KT1cImZpbHRlckxpc3QoJGV2ZW50KVwiXG4gICAgKGtleWRvd24pPVwic3RvcENoYXJQcm9wYWdhdGlvbigkZXZlbnQpXCI+XG4gICAgPG1hdC1zcGlubmVyICpuZ0lmPVwiaXNMb2FkaW5nXCIgW2RpYW1ldGVyXT1cIjI1XCI+PC9tYXQtc3Bpbm5lcj5cbjwvZGl2PlxuPG1hdC1kaXZpZGVyPjwvbWF0LWRpdmlkZXI+XG4iXX0=