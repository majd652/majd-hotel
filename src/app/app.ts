import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from "./shared/components/button/button";
import { Input } from "./shared/components/input/input";
import { Dropdown } from "./shared/components/dropdown/dropdown";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button, Input, Dropdown],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('majd-hotel');
}
