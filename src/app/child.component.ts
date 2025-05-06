import { Component, Input } from "@mini-angular/core";

@Component({
  selector: "child-selector",
  template: `
    <h2>
      Hello, I'm a Child Component, with input {{ name }} and another input
      {{ second }}
    </h2>
  `,
  styles: `
    h2 {
        color: green;
    }
  `,
})
export class ChildComponent {
  @Input() name: string = "";
  @Input() second: string = "";
}
