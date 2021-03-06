///<reference path="types.d.ts"/>

import {IGrammarChecker, IGrammarCheckerConstructor} from "./interfaces/IGrammarChecker";
import {loadScript} from "./utils/load.script";
import {
    CKEditorBGOptions,
    ICKEditorServiceSettings,
    IHighlightOverlayWrapperConstructor
} from "./interfaces/interfaces";

export const DEFAULT_SERVICE_CONFIG : ICKEditorServiceSettings = {
    sourcePath : '//cdn.prowritingaid.com/beyondgrammar/2.0.5252/dist/hayt/bundle.js',
    serviceUrl : '//rtg.prowritingaid.com'
}
export function createBeyondGrammarPlugin( options : CKEditorBGOptions ){
    options = prepareOptions( options );
    
    /**
     * merge options: default with passed over config
     * @param bgOptions options passed to root function
     */
    function prepareOptions( bgOptions : CKEditorBGOptions ) {
        return {
            service : {
                ...DEFAULT_SERVICE_CONFIG,
                ...bgOptions.service
            },
            grammar : {
                ...bgOptions.grammar,
                heavyGrammar : true
            }
        };
    }
    
    let GrammarChecker : IGrammarCheckerConstructor;
    let HighlightOverlayWrapper : IHighlightOverlayWrapperConstructor;
    
    let isSourceLoaded : boolean = false;
    // loading beyond grammar core
    let onLoad = loadScript( options.service.sourcePath ).then(()=>{
        let namespace = window['BeyondGrammar'] as { 
            GrammarChecker : IGrammarCheckerConstructor, 
            HighlightOverlayWrapper : IHighlightOverlayWrapperConstructor 
        };

        if( namespace ) {
            GrammarChecker = namespace.GrammarChecker;
            HighlightOverlayWrapper = namespace.HighlightOverlayWrapper;
        }
        
        return new Promise((res)=>{
            setTimeout(()=>{
                isSourceLoaded = true;
                res();
            }, 1000);    
        });
    });
    
    function initPlugin( editor : CKEDITOR.editor ) {
        //nothing for awhile
    }
    
    function onReadyInstance( editor : CKEDITOR.editor ) {
        //nothing for awhile
    }
    
    
    function onModeChanged( editor : CKEDITOR.editor) {
        tryLinkToEditor(editor);
    }

    let plugin : IGrammarChecker;
    let wrapper : any;
    
    function unlinkPlugin() {
        if( plugin ) {
            try{
                wrapper.clearMarks();
                plugin.deactivate();
            }catch (e) {}
            plugin = null;
        }
    }
    
    function tryLinkToEditor(editor : CKEDITOR.editor) {
        let editable = editor._?.editable?.$;
        if( editable && editor.mode == "wysiwyg" ){
            wrapper = new HighlightOverlayWrapper(editable)
            plugin = new GrammarChecker( 
                editable, options.service, options.grammar, wrapper
            );
            plugin
                .init()
                .then(()=>{
                    plugin.activate();
                });
        }
    }
    
    function patchEditorForAvoidingExtensionLinking( editor : CKEDITOR.editor ){
        if( editor._?.editable?.$ ) {
            editor._.editable.setAttribute("pwa-fake-editor", '');
            editor._.editable.setAttribute("data-gramm", 'false');
        }
    }
    
    let callModeChangedWhenInstanceIsReady : boolean = false;
    return {
        init( editor: CKEDITOR.editor ){
            patchEditorForAvoidingExtensionLinking(editor);
            initPlugin(editor);
            
            editor.once("instanceReady", ()=>{
                patchEditorForAvoidingExtensionLinking(editor);
                if( isSourceLoaded ) {
                    onReadyInstance( editor );
                } else {
                    onLoad.then(()=>{
                        onReadyInstance( editor );
                        if( callModeChangedWhenInstanceIsReady ) {
                            onModeChanged( editor );
                        }
                    });
                }
            });

            editor.on('mode', (evt)=>{
                patchEditorForAvoidingExtensionLinking(editor);
                if( isSourceLoaded ) {
                    onModeChanged( editor );
                } else {
                    callModeChangedWhenInstanceIsReady = true;
                }
            });
            
            editor.on("beforeSetMode", ()=>{
                patchEditorForAvoidingExtensionLinking(editor);
                if( isSourceLoaded ) {
                    unlinkPlugin();
                }
            });
        }
    }
}


