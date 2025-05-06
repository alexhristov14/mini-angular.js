import { Component, Input } from "@mini-angular/core";

@Component({
  selector: "child-selector",
  template: `
    <h1>
      Hello, I'm a Child Component, with input {{ name }} and another input
      {{ second }}
    </h1>
  `,
})
export class ChildComponent {
  @Input() name: string = "";
  @Input() second: string = "";
}
