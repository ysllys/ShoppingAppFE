import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  loading: boolean = true;
  showAddForm: boolean = false;
  editingProduct: any = null;

  displayedColumns: string[] = ['image', 'name', 'wholesalePrice', 'retailPrice', 'stock', 'actions'];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
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

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  editProduct(product: any): void {
    this.editingProduct = { ...product };
    this.showAddForm = true;
  }

  openAddForm(): void {
    this.editingProduct = null;
    this.showAddForm = true;
  }

  closeForm(): void {
    this.showAddForm = false;
    this.editingProduct = null;
  }

  saveProduct(productData: any): void {
    if (this.editingProduct) {
      // Update existing product
      this.productService.updateProduct(this.editingProduct.id, productData).subscribe({
        next: () => {
          alert('Product updated successfully');
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('Failed to update product');
        }
      });
    } else {
      // Create new product
      this.productService.createProduct(productData).subscribe({
        next: () => {
          alert('Product created successfully');
          this.loadProducts();
          this.closeForm();
        },
        error: (error) => {
          console.error('Error creating product:', error);
          alert('Failed to create product');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
