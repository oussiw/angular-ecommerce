import {Injectable} from '@angular/core';
import {CartItem} from '../common/cart-item';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {
  }

  addToCart(cartItem: CartItem): void {
    // Check if the item already exists in the cart
    let alreadyExistsInCart = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id === cartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      // }
      // we replace this loop with this next line.
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);
      // Check if we found the item
      alreadyExistsInCart = (existingCartItem !== undefined);
    }
    if (alreadyExistsInCart) {
      existingCartItem.quantity ++;
      console.log(`------------------${existingCartItem.quantity}`);
    } else {
      this.cartItems.push(cartItem);
    }
    this.computeCartTotals();
  }

  computeCartTotals(): void {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let cartItem of this.cartItems) {
      totalPriceValue += cartItem.quantity * cartItem.unitPrice;
      totalQuantityValue += cartItem.quantity;
    }

    // publish the new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number): void {
    console.log('Content of the cart');
    for (let cartItem of this.cartItems) {
      const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
      console.log(`name: ${cartItem.name}, quantity: ${cartItem.quantity}, `
        + `unitPrice: ${cartItem.unitPrice},subTotalPrice: ${subTotalPrice}`);
    }
    console.log(`Total price: ${totalPriceValue.toFixed(2)}, Total quantity: ${totalQuantityValue}`);
    console.log('-----------');
  }

  decrementQuantity(cartItem: CartItem): void{
    cartItem.quantity --;

    if (cartItem.quantity === 0){
      this.remove(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem): void {

    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === cartItem.id);

    if (itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }
}
