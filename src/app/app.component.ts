import { Component } from "@mini-angular/core";
import { ChildComponent } from "./child.component";
import {
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from "@mini-angular/interfaces";
@Component({
  selector: "#app",
  template: `
    <div>
      <h1 mini-ng-if="1 == 1">{{ title }}</h1>
      <h1 mini-ng-if="false">{{ title }}</h1>
      <button id="clickBtn">Click me</button>
      <p>{{ count }}</p>
      <child-selector
        mini-ng-if="false"
        [name]="test1"
        [second]="test2"
      ></child-selector>
    </div>
  `,
  styles: `
  h1 {
    color: red;
  }
  `,
  imports: [ChildComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
  title = "Hello from Mini Angular with @Component!";
  count = 0;
  test1 = "test1";
  test2 = "test2";
  detectChanges!: () => void;

  onInit(): void {
    document.getElementById("clickBtn")?.addEventListener("click", () => {
      this.title = "New Title";
      this.count++;
    });
  }
}
