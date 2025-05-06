import { Component } from "@mini-angular/component";
import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@mini-angular/interfaces";

@Component({
  selector: "#app",
  template: `
    <h1>{{ title }}</h1>
    <button id="clickBtn">Click me</button>
    <p>{{ count }}</p>
  `,
  styles: `
  h1 {
    color: red;
  }
  `,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = "Hello from Mini Angular with @Component!";
  count = 0;
  detectChanges!: () => void;

  onInit(): void {
    document.getElementById("clickBtn")?.addEventListener("click", () => {
      this.title = "New Title";
      this.count++;
      this.detectChanges();
    });
  }
}
