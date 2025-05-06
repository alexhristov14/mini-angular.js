export function Component(config: { selector: string; template: string }) {
  return function (target: any) {
    target.selector = config.selector;
    target.template = config.template;
  };
}
