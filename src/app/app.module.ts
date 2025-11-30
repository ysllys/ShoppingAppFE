import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Services
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';
import { WatchlistService } from './services/watchlist.service';

// Components
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { NavbarComponent } from './components/navbar/navbar.component';

// Interceptor (functional)
import { authInterceptorFn } from './interceptors/auth.interceptor';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
    ,
    // Standalone components (import them instead of declaring)
    AppComponent,
    LoginComponent,
    SignupComponent,
    UserHomeComponent,
    ProductsComponent,
    // moved standalone components to imports
    NavbarComponent,
    ProductDetailComponent,
    OrderDetailComponent,
    AdminHomeComponent,
    AdminProductsComponent,
    ProductFormComponent
  ],
  providers: [
    AuthService,
    CartService,
    OrderService,
    ProductService,
    WatchlistService,
    {
      provide: HTTP_INTERCEPTORS,
      useValue: authInterceptorFn,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
