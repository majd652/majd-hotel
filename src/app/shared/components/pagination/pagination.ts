import { Component, computed, input, model } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  totalItems = input.required<number>();
  pageSize = input(10);
  currentPage = model(1); // model = input + output مدموجين

  totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }
}