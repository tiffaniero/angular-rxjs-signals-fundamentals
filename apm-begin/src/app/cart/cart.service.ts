import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  cartCount = computed(() => this.cartItems().reduce((accumulatorQuantity, item) => accumulatorQuantity + item.quantity, 0));

  subTotal = computed(() => this.cartItems().reduce((accTotal, item) => accTotal + (item.quantity * item.product.price), 0));
  deliveryFee = computed<number>(() => this.subTotal() < 50 ? 5.99 : 0);
  tax = computed(() => Math.round(this.subTotal() * 10.75)/100);
  totalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax());

  effectLength = effect(() => console.log('Car array length: ', this.cartItems().length))

  addToCart(product: Product) {
    this.cartItems.update( items => [...items, { product, quantity: 1}]);
    //this.cartItems.update(items => { items.reduce((accumulator, item) => accumulator + item.quantity, 0) })
  }

  updateQuantity(cartItem: CartItem, quantity: number): void{
    this.cartItems.update(items => 
      items.map(item => item.product.id === cartItem.product.id ? {...item, quantity} : item));
  }

  removeFromCart(cartItem: CartItem){
    this.cartItems.update(items => items.filter(item => item !== cartItem ))
  }
}
