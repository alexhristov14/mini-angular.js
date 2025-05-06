import { ChangeDetectionStrategy, ViewEncapsulation } from "./interfaces";

export function Component(config: {
  selector: string;
  template?: string;
  templateUrl?: string;
  styles?: string;
  stylesUrl?: string;
  encapsulation?: ViewEncapsulation;
  changeDetection?: ChangeDetectionStrategy;
}) {
  return function (target: any) {
    target.selector = config.selector;
    target.template = config.template;
    target.templateUrl = config.templateUrl;
    target.styles = config.styles;
    target.stylesUrl = config.stylesUrl;
    target.encapsulation = config.encapsulation ?? ViewEncapsulation.Emulated;
    target.changeDetection =
      config.changeDetection ?? ChangeDetectionStrategy.Default;
  };
}
