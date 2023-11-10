import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public products: any[] = [];
  public filteredProducts: any[] = [];
  public productFilterForm: FormGroup | undefined;
  public isLoading: boolean = false;
  public productForm!: FormGroup;

  constructor(private fb: FormBuilder, private productS: ProductService) {}

  

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],

    });
    this.isLoading = true;
    this.productS.getProducts().subscribe(
      (res: any) => {
        this.products = res.data;
        this.filteredProducts = this.products;
        console.log(this.filteredProducts);
        
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  
  onSubmit() {
    // Handle form submission here
    if (this.productForm.valid) {
      const formData = this.productForm.value;
      // Perform actions with the form data, e.g., send it to a service
      console.log(formData);
    }
  }


  public formatPrice(price:any) {
    if (typeof price === 'string') {
      // If the price is a string, check for the presence of '$' symbol.
      if (price.includes('$')) {
        // If '$' is on the left, move it to the right.
        return price.replace('$', '') + '$';
      } else {
        // If '$' is not present, add it to the right.
        return price + '$';
      }
    } else if (typeof price === 'number') {
      // If the price is a number, convert it to a string and add '$' on the right.
      return price.toString() + '$';
    } else {
      // Handle other cases, e.g., when the data is not a string or a number.
      return 'N/A';
    }
  }
  
  public  formatReadableDate(dateString:any) {
    const options:any = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('en-US', options);
  }

    // Function to handle clicking the heart icon
    toggleFavoriteIcon(product: any) {
      if (this.productS.isFavorite(product)) {
        this.productS.removeFromFavorites(product);
      } else {
        this.productS.addToFavorites(product);
      }
    }
  
    // Function to check if a product is a favorite
    isFavorite(product: any): boolean {
      return this.productS.isFavorite(product);
    }
  
    // Function to handle clicking the cart icon
    toggleCartIcon(product: any) {
      if (this.productS.isInCart(product)) {
        this.productS.removeFromCart(product);
      } else {
        this.productS.addToCart(product);
      }
    }
  
    // Function to check if a product is in the cart
    isInCart(product: any): boolean {
      return this.productS.isInCart(product);
    }

}
