///<reference path="../node_modules/@types/ckeditor/index.d.ts"/>

declare namespace CKEDITOR{
    export interface editor extends CKEDITOR.event{
        _ : {
            editable : CKEDITOR.dom.element
        }
    }
}