import { TestBed } from '@angular/core/testing';

import { AccountingDataService } from './accounting-data.service';

describe('AccountingDataService', () => {
    let service: AccountingDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AccountingDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});