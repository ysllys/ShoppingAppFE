import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  orders: any[] = [];
  profitableProducts: any[] = [];
  popularProducts: any[] = [];
  totalSoldItems: number = 0;
  loading: boolean = true;

  displayedColumns: string[] = ['orderId', 'customer', 'date', 'total', 'status', 'actions'];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });

    this.productService.getProfitableProducts(3).subscribe({
      next: (products) => {
        this.profitableProducts = products;
      },
      error: (error) => {
        console.error('Error loading profitable products:', error);
      }
    });

    this.productService.getPopularProducts(3).subscribe({
      next: (products) => {
        this.popularProducts = products;
      },
      error: (error) => {
        console.error('Error loading popular products:', error);
      }
    });

    // Load total sold items
  this.http.get<any>('/api/products/sold/total').subscribe({
      next: (response) => {
        this.totalSoldItems = response || 0;
      },
      error: (error) => {
        console.error('Error loading sold items:', error);
      }
    });
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          alert('Order cancelled successfully');
          this.loadData();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order');
        }
      });
    }
  }

  completeOrder(orderId: number): void {
    if (confirm('Mark this order as completed?')) {
      this.orderService.completeOrder(orderId).subscribe({
        next: () => {
          alert('Order completed successfully');
          this.loadData();
        },
        error: (error) => {
          console.error('Error completing order:', error);
          alert('Failed to complete order');
        }
      });
    }
  }

  navigateToProductManagement(): void {
    this.router.navigate(['/admin/products']);
  }
}
