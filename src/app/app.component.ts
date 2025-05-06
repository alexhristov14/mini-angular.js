import { Component } from "@mini-angular/component";

@Component({
  selector: "#app",
  template: `
    <h1>{{ title }}</h1>
    <button id="clickBtn">Click me</button>
    <p>{{ count }}</p>
  `,
})
export class AppComponent {
  title = "Hello from Mini Angular with @Component!";
  count = 0;

  onInit(): void {
    document.getElementById("clickBtn")?.addEventListener("click", () => {
      this.title = "New Title";
      this.count++;
    });
  }
}
