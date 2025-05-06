import { ChangeDetectionStrategy, ViewEncapsulation } from "./interfaces";
import { ComponentRegistry } from "./core";

export function bootstrap(ComponentClass: any) {
  const host = document.querySelector(ComponentClass.selector);
  if (!host)
    throw new Error(
      `Component host element not found for selector ${ComponentClass.selector}`
    );

  let component = new ComponentClass();

  // Register child components
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

    rendered = renderAllChildComponents(rendered, component);

    rendered = rendered.replace(/\{\{(.*?)\}\}/g, (_: any, expr: any) => {
      try {
        const val = eval(`component.${expr.trim()}`);
        return val != null ? val : "";
      } catch {
        return "";
      }
    });

    host.innerHTML = rendered;

    // Apply scoping attribute only if Emulated encapsulation
    if (ComponentClass.encapsulation === ViewEncapsulation.Emulated) {
      host.querySelectorAll("*").forEach((el: any) => {
        el.setAttribute(getScopeAttr(ComponentClass.selector), "");
      });
    }

    if (typeof component.onInit === "function") component.onInit();

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
      styleContent = styles.replace(/([^{]+){/g, (match, selectorPart) => {
        const scoped = selectorPart
          .split(",")
          .map((s: string) => `${s.trim()}[${attr}]`)
          .join(", ");
        return `${scoped} {`;
      });
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
  return `_mini_ng_scope_${selector.replace(/[^a-z0-9]/gi, "")}`;
}

function renderAllChildComponents(
  rendered: string,
  parentInstance: any
): string {
  for (const [selector, ChildClass] of ComponentRegistry.entries()) {
    applyStyles(
      ChildClass.styles,
      ChildClass.stylesUrl,
      ChildClass.selector,
      ChildClass.encapsulation
    );

    const matches = Array.from(
      rendered.matchAll(new RegExp(`<${selector}([^>]*)></${selector}>`, "g"))
    );

    for (const match of matches) {
      const fullTag = match[0];
      const attrString = match[1];
      const childInstance = new ChildClass();
      const inputs = ChildClass.__inputs || [];

      evaluateInputData(inputs, attrString, childInstance);

      // Render child template
      let childHtml = ChildClass.template;
      childHtml = childHtml.replace(/\{\{(.*?)\}\}/g, (_: any, expr: any) => {
        try {
          const val = eval(`childInstance.${expr.trim()}`);
          return val != null ? val : "";
        } catch {
          return "";
        }
      });

      rendered = rendered.replace(fullTag, childHtml);
    }
  }

  return rendered;
}

function evaluateInputData(
  inputs: string[],
  attrString: string,
  childInstance: any
) {
  // Bind input properties
  inputs.forEach((inputKey: string) => {
    const regex = new RegExp(`\\[${inputKey}\\]="(.*?)"`);
    const inputMatch = attrString.match(regex);

    if (inputMatch) {
      try {
        const value = eval(`parentInstance.${inputMatch[1]}`) ?? inputMatch[1];
        childInstance[inputKey] = value;
      } catch {
        childInstance[inputKey] = inputMatch[1];
      }
    }
  });
}
