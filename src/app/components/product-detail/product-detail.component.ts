import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WatchlistService } from '../../services/watchlist.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading: boolean = true;
  // local selected quantity for cart operations
  cartQuantity: number = 1;
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private watchlistService: WatchlistService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProductDetail(productId);
    });
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.isAdmin = this.authService.isAdmin();
      this.username = user?.username || '';
    });
  }

  loadProductDetail(productId: number): void {
    this.loading = true;
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        alert('Failed to load product details');
      }
    });
  }

  incrementQuantity(): void {
    if (this.product && this.cartQuantity < (this.product.quantity ?? 0)) {
      this.cartQuantity++;
    }
  }

  decrementQuantity(): void {
    if (this.cartQuantity > 1) {
      this.cartQuantity--;
    }
  }

  addToCart(): void {
    if ((this.product.quantity ?? 0) === 0) {
      alert('Product is out of stock');
      return;
    }
    this.cartService.addToCart(this.product, this.cartQuantity);
    alert(`${this.cartQuantity} ${this.product.name}(s) added to cart!`);
  }

  addToWatchlist(): void {
    this.watchlistService.addToWatchlist(this.product.id).subscribe({
      next: () => {
        alert('Product added to watchlist!');
      },
      error: (error) => {
        console.error('Error adding to watchlist:', error);
        alert('Failed to add to watchlist');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
