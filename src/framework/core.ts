export function bootstrap(ComponentClass: any) {
  const host = document.querySelector(ComponentClass.selector)!;
  let component = new ComponentClass();

  component = new Proxy(component, {
    set(target, key, value) {
      const changed = target[key] !== value;
      target[key] = value;
      if (changed) render();
      return true;
    },
  });

  (window as any).__component__ = component;

  function render() {
    const rendered = ComponentClass.template.replace(
      /\{\{(.*?)\}\}/g,
      (_: any, expr: any) => {
        try {
          const val = eval(`component.${expr.trim()}`);
          return val != null ? val : "";
        } catch {
          return "";
        }
      }
    );

    host.innerHTML = rendered;

    if (typeof component.onInit === "function") {
      component.onInit();
    }
  }

  render();
}
