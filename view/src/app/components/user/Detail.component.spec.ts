import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from './User.service';
import { UserDetail } from './Detail.component';
import { of } from 'rxjs';

describe('UserDetail Component', () => {
  let component: UserDetail;
  let fixture: ComponentFixture<UserDetail>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['get']);

    await TestBed.configureTestingModule({
      declarations: [UserDetail],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Método get', () => {
    it('debería cargar los datos del usuario y asignarlos a "user"', () => {
      const userDetail = {
        id: 1,
        name: 'Tomas',
        lastname: 'Garbellotto',
        dni: 12345678,
        email: 'tomas@gmail.com',
        phone: 1234567890,
      };

      component.user = userDetail;
      mockUserService.get.and.returnValue(of(userDetail));
      component.get();

      expect(mockUserService.get).toHaveBeenCalledWith(component.user.id);
      expect(component.user).toEqual(userDetail);
    });
  });
});