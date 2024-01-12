import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Product } from './product';
import { BehaviorSubject, Observable, catchError, combineLatest, filter, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { Review } from '../reviews/review';
import { ReviewService } from '../reviews/review.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  private productSelectedSubject = new BehaviorSubject<undefined | number>(undefined);

  readonly productSelected$ = this.productSelectedSubject.asObservable();

  readonly products$ : Observable<Product[]> = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(p => console.log(JSON.stringify(p))),
      shareReplay(1),
      catchError(error => this.handleError(error))
    );

  readonly product$ = this.productSelected$
  .pipe(
    filter(Boolean),
    switchMap(id => {
      const productUrl = this.productsUrl + '/' + id;
      return this.http.get<Product>(productUrl)
      .pipe(
        switchMap(product => this.getProductWithReviews(product)),
        catchError(error => this.handleError(error))
      );
    })
  )


  readonly product2$ = combineLatest([
      this.productSelected$,
      this.products$
    ]).pipe(
      map(([selectedId, products]) => 
        products.find(product => selectedId === product.id)
      ),
      filter(Boolean),
      switchMap(product => this.getProductWithReviews(product)),
      catchError(error => this.handleError(error))
    );

  /*getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(() => console.log('In http.get pipeline')),
      catchError(error => this.handleError(error))
    );
  }*/

  /*getOneProduct(id: number): Observable<Product> {
    const productUrl = this.productsUrl + '/' + id;
    return this.http.get<Product>(productUrl)
    .pipe(
      tap(() => console.log('In http.get pipeline')),
      switchMap(product => this.getProductWithReviews(product)),
      catchError(error => this.handleError(error))
    );
  }*/

  productSelected(id: number): void {
    this.productSelectedSubject.next(id);
  }

  getProductWithReviews(product: Product) : Observable<Product>{
    if(product.hasReviews){
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
      .pipe(
        map(reviews => ({...product, reviews} as Product))
        );
    } else {
      return of(product);
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    return throwError(() => formattedMessage);
    //throw formattedMessage;
  }
}
