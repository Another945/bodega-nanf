import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MermaPage } from './merma.page';

describe('MermaPage', () => {
  let component: MermaPage;
  let fixture: ComponentFixture<MermaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MermaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
