import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
//import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent /*implements OnInit, OnDestroy*/{
  pageTitle = 'Products';
  errorMessage = '';
  //sub!: Subscription;

  private productService = inject(ProductService);

  // Products
  //products: Product[] = [];
  
  readonly products$ = this.productService.products$
  .pipe(
    catchError(error => {
      this.errorMessage = error;
      return EMPTY;
    })
  );


  // Selected product id to highlight the entry
  //selectedProductId: number = 0;
  readonly selectedProductId$ = this.productService.productSelected$;

  /*ngOnInit(): void {
    this.sub = this.productService.getProducts()
    .pipe(
      tap(()=> console.log('In component pipeline')),
      catchError(error => {
        this.errorMessage = error;
        return EMPTY;
      })
    )
    .subscribe({
      next: products => this.products = products,
      complete: () => {
        console.log('End of the list')
      }
    });
  }*/

  /*ngOnDestroy(): void {
    this.sub.unsubscribe();
  }*/

  onSelected(productId: number): void {
    //this.selectedProductId = productId;
    this.productService.productSelected(productId);
  }
}
