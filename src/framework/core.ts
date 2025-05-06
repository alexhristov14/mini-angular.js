import { ChangeDetectionStrategy, ViewEncapsulation } from "./interfaces";
import { ComponentRegistry } from "./component";

export function bootstrap(ComponentClass: any) {
  const host = document.querySelector(ComponentClass.selector)!;
  let component = new ComponentClass();

  // Register the imports
  for (const Imported of ComponentClass.imports || []) {
    ComponentRegistry.set(Imported.selector, Imported);
  }

  applyStyles(
    ComponentClass.styles,
    ComponentClass.stylesUrl,
    ComponentClass.selector,
    ComponentClass.encapsulation
  );

  component = new Proxy(component, {
    set(target, key, value) {
      const changed = target[key] !== value;
      target[key] = value;
      const isOnPush =
        ComponentClass.changeDetection === ChangeDetectionStrategy.OnPush;

      if (changed && !isOnPush) render();
      return true;
    },
  });

  (window as any).__component__ = component;

  function render() {
    let rendered = ComponentClass.template;

    rendered = renderAllChildComponents(rendered);

    rendered = rendered.replace(/\{\{(.*?)\}\}/g, (_: any, expr: any) => {
      try {
        const val = eval(`component.${expr.trim()}`);
        return val != null ? val : "";
      } catch {
        return "";
      }
    });

    host.innerHTML = rendered;

    if (ComponentClass.encapsulation === ViewEncapsulation.Emulated) {
      host.querySelectorAll("*").forEach((el: any) => {
        el.setAttribute(getScopeAttr(ComponentClass.selector), "");
      });
    }

    if (typeof component.onInit === "function") component.onInit();

    if (typeof component.onDestroy === "function") component.onDestroy();

    (component as any).detectChanges = render;
  }

  render();
}

function applyStyles(
  styles: string | undefined,
  stylesUrl: string | undefined,
  selector: string,
  encapsulation: ViewEncapsulation
) {
  if (styles) {
    const attr = getScopeAttr(selector);

    let styleContent = styles;

    if (encapsulation === ViewEncapsulation.Emulated) {
      // regex gets the css selectors, all characters until '{'
      const scopedCSS = styles.replace(/([^{]+){/g, (match, selectorPart) => {
        const scoped = selectorPart
          .split(",")
          .map((s: string) => `${s.trim()}[${attr}]`)
          .join(", ");

        return `${scoped} {`;
      });

      styleContent = scopedCSS;
    }

    const styleEl = document.createElement("style");
    styleEl.textContent = styleContent;
    document.head.appendChild(styleEl);
  }

  if (stylesUrl) {
    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = stylesUrl;
    document.head.appendChild(linkEl);
  }
}

function getScopeAttr(selector: string): string {
  return `_mini-ng-content-${selector.replace(/[^a-z0-9]/gi, "")}`;
}

function renderAllChildComponents(rendered: string): string {
  // We loop through all the child components and render/evaluate them.
  for (const [selector, ChildClass] of ComponentRegistry.entries()) {
    const childTag = `<${selector}></${selector}>`;

    if (rendered.includes(childTag)) {
      const childInstance = new ChildClass();

      if (typeof childInstance.onInit === "function") childInstance.onInit();

      let childHtml = ChildClass.template || "";

      childHtml = childHtml.replace(/\{\{(.*?)\}\}/g, (_: any, expr: any) => {
        try {
          const val = eval(`childInstance.${expr.trim()}`);
          return val != null ? val : "";
        } catch {
          return "";
        }
      });

      rendered = rendered.replaceAll(childTag, childHtml);
    }
  }

  return rendered;
}
