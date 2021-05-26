import { TestBed } from '@angular/core/testing';

import { SaleDataService } from './sale-data.service';

describe('SaleDataService', () => {
    let service: SaleDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SaleDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});