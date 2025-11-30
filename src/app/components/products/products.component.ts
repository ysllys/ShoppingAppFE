import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { WatchlistService } from '../../services/watchlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  watchlistProducts: any[] = [];
  loading: boolean = true;
  showCart: boolean = false;
  cartItems: any[] = [];
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  username: string = '';
  currentUser: User | null = null;

  displayedColumns: string[] = ['image', 'name', 'description', 'price', 'stock', 'actions'];

  constructor(
    private productService: ProductService,
    private watchlistService: WatchlistService,
    public cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.isAdmin = this.authService.isAdmin();
      this.username = user?.username || '';
    });

    this.loadProducts();
    this.loadWatchlist();
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadWatchlist(): void {
    this.watchlistService.getAllWatchlistProducts().subscribe({
      next: (products) => {
        this.watchlistProducts = products;
      },
      error: (error) => {
        console.error('Error loading watchlist:', error);
      }
    });
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert(`${product.name} added to cart!`);
  }

  addToWatchlist(productId: number): void {
    this.watchlistService.addToWatchlist(productId).subscribe({
      next: () => {
        alert('Product added to watchlist!');
        this.loadWatchlist();
      },
      error: (error) => {
        console.error('Error adding to watchlist:', error);
        alert('Failed to add product to watchlist');
      }
    });
  }

  removeFromWatchlist(productId: number): void {
    this.watchlistService.removeFromWatchlist(productId).subscribe({
      next: () => {
        alert('Product removed from watchlist!');
        this.loadWatchlist();
      },
      error: (error) => {
        console.error('Error removing from watchlist:', error);
      }
    });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  updateCartQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  checkout(): void {
    const cartItems = this.cartService.getCartItems();
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const orderData = {
      items: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

  this.productService['http'].post('/api/orders', orderData).subscribe({
      next: (response) => {
        alert('Order placed successfully!');
        this.cartService.clearCart();
        this.showCart = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error placing order:', error);
        alert('Failed to place order');
      }
    });
  }
}
