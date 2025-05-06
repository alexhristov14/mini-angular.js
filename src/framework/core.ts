export function bootstrap(ComponentClass: any) {
  const host = document.querySelector(ComponentClass.selector);
  const component = new ComponentClass();

  component.__host = host;
  component.__template = ComponentClass.template;

  // Change Detection -> we check if rendered data has been changed
  component.detectChanges = function () {
    const renderedTemplate = this.__template.replace(
      /\{\{(.*?)\}\}/g, // Looking for {{ DATA }}
      (_: any, expr: any) => {
        const value = eval(`this.${expr.trim()}`);
        return value != null ? value : "";
      }
    );
    this.__host.innerHTML = renderedTemplate;
    if (typeof this.onInit === "function") {
      this.onInit();
    }
  };

  component.detectChanges();

  return component;
}
