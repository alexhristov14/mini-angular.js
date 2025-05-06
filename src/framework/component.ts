import { ChangeDetectionStrategy, ViewEncapsulation } from "./interfaces";

export const ComponentRegistry = new Map<string, any>();

export function Component(config: {
  selector: string;
  template?: string;
  templateUrl?: string;
  styles?: string;
  stylesUrl?: string;
  imports?: any[];
  encapsulation?: ViewEncapsulation;
  changeDetection?: ChangeDetectionStrategy;
}) {
  return function (target: any) {
    target.selector = config.selector;
    target.template = config.template;
    target.templateUrl = config.templateUrl;
    target.styles = config.styles;
    target.stylesUrl = config.stylesUrl;
    target.imports = config.imports;
    target.encapsulation = config.encapsulation ?? ViewEncapsulation.None;
    target.changeDetection =
      config.changeDetection ?? ChangeDetectionStrategy.Default;

    ComponentRegistry.set(config.selector, target);
  };
}
