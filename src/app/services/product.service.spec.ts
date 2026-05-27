/// <reference types="vitest/globals" />
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { BackendProduct } from '../interfaces/product.interface';
import { environment } from '../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('mapToProduct', () => {
    it('debería transformar un BackendProduct en un objeto Product compatible con el Frontend', () => {
      const mockApiProduct: BackendProduct = {
        id: 42,
        nombre: 'Camiseta Oversize',
        nombre_localizado: 'Camiseta Oversize',
        slug: 'camiseta-oversize',
        descripcion: 'Una camiseta muy cómoda',
        descripcion_localizada: 'Una camiseta muy cómoda',
        precio: '29.99',
        url_imagen_principal: 'imagen.jpg',
        publico: 'hombre',
        stock: 10,
        marca: { nombre: 'OutfitGo' },
        tallas: [],
        colores: []
      };

      const resultado = service.mapToProduct(mockApiProduct);

      expect(resultado.id).toBe(42);
      expect(resultado.price).toBe(29.99);
      expect(resultado.category).toBe('man');
      expect(resultado.brand).toBe('OutfitGo');
    });
  });

  describe('getProductBySlug', () => {
    it('debería lanzar una petición GET al endpoint correcto y mapear la respuesta', () => {
      const mockSlug = 'pantalon-cargo';
      const mockApiProduct: BackendProduct = {
        id: 10,
        nombre: 'Pantalón Cargo',
        nombre_localizado: 'Pantalón Cargo',
        slug: mockSlug,
        descripcion: 'Estilo urbano',
        descripcion_localizada: 'Estilo urbano',
        precio: '45.00',
        url_imagen_principal: 'cargo.jpg',
        publico: 'mujer',
        stock: 5,
        marca: { nombre: 'OutfitGo' },
        tallas: [],
        colores: []
      };

      service.getProductBySlug(mockSlug).subscribe((product) => {
        expect(product.name).toBe('Pantalón Cargo');
        expect(product.category).toBe('woman');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/productos/${mockSlug}`);
      expect(req.request.method).toBe('GET');

      req.flush(mockApiProduct);
    });
  });
});