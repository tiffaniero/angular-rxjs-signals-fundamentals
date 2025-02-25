import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Product, Result } from './product';
import { BehaviorSubject, Observable, catchError, combineLatest, filter, map, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { HttpErrorService } from '../utilities/http-error.service';
import { Review } from '../reviews/review';
import { ReviewService } from '../reviews/review.service';
import { toObservable, toSignal }  from '@angular/core/rxjs-interop'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private errorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  selectedProductId = signal<number | undefined>(undefined);

  private productsResult$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      map(p => ({ data: p } as Result<Product[]>)),
      tap(p => console.log(JSON.stringify(p))),
      shareReplay(1),
      catchError(error => of({ 
        data: [], 
        error: this.errorService.formatError(error)
      } as Result<Product[]>))
    );

  productsResult = toSignal(this.productsResult$, 
    { initialValue: ({ data: [] } as Result<Product[]>) });

  products = computed(()=> this.productsResult().data);
  productsError = computed(()=> this.productsResult().error)

  private productResult$ = toObservable(this.selectedProductId)
  .pipe(
    filter(Boolean),
    switchMap(id => {
      const productUrl = this.productsUrl + '/' + id;
      return this.http.get<Product>(productUrl)
      .pipe(
        switchMap(product => this.getProductWithReviews(product)),
        catchError(error => of({ 
          data: undefined, 
          error: this.errorService.formatError(error)
        } as Result<Product[]>))
      );
    }),
    map(p=> ({ data: p} as Result<Product>))
  );

  private productResult = toSignal(this.productResult$);
  product = computed(()=> this.productResult()?.data);
  productError = computed(()=> this.productResult()?.error)


  /*readonly product2$ = combineLatest([
      this.productSelected$,
      this.products$
    ]).pipe(
      map(([selectedId, products]) => 
        products.find(product => selectedId === product.id)
      ),
      filter(Boolean),
      switchMap(product => this.getProductWithReviews(product)),
      catchError(error => this.handleError(error))
    );*/

  productSelected(id: number): void {
    this. selectedProductId.set(id);
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
  }
}
