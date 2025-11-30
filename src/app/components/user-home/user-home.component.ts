import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  orders: any[] = [];
  frequentProducts: any[] = [];
  recentProducts: any[] = [];
  loading: boolean = true;

  displayedColumns: string[] = ['orderId', 'date', 'total', 'status', 'actions'];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
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

    this.productService.getFrequentProducts(3).subscribe({
      next: (products) => {
        this.frequentProducts = products; //products.map(p => p.product);
      },
      error: (error) => {
        console.error('Error loading frequent products:', error);
      }
    });

    this.productService.getRecentProducts(3).subscribe({
      next: (products) => {
        this.recentProducts = products;
      },
      error: (error) => {
        console.error('Error loading recent products:', error);
      }
    });
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }
}
