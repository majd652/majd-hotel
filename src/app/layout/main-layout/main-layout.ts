import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { Header } from '../../shared/components/header/header';
import { ToastContainer } from '../../shared/components/toast-container/toast-container';


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Header, ToastContainer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
