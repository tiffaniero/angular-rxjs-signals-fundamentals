import { Component, Input, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../cart';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, NgIf],
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {

  @Input({ required: true }) set cartItem(cartItem: CartItem){
    this.cartItemSignal.set(cartItem);
  }

  cartItemSignal = signal<CartItem>(undefined!); // not best practice

  private cartService = inject(CartService);

  // Quantity available (hard-coded to 8)
  // Mapped to an array from 1-8
  qtyArr = [...Array(8).keys()].map(x => x + 1);

  // Calculate the extended price
  exPrice = computed(()=> this.cartItemSignal().quantity * this.cartItemSignal().product.price);

  onQuantitySelected(quantity: number): void {
    this.cartService.updateQuantity(this.cartItemSignal(), Number(quantity));
  }

  removeFromCart(): void {
    this.cartService.removeFromCart(this.cartItemSignal());
  }
}
