import {IServiceSettings} from "./IServiceSettings";
import {IGrammarCheckerSettings} from "./IGrammarCheckerSettings";
import {WrapperOptions} from "./WrapperOptions";

export interface ICKEditorServiceSettings extends IServiceSettings{
    sourcePath ?: string;
}

export interface CKEditorBGOptions {
    service : ICKEditorServiceSettings;
    grammar : IGrammarCheckerSettings;
}

export interface IHighlightOverlayWrapperConstructor{
    new ( element: HTMLElement, options?: WrapperOptions ): any;
}