import { TestBed } from '@angular/core/testing';

import { ShopDataService } from './shop-data.service';

describe('ShopDataService', () => {
    let service: ShopDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ShopDataService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});