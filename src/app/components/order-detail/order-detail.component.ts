import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  loading: boolean = true;
  orderId!: number;
  currentUser: User | null = null;
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  username: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      this.loadOrderDetail();
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.isAdmin = this.authService.isAdmin();
      this.username = user?.username || '';
    });
  }

  loadOrderDetail(): void {
    this.loading = true;
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        // The backend returns a shape like:
        // { id, orderTime, status, placedByUsername, items: [{ productName, retailPriceAtOrder, quantity }] }
        // Keep the raw order object and compute a total for display.
        this.order = order;
        // compute total amount from returned items
        if (Array.isArray(this.order.items)) {
          this.order.total = this.order.items.reduce((sum: number, it: any) => {
            const price = Number(it.retailPriceAtOrder ?? 0);
            const qty = Number(it.quantity ?? 0);
            return sum + price * qty;
          }, 0);
        } else {
          this.order.total = 0;
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.loading = false;
        alert('Failed to load order details');
      }
    });
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  cancelOrder(): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(this.orderId).subscribe({
        next: () => {
          alert('Order cancelled successfully');
          this.loadOrderDetail();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order');
        }
      });
    }
  }
  completeOrder(): void {
    if (confirm('Mark this order as completed?')) {
      this.orderService.completeOrder(this.orderId).subscribe({
        next: () => {
          alert('Order completed successfully');
          this.loadOrderDetail();
        },
        error: (error) => {
          console.error('Error completing order:', error);
          alert('Failed to complete order');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
