import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input() product: any = null;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  productForm!: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [this.product?.name || '', [Validators.required]],
      description: [this.product?.description || '', [Validators.required]],
      retailPrice: [this.product?.retailPrice ?? this.product?.price ?? '', [Validators.required, Validators.min(0)]],
      wholesalePrice: [this.product?.wholesalePrice ?? '', [Validators.min(0)]],
      quantity: [this.product?.quantity ?? this.product?.stock ?? 0, [Validators.required, Validators.min(0)]],
      imageUrl: [this.product?.imageUrl || '']
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      this.save.emit(this.productForm.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
