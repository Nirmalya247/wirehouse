import { TestBed } from '@angular/core/testing';

import { ReturnDataService } from './return-data.service';

describe('ReturnDataService', () => {
    let service: ReturnDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ReturnDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});