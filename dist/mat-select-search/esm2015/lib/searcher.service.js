import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class Searcher {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL21hdC1zZWxlY3Qtc2VhcmNoL3NyYy9saWIvc2VhcmNoZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUczQyxNQUFNLE9BQU8sUUFBUTtJQURyQjtRQUVVLFNBQUksR0FBNkIsRUFBRSxDQUFDO1FBQ3BDLG1CQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsdUJBQWtCLEdBQUcsRUFBRSxDQUFDO1FBQ3hCLHNCQUFpQixHQUFHLEVBQUUsQ0FBQztRQUN2QixpQkFBWSxHQUE2QixFQUFFLENBQUM7UUFDNUMseUJBQW9CLEdBQTZCLEVBQUUsQ0FBQztRQUNwRCxxQ0FBZ0MsR0FBRyxJQUFJLENBQUM7S0FnRWpEO0lBOURDLFVBQVUsQ0FBQyxJQUE4QixFQUFFLGdCQUEwQjtRQUNuRSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsaUNBQ3ZCLElBQUksS0FBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsSUFDckUsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQztTQUN4QzthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQztRQUNELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3hDLENBQUM7SUFFRCxVQUFVLENBQUMsVUFBc0I7UUFDL0IsSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUN4QyxNQUFNLFVBQVUsR0FBSSxVQUFVLENBQUMsTUFBMkIsQ0FBQyxLQUFLLENBQUM7UUFDakUsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDckUsTUFBTSxxQkFBcUIsR0FBRyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQ2hGLElBQUksQ0FBQyxVQUFVLEdBQUcscUJBQXFCLENBQUM7UUFFeEMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxxQkFBcUIsQ0FBQztRQUNoRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUM5QyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUM7WUFDOUMsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUM7U0FDbEM7UUFDRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDckMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN4RixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQUVPLGFBQWEsQ0FBQyxJQUE0QixFQUFFLGdCQUEwQjtRQUM1RSxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDeEIsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUFFTyxPQUFPO1FBQ2IsSUFBSSxJQUFJLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDaEYsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDOUMsSUFBSSxDQUFDLGdDQUFnQyxHQUFHLElBQUksQ0FBQztZQUM3QyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDMUI7UUFFRCxNQUFNLG1CQUFtQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsS0FBSyxpQkFBaUIsQ0FBQztRQUN6RSxNQUFNLDZCQUE2QixHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUNoRSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQztRQUUvRCxJQUFJLDZCQUE2QixFQUFFO1lBQ2pDLElBQUksQ0FBQyxnQ0FBZ0MsR0FBRyxLQUFLLENBQUM7WUFDOUMsT0FBTztTQUNSO1FBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFTyxvQkFBb0I7UUFDMUIsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztRQUMzRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEYsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDaEQsT0FBTyxvQkFBb0IsSUFBSSxZQUFZLEtBQUssSUFBSSxDQUFDLGtCQUFrQixDQUFDO0lBQzFFLENBQUM7O3FHQXZFVSxRQUFRO3lHQUFSLFFBQVE7MkZBQVIsUUFBUTtrQkFEcEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFNlYXJjaGVyIHtcbiAgcHJpdmF0ZSBsaXN0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10gPSBbXTtcbiAgcHJpdmF0ZSBzZWFyY2hQcm9wZXJ0eSA9ICcnO1xuICBwcml2YXRlIHNlYXJjaFRleHQgPSAnJztcbiAgcHJpdmF0ZSBwcmV2aW91c1NlYXJjaFRleHQgPSAnJztcbiAgcHJpdmF0ZSBwcmV2aW91c0lucHV0dHlwZSA9ICcnO1xuICBwcml2YXRlIGZpbHRlcmVkTGlzdDogUmVjb3JkPHN0cmluZywgc3RyaW5nPltdID0gW107XG4gIHByaXZhdGUgcHJldmlvdXNGaWx0ZXJlZExpc3Q6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5bXSA9IFtdO1xuICBwcml2YXRlIHNob3VsZFJldHVyblByZXZpb3VzRmlsdGVyZWRMaXN0ID0gdHJ1ZTtcblxuICBpbml0U2VhcmNoKGxpc3Q6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5bXSwgc2VhcmNoUHJvcGVydGllczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBpZiAoc2VhcmNoUHJvcGVydGllcy5sZW5ndGggPiAxKSB7XG4gICAgICB0aGlzLmxpc3QgPSBsaXN0Lm1hcChpdGVtID0+IChcbiAgICAgICAgey4uLml0ZW0sIGNvbmNhdGVkVmFsdWVzOiB0aGlzLmNvbmNhdGVWYWx1ZXMoaXRlbSwgc2VhcmNoUHJvcGVydGllcyl9XG4gICAgICApKTtcbiAgICAgIHRoaXMuc2VhcmNoUHJvcGVydHkgPSAnY29uY2F0ZWRWYWx1ZXMnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICAgICAgdGhpcy5zZWFyY2hQcm9wZXJ0eSA9IHNlYXJjaFByb3BlcnRpZXNbMF07XG4gICAgfVxuICAgIHRoaXMucHJldmlvdXNGaWx0ZXJlZExpc3QgPSB0aGlzLmxpc3Q7XG4gIH1cblxuICBmaWx0ZXJMaXN0KGlucHV0RXZlbnQ6IElucHV0RXZlbnQpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10gfCB1bmRlZmluZWQge1xuICAgIGlmIChpbnB1dEV2ZW50LmRhdGEgPT09ICcgJykgeyByZXR1cm47IH1cbiAgICBjb25zdCBzZWFyY2hUZXh0ID0gKGlucHV0RXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgIGNvbnN0IHJlbW92ZVdoaXRlc3BhY2VzID0gKHRleHQ6IHN0cmluZykgPT4gdGV4dC5zcGxpdCgnICcpLmpvaW4oJycpO1xuICAgIGNvbnN0IHNlYXJjaFRleHRJbkxvd2VyQ2FzZSA9IHJlbW92ZVdoaXRlc3BhY2VzKHNlYXJjaFRleHQpLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG4gICAgdGhpcy5zZWFyY2hUZXh0ID0gc2VhcmNoVGV4dEluTG93ZXJDYXNlO1xuXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuZ2V0TGlzdCgpO1xuICAgIHRoaXMucHJldmlvdXNTZWFyY2hUZXh0ID0gc2VhcmNoVGV4dEluTG93ZXJDYXNlO1xuICAgIHRoaXMucHJldmlvdXNJbnB1dHR5cGUgPSBpbnB1dEV2ZW50LmlucHV0VHlwZTtcbiAgICBpZiAoIWxpc3QpIHtcbiAgICAgIHRoaXMuZmlsdGVyZWRMaXN0ID0gdGhpcy5wcmV2aW91c0ZpbHRlcmVkTGlzdDtcbiAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzRmlsdGVyZWRMaXN0O1xuICAgIH1cbiAgICB0aGlzLmZpbHRlcmVkTGlzdCA9IGxpc3QuZmlsdGVyKGl0ZW0gPT5cbiAgICAgIHJlbW92ZVdoaXRlc3BhY2VzKGl0ZW1bdGhpcy5zZWFyY2hQcm9wZXJ0eV0pLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXModGhpcy5zZWFyY2hUZXh0KSk7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyZWRMaXN0O1xuICB9XG5cbiAgcHJpdmF0ZSBjb25jYXRlVmFsdWVzKGl0ZW06IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sIHNlYXJjaFByb3BlcnRpZXM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICBsZXQgY29uY2F0ZWRWYWx1ZXMgPSAnJztcbiAgICBzZWFyY2hQcm9wZXJ0aWVzLmZvckVhY2gocHJvcGVydHkgPT4gY29uY2F0ZWRWYWx1ZXMgKz0gaXRlbVtwcm9wZXJ0eV0pO1xuICAgIHJldHVybiBjb25jYXRlZFZhbHVlcztcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TGlzdCgpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+W10gfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLnByZXZpb3VzU2VhcmNoVGV4dCAmJiB0aGlzLnNlYXJjaFRleHQuaW5jbHVkZXModGhpcy5wcmV2aW91c1NlYXJjaFRleHQpKSB7XG4gICAgICB0aGlzLnByZXZpb3VzRmlsdGVyZWRMaXN0ID0gdGhpcy5maWx0ZXJlZExpc3Q7XG4gICAgICB0aGlzLnNob3VsZFJldHVyblByZXZpb3VzRmlsdGVyZWRMaXN0ID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzLmZpbHRlcmVkTGlzdDtcbiAgICB9XG5cbiAgICBjb25zdCBpc0xhc3RUZXh0RnJvbVBhc3RlID0gdGhpcy5wcmV2aW91c0lucHV0dHlwZSA9PT0gJ2luc2VydEZyb21QYXN0ZSc7XG4gICAgY29uc3QgY2FuUmV0dXJuUHJldmlvdXNGaWx0ZXJlZExpc3QgPSB0aGlzLmlzQmFja1NwYWNlZExhc3RDaGFyKCkgJiZcbiAgICAgIWlzTGFzdFRleHRGcm9tUGFzdGUgJiYgdGhpcy5zaG91bGRSZXR1cm5QcmV2aW91c0ZpbHRlcmVkTGlzdDtcblxuICAgIGlmIChjYW5SZXR1cm5QcmV2aW91c0ZpbHRlcmVkTGlzdCkge1xuICAgICAgdGhpcy5zaG91bGRSZXR1cm5QcmV2aW91c0ZpbHRlcmVkTGlzdCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5saXN0O1xuICB9XG5cbiAgcHJpdmF0ZSBpc0JhY2tTcGFjZWRMYXN0Q2hhcigpOiBib29sZWFuIHtcbiAgICBjb25zdCBpc1RleHREZWNyZW1lbnRlZEJ5MSA9IHRoaXMucHJldmlvdXNTZWFyY2hUZXh0Lmxlbmd0aCAtIHRoaXMuc2VhcmNoVGV4dC5sZW5ndGggPT09IDE7XG4gICAgY29uc3QgbGFzdENoYXIgPSB0aGlzLnByZXZpb3VzU2VhcmNoVGV4dC5jaGFyQXQodGhpcy5wcmV2aW91c1NlYXJjaFRleHQubGVuZ3RoIC0gMSk7XG4gICAgY29uc3QgY29uY2F0ZWRUZXh0ID0gdGhpcy5zZWFyY2hUZXh0ICsgbGFzdENoYXI7XG4gICAgcmV0dXJuIGlzVGV4dERlY3JlbWVudGVkQnkxICYmIGNvbmNhdGVkVGV4dCA9PT0gdGhpcy5wcmV2aW91c1NlYXJjaFRleHQ7XG4gIH1cbn1cbiJdfQ==