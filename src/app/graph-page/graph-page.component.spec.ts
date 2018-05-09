import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPageComponent } from './graph-page.component';
import { Store, StoreModule } from '@ngrx/store';

describe('GraphPageComponent', () => {
  let component: GraphPageComponent;
  let fixture: ComponentFixture<GraphPageComponent>;
  let store: Store<any>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      imports: [ StoreModule.forRoot({}) ],
      declarations: [ GraphPageComponent ]
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphPageComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
