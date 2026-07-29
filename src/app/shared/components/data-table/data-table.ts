import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Loader } from '../loader/loader';
import { EmptyState } from '../empty-state/empty-state';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  imports: [NgTemplateOutlet, Loader, EmptyState],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable<T extends Record<string, any>> {
  columns = input.required<TableColumn<T>[]>();
  data = input.required<T[]>();
  loading = input(false);
  emptyMessage = input('No records found.');

  rowActions = contentChild<TemplateRef<{ $implicit: T }>>('rowActions');

  sortKey: string | null = null;
  sortAsc = true;

  get sortedData(): T[] {
    if (!this.sortKey) return this.data();
    const key = this.sortKey;
    return [...this.data()].sort((a, b) => {
      const valA = a[key], valB = b[key];
      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }

  toggleSort(col: TableColumn<T>): void {
    if (!col.sortable) return;
    const key = String(col.key);
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
  }
}
