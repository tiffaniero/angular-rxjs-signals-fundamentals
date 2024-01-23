import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, computed, inject } from '@angular/core';

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

  private productService = inject(ProductService)
  private cartService = inject(CartService)

  product = this.productService.product;
  errorMessage = this.productService.productError;

  pageTitle = computed(() => 
  this.product() 
  ? `Product Detail for: ${this.product()?.productName}` 
  : 'Product Detail');

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
