import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent /*implements OnChanges, OnDestroy*/{
 // @Input() productId: number = 0;
  errorMessage = '';
  //sub! : Subscription;

  private productService = inject(ProductService)
  private cartService = inject(CartService)
  // Product to display
  //product: Product | null = null;
  product$ = this.productService.product2$;

  // Set the page title
  //pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  pageTitle = 'Product Detail';

  /*ngOnChanges(changes: SimpleChanges): void {
    const id = changes['productId'].currentValue;
    if(id){
      this.sub = this.productService.getOneProduct(this.productId)
      .pipe(
        tap(product => console.log(product)),
        catchError(error => {
          this.errorMessage = error;
          return EMPTY;
        })
      )
      .subscribe(product => this.product = product);
    }
  }
  ngOnDestroy(): void {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }*/

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
