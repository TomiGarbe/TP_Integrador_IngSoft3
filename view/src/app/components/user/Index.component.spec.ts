import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from './User.service';
import { UserIndex } from './Index.component';
import { of } from 'rxjs';

describe('UserIndex Component', () => {
  let component: UserIndex;
  let fixture: ComponentFixture<UserIndex>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['get']);

    await TestBed.configureTestingModule({
      declarations: [UserIndex],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserIndex);
    component = fixture.componentInstance;
    mockUserService.get.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('Método get', () => {
    it('debería cargar los datos de todos los usuarios', () => {
        const users = [
          { id: 1, name: 'Tomas', lastname: 'Garbellotto', dni: 12345678, email: 'tomas@gmail.com', phone: 1234567890 },
          { id: 2, name: 'Tomi', lastname: 'Garbellotto', dni: 87654321, email: 'tomi@example.com', phone: 9876543210 },
        ];
      
        mockUserService.get.and.returnValue(of(users));
        component.get();
      
        expect(mockUserService.get).toHaveBeenCalled();
        expect(component.users).toEqual(users);
    });
  });
});