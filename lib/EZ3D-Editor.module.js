
function EZ3D( options = {}) {

    this.addFonts();
    this.name = 'EZ3D Library';
    this.loader = null;
    this.modules = null;
    this.element = options.element;
    this.editorName = options.editorName;
    this.content = null;
    this.options = options;
    this.savedRange = null;
    this.threeSceneNum = 0;
    this.imgFileNum = 0;
    this.zipFileNum = 0;
    this.filesNum = 0;
    this.sceneModelSum = 0;
    this.uploadFiles = [];
    this.uploadModels = [];
    this.zipUploadFiles = [];
    this.imgUploadFiles = [];
    this.scenes = [];
    this.threeDScenes = [];
    this.editThreeScenes;
    this.lastScene = null;
    this.dt= new DataTransfer();

    if( this.options.gui ) {
        this.height = ( this.options.gui.height ) ? this.options.gui.height : null;
    }
    
    if( this.options.plugins && this.options.plugins.length > 0 ) {
        let ez3d = this;
        this.options.plugins.map( plugin => {
            for( let key in plugin ) {
                if( key === 'threeModules' ) ez3d.modules = plugin[key] 
            }
        })
    }
    
    // these.actions values = same as toolbox button
    this.actions = options.actions
        ? (
            options.actions.map( action => {
                
                if( typeof action === 'string' ) {
                    return this.defaultActions()[action]; 
                }
                else if( this.defaultActions()[ action.name ]) return { ...this.defaultActions()[ action.name ], ...action }
                return action;

            })
        )
        : Object.keys( this.defaultActions() ).map( action => this.defaultActions()[ action ] );
    
    this.classes = { ...this.defaultClasses( this.editorName ), ...this.options.classes };
    this.formatBlock = 'formatBlock';
    this.defaultParagraphSeparatorString = 'defaultParagraphSeparator';
    
    this.init();
    this.initDropdownMenu();
    
}


/* ------------------------- */
/*       Buttons Funcs       */
/* ------------------------- */
EZ3D.prototype.dropdownActions = function () {
    return {
        fontColor: {
            icon: '<i class="fas fa-highlighter"></i>',
            result: () => this.createColorInput( 'color', 'foreColor', 'Menu-dropdown' ),
            title: 'Font Color'
        },
        fontType: {
            icon: `
                <label for="fontfamily">font family:</label>
                <select id="ez3d-fontfamily">
                <option data-type="placeholder" selected> </option>
                    <option value='"Noto Sans KR", sans-serif'>Nano</option>
                    <option value='"Roboto", sans-serif'>Roboto</option>
                    <option value='"Poetsen One"'>Poetsen</option>
                    <option value='"Ubuntu Sans", sans-serif'>Ubuntu</option>
                    <option value='"Open Sans", sans-serif'>Open Sans</option>
                    <option value='"Sedan SC", serif'>Sedan SC</option>
                    <option value='"Lato", sans-serif'>Lato</option>
                    <option value='"Nanum Myeongjo", serif'>Nanum Myeongjo</option>
                    <option value='"Noto Serif KR", serif'>Noto</option>
                    <option value='"Black Han Sans", sans-serif'>Black Han Sans</option>
                    <option value='"Lora", serif'>Lora</option>
                    <option value='"Nanum Gothic", sans-serif'>Nanum Gothic</option>
                </select>
            `,
            result: () => {
                this.initFontTypeListener()
            },
            title: 'Font Color'
        },
        fontSize: {
            icon: `
                <label for="fontsize">size:</label>
                <select id="ez3d-fontsize">
                    <option data-type="placeholder" selected> </option>
                    <option value="12px">Small</option>
                    <option value="16px">Medium</option>
                    <option value="20px">Large</option>
                    <option value="24px">Extra Large</option>
                </select>
            `,
            result: () => {
                this.initFontSizeListener()
            },
            title: 'Font Color'
        },
        highlight: {
            icon: '<i class="fas fa-fill-drip"></i>',
            result: () => this.createColorInput( 'color', 'backColor', 'Menu-dropdown' ),
            title: 'Highlight Text'
        },
        removeHighlight: {
            icon: '<i class="fas fa-eraser"></i>',
            result: () => { 
                this.exec('backColor', 'transparent')
                this.closeDropDown( 'Menu-dropdown' );
            },
            title: 'Remove Highlight'
        },
        leftAlign: {
            icon: '<i class="fas fa-align-left"></i>',
            result: () => { 
                this.exec( 'justifyLeft' ); 
                this.closeDropDown( 'Menu-dropdown' );
            },
            title: 'LeftAlign'
        },
        rightAlign: {
            icon: '<i class="fas fa-align-right"></i>',
            result: () => {
                this.exec( 'justifyRight' );
                this.closeDropDown( 'Menu-dropdown' );
            },
            title: 'RightAlign'
        },
        centerAlign: {
            icon: '<i class="fas fa-align-center"></i>',
            result: () => {
                this.exec( 'justifyCenter' )
                this.closeDropDown( 'Menu-dropdown' );
            },
            title: 'CenterAlign'
        },
        image: {
            icon: '<i class="fas fa-file-image"></i>',
            result: () => {
                this.createIMGFileBox( 'image/*' );
                this.closeDropDown( 'Menu-dropdown' );
            },
            title: 'Image',
        },
        files: {
            icon: '<i class="fas fa-file-archive"></i>',
            result: () => {
                this.createZipFile();
                this.closeDropDown( 'Menu-dropdown' );
            },
            title: 'files',
        },
        // video: {
        //     icon: '<i class="fas fa-file-video"></i>',
        //     result: () => this.createModal( 'video' ),
        //     title: 'Video'
        // },
        load3DModel: {
            icon: '<i class="fas fa-cube"></i>',
            result: () => this.threeDFileLoader(),
            title: 'Load 3D Model'
        },
    }
};

EZ3D.prototype.defaultActions = function () {
    return {
        italic: {
            icon: '<i>I</i>',
            result: () => this.exec('italic'),
            state: () => this.queryCommandState('italic'),
            title: 'Italic',
        },
        bold: {
            icon: '<b>B</b>',
            result: () => this.exec('bold'),
            state: () => this.queryCommandState('bold'),
            title: 'Bold'
        },
        underline: {
            icon: '<u>U</u>',
            result: () => this.exec('underline'),
            state: () => this.queryCommandState('underline'),
            title: 'Underline',
        },
        strikethrough: {
            icon: '<strike>S</strike>',
            result: () => this.exec('strikeThrough'),
            state: () => this.queryCommandState('strikeThrough'),
            title: 'Strike-through',
        },
        fontMenu: {
            icon: '<i class="fas fa-text-height"></i>',
            result: () => {},
            init: ( button ) => {
                this.initMenu( 
                    button,
                    this.editorName,
                    [ 
                        this.dropdownActions().fontType, 
                        this.dropdownActions().fontSize, 
                    ], 
                    'FontMenu-dropdown' 
                )
            },
            title: 'FontDropDown',
        },
        textColorMenu: {
            icon: '<i class="fas fa-font"></i>',
            result: () => {},
            init: ( button ) => {
                this.initMenu( 
                    button, 
                    this.editorName, 
                    [ 
                        this.dropdownActions().fontColor, 
                        this.dropdownActions().highlight, 
                        this.dropdownActions().removeHighlight
                    ], 
                    'TextMenu-dropdown' 
                )
            },
            title: 'TextColorDropDown',
        },
        alignMenu: {
            icon: '<i class="fas fa-align-justify"></i>',
            result: () => {},
            init: ( button ) => {
                this.initMenu( 
                    button, 
                    this.editorName, 
                    [
                        this.dropdownActions().leftAlign, 
                        this.dropdownActions().rightAlign, 
                        this.dropdownActions().centerAlign
                    ], 
                    'AlignMenu-dropdown' 
                )
            },
            title: 'TextAlignDropDown'
        },
        line: {
            icon: '&#8213;',
            result: () => this.exec('insertHorizontalRule'),
            divider: true,
            title: 'Horizontal Line',
        },
        olist: {
            icon: '&#35;',
            result: () => this.exec('insertOrderedList'),
            title: 'Ordered List',
        },
        quote: {
            icon: '&#8220; &#8221;',
            result: () => this.exec( this.formatBlock, '<blockquote>'),
            title: 'Quote',
        },
        ulist: {
            icon: '&#8226;',
            result: () => this.exec('insertUnorderedList'),
            title: 'Unordered List',
        },
        filesMenu: {
            icon: '<i class="fas fa-upload"></i>',
            result: () => {},
            init: ( button ) => {
                this.initMenu( 
                    button, 
                    this.editorName, 
                    [
                        this.dropdownActions().image, 
                        this.dropdownActions().files, 
                        // this.dropdownActions().video, 
                        this.dropdownActions().load3DModel
                    ], 
                    'FileMenu-dropdown' 
                )},
            title: 'FilesDropDown'
        },
    }
};

EZ3D.prototype.init = function () {

    const ez3d = this;
    const actionbar = document.createElement('div');
    actionbar.className = this.classes.actionbar;
    this.element.appendChild( actionbar );
    actionbar.style.height = ( this.height ) ? `${ this.height }px` : '720px';

    const content = document.createElement('div');
    content.contentEditable = true;
    content.className = this.classes.content;
    content.style.height = ( this.height ) ? `${ this.height }px` : '720px';

    const defaultParagraphSeparator = this.options[this.defaultParagraphSeparatorString] || 'div';

    content.oninput = ({ target: { firstChild } }) => {

        if ( firstChild && firstChild.nodeType === 3 ) this.exec( 'formatBlock', `<${defaultParagraphSeparator}>`)
        else if ( content.innerHTML === '<br>' ) content.innerHTML = ''
        
        if ( this.options.onChange ) { 
            
            ( this.uploadModels ) 
            ? this.options.onChange( content.innerHTML, this.uploadModels )
            : this.options.onChange( content.innerHTML );
        
        }
    }

    /*---------------- */
    /*      Event      */
    /*-----------------*/
    content.onkeydown = event => {
        if ( event.key === 'Enter' && this.queryCommandValue( 'formatBlock' ) === 'blockquote' ) {
            setTimeout(() => this.exec( 'formatBlock', `<${defaultParagraphSeparator}>`), 0)
        }
    }

    content.addEventListener('keyup', () => { ez3d.saveSelection(); });
    content.addEventListener('mouseup', () => { ez3d.saveSelection() });
    content.addEventListener('focus', () => { ez3d.saveSelection() });

    this.element.appendChild( content );
    this.content = content;

    // 3D Scene Remove Event
    const observerCallback = ( mutationsList ) => {
        for( let mutation of mutationsList ) {
            if( mutation.type === 'childList' ) {
                mutation.removedNodes.forEach( node => {
                    
                    if( node.nodeType === 1 && ( node.nodeName === 'DIV' || node.nodeName === 'P' )) {
                        
                        let chkThreeScn = ( ( node.className === 'ez3d-three-scene' ) )
                            ? node 
                            : node.querySelector(`.ez3d-three-scene`);

                        if( chkThreeScn ) {
                            let removeScene = confirm('Do you remove 3D Scene?')
                            if( removeScene ) {
                                this.remove3DModelAtLine( chkThreeScn.id );
                            } else {
                                return;
                            }
                        }
                    }
                    
                    
                })
            }
        }
    }

    const observerOptions = { childList: true, subtree: true };
    const editorObserver = new MutationObserver( observerCallback );
    editorObserver.observe( content, observerOptions );

    this.actions.forEach( actionKey => {
        
        const button = document.createElement('button');
        button.className = ez3d.classes.button;
        button.innerHTML = actionKey.icon;
        button.setAttribute('type', 'button');
        button.title = actionKey.title;
        button.addEventListener('click', e => {
            
            actionKey.result();
            content.focus();
        })

        if( actionKey.state ) {
            const handler = () => button.classList[actionKey.state() ? 'add' : 'remove'](ez3d.classes.selected);
            content.addEventListener( 'keyup', handler );
            content.addEventListener( 'mouseup', handler );
            button.addEventListener( 'click', handler );
        }

        actionbar.appendChild(button);
    });

    this.actions.forEach(( actionKey ) => {
        
        if( actionKey.init ) {
            const button = document.querySelector(`button[title="${ actionKey.title }"]`);
            if (button) actionKey.init(button);
        }
    });
};

EZ3D.prototype.saveSelection = function() {
    const selection = document.getSelection();
    if (selection.rangeCount > 0) {
        this.savedRange = selection.getRangeAt(0);
    }
}

EZ3D.prototype.defaultClasses = function ( editorName ) {
    return {
        actionbar: 'ez3d-actionbar',
        button: 'ez3d-button',
        content: editorName,
        selected: 'ez3d-button-selected',
    };
};

EZ3D.prototype.exec = function( command, value = null ) {
    document.execCommand( command, false, value );
}

EZ3D.prototype.queryCommandState = function( command ) {
    return document.queryCommandState( command );
}

EZ3D.prototype.queryCommandValue = function( command ) {
    return document.queryCommandValue( command );
}

EZ3D.prototype.closeDropDown = function( elName ) {
    const dropdowns = document.querySelectorAll(`.${ elName }`);
    dropdowns.forEach( dropdown => {
        dropdown.style.display = 'none'; // Hode All Dropdown menus
    });
}

EZ3D.prototype.createColorInput = function( type, execName, closeNodeName ) {
    const input = document.createElement('input');
    const ez3d = this;
    input.type = type;
    input.oninput = (e) => {
        ez3d.exec( execName, e.target.value );
        input.remove();
    };
    input.click();
    this.closeDropDown( closeNodeName );
}

/* -------------------------- */
/*       DropDown Funcs       */
/* -------------------------- */
EZ3D.prototype.initDropdownMenu = function () {
    let dropdownWrap = document.querySelectorAll('.dropdown');
    let dropdownNodesID = [ 'TextMenu-dropdown', 'AlignMenu-dropdown', 'FileMenu-dropdown', 'FontMenu-dropdown' ]

    dropdownWrap.forEach( dropEl => {

        let editor = document.querySelector('#editor');
        
        dropEl.addEventListener('click', async e => {
    
            let dropdownWrapper = e.target.parentNode;
            let dropMenuEl = ( dropdownWrapper.nodeName === 'BUTTON') ? dropdownWrapper.parentNode : dropdownWrapper; 
            let dropID = await this.chkDropID( dropMenuEl );
            
            dropdownNodesID.forEach( id => {
            
                let node = document.querySelector(`#${id}`);
                if( node ) {
                    if( id !== dropID ) node.style.display = 'none';
                }

            });

            
            let selectNode = document.querySelector(`#${dropID}`);
            
            if( selectNode.style.display === 'flex' ) {
                selectNode.style.display = 'none';
            } else {
                selectNode.style.display = 'flex';
            }

            e.stopPropagation(); // to Prevent Event Bubbling

        })

    });

    document.addEventListener('click', (e) => {
        
        const editor = document.querySelector(`.${this.editorName}`);
        let target = e.target;
        
        if( target.id !== 'ez3d-fontsize' && target.id !== 'ez3d-fontfamily' ) {
            dropdownNodesID.map( id => {
                
                let node = document.querySelector(`#${id}`);
                if( node ) {
                    if( node.style.display === 'flex' ) node.style.display = 'none';
                }
                
            })
        }

    });
};

EZ3D.prototype.initMenu = function( button, editor, execArray, name ) {
    let content = document.querySelector(`.${ editor }`);
    let dropdownContainer = this.createDropDownMenu( button, execArray, content, name );
    button.parentNode.replaceChild( dropdownContainer, button );
}

EZ3D.prototype.createDropDownMenu = function( button, itemsArray, content, id ) {
    const ez3d = this;
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown';

    const newButton = button.cloneNode(true);
    const dropdown = document.createElement('div');
    dropdown.id = id;
    dropdown.className = 'Menu-dropdown';

    
    Array.from( itemsArray ).forEach( action => {
        
        const button = document.createElement('button');
        button.className = 'ez3d-button';
        button.innerHTML = action.icon;
        button.title = action.title;
        button.setAttribute('type', 'button');
        button.onclick = () => action.result() && content.focus()
    
        dropdown.appendChild( button );

    });

    dropdownContainer.appendChild( newButton );
    dropdownContainer.appendChild( dropdown );

    return dropdownContainer
}


/* -------------------- */
/******* 3D Funcs *******/
/* -------------------- */
function createFileGroup() {
    const newFileGroup = document.createElement('div');
    newFileGroup.className = 'three-file-file-group';

    const newModelUpload = document.createElement('div');
    newModelUpload.className = 'three-file-file-upload';
    const newModelLabel = document.createElement('label');
    newModelLabel.textContent = '3D Models(fbx,gltf,obj):';
    const newModelInput = document.createElement('input');
    newModelInput.type = 'file';
    newModelInput.name = 'modelFile';
    newModelInput.multiple = true;
    newModelInput.accept = '.obj,.fbx,.gltf,.glb,.bin';
    newModelUpload.appendChild(newModelLabel);
    newModelUpload.appendChild(newModelInput);

    const newTextureUpload = document.createElement('div');
    newTextureUpload.className = 'three-file-file-upload';
    const newTextureLabel = document.createElement('label');
    newTextureLabel.textContent = 'Texture files:';
    const newTextureInput = document.createElement('input');
    newTextureInput.type = 'file';
    newTextureInput.name = 'textureFile';
    newTextureInput.accept = '.jpg,.png,.tif,.targa';
    newTextureInput.multiple = true;
    newTextureUpload.appendChild(newTextureLabel);
    newTextureUpload.appendChild(newTextureInput);

    newFileGroup.appendChild(newModelUpload);
    newFileGroup.appendChild(newTextureUpload);

    return newFileGroup;
}

EZ3D.prototype.resetDT = function() {
    console.log('reset DT');
    this.sceneModelSum = 0;
    this.dt = null;
    this.dt = new DataTransfer();
}

EZ3D.prototype.getDT = function() {
    console.log('get DT');
    if( this.dt ) return this.dt;
    else return new DataTransfer();
}

EZ3D.prototype.removeModal = function() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.remove();
    }
}

// Hanguel, cheching RegExt
EZ3D.prototype.containsKoreanOrSpecialChars = function ( fileName ) {
    
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    const specialCharRegex = /[~`!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]/;
    
    return koreanRegex.test(fileName) || specialCharRegex.test(fileName);
}

// fileName > convert time zone
EZ3D.prototype.getFormattedDate = function () {

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`

}

EZ3D.prototype.threeDFileLoader = function() {
    
    let dt = this.getDT();
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'three-file-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'three-file-modal-content';

    const closeButton = document.createElement('span');
    closeButton.className = 'three-file-close-button';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        this.removeModal();
    });

    const fileGroup = createFileGroup();
    const addFileGroupButton = document.createElement('button');
    addFileGroupButton.type = 'button';
    addFileGroupButton.id = 'addFileGroup';
    addFileGroupButton.textContent = 'Add File Group';
    addFileGroupButton.addEventListener('click', () => {
        const newFileGroup = createFileGroup();
        modalContent.insertBefore(newFileGroup, addFileGroupButton);
    });

    // Create Upload button
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'UPLOAD';
    submitButton.addEventListener('click', () => {

        let fileMappings = [];
        const fileGroups = document.querySelectorAll('.three-file-file-group');
        // const testFiles = document.querySelector('input[name="testFiles"]').files;
    
        fileGroups.forEach((group, index) => {

            const modelFile = group.querySelector('input[name="modelFile"]').files;
            const textureFile = group.querySelector('input[name="textureFile"]').files;
        
            if ( modelFile ) {
                
                let texturesArray;
                let modelsArray = Array.from( modelFile );

                if( textureFile.length > 0 ) texturesArray = Array.from( textureFile );
                fileMappings.push({
                    model: modelsArray,
                    texture: texturesArray
                });
            }
        });

        

        if( fileMappings.length > 0 ) {

            let copy_filesMapping = fileMappings;

            fileMappings.forEach( mapping => {
                if( mapping.model ) mapping.model.forEach( model => dt.items.add( model ) );
                if( mapping.texture ) mapping.texture.forEach( texture => dt.items.add( texture ) )
            });

            try {
                let filesMap = null;
                let modules = new this.modules({
                    editor: this.element
                });
                
                modules.loadFiles( dt.files, filesMap, ( res ) => {
                    
                    const currentRange = this.saveCurrentRange();
                    if( currentRange ) {
                        this.insert3DModelAtLine( 
                            modules, 
                            res, 
                            currentRange, 
                            fileMappings 
                        );
                    } else {
                        
                        this.insert3DModelAtLine( 
                            modules, 
                            res, 
                            null,
                            fileMappings
                        );
                    }
                    
                });
            
                // this.sceneModelSum = 0;
    
            } catch ( err ) {
                console.error('File Loading Error:', err);
            }
        
        }
        this.resetDT();
        // fileMappings = [];
        this.removeModal();
        modal.style.display = 'none';

    });

    // Add Modal
    modalContent.appendChild( closeButton );
    modalContent.appendChild( fileGroup );
    modalContent.appendChild( addFileGroupButton );
    modalContent.appendChild( submitButton );

    modal.appendChild( modalContent );
    this.element.appendChild( modal );

    // fileInput.click();
    this.closeDropDown( 'Menu-dropdown' );

}

EZ3D.prototype.saveCurrentRange = function() {
    if (window.getSelection().rangeCount > 0) {
        return window.getSelection().getRangeAt(0);
    }
    return null;
}

EZ3D.prototype.getModels = function() {
    return new Promise( resolve => {
        resolve( this.uploadModels )
    })
}

EZ3D.prototype.getEditThreeScenes = function() {
    return new Promise( resolve => {
        resolve( this.editThreeScenes )
    })
}

EZ3D.prototype.getThreeDScenes = function() {
    return new Promise( resolve => {
        resolve( this.threeDScenes )
    })
}

EZ3D.prototype.getFiles = function() {
    if( this.uploadFiles ) {
        return new Promise( resolve => {
            resolve( this.uploadFiles )
        })
    }
}

EZ3D.prototype.setEditThreeScenes = function( files ) {
    this.editThreeScenes = files;
    this.threeDScenes = files;
}

EZ3D.prototype.getIMGFiles = function() {
    return new Promise( resolve => {
        resolve( this.imgUploadFiles )
    })        
}

EZ3D.prototype.getZipFiles = function() {
    return new Promise( resolve => {
        resolve( this.zipUploadFiles )
    })        
}

EZ3D.prototype.encodeFileName = function ( fileName ) {
    return encodeURIComponent( fileName );
}

EZ3D.prototype.decodeFileName = function ( encodedFileName ) {
    return decodeURIComponent( encodedFileName );
}

EZ3D.prototype.setUploadFiles = function( threeDFiles, imgFiles, zipFiles ) {
    this.uploadFiles = threeDFiles;
}

EZ3D.prototype.insert3DModelAtLine = function( modules, res, range, files, sceneInfo ) {
    
    let editMode = ( sceneInfo ) ? true : false;
    this.sceneModelSum++;
    if ( this.sceneModelSum === 1 ) this.threeSceneNum++
    let sameScene = ( this.sceneModelSum !== 1 ) ? true : false;
    let fileTypeDescription = '3D';
    const editor = this.element;
    const selection = window.getSelection();
    
    let fileName = ( !res ) 
        ? (files.models[0].name)
            ? files.models[0].name
            : 'undefined.fbx'
        : res.name;
    let fileParts = fileName.split('.');
    let ext = fileParts.pop();
    let pureFileName = fileParts.join('.');
    const chkFileName = this.containsKoreanOrSpecialChars( pureFileName );
    const date = this.getFormattedDate();

    // Create a new div element and set it to include a 3D scene.
    let sceneContainer = ( editMode ) 
        ? sceneInfo[0].querySelector(`.${ sceneInfo[1] }`)
        : document.createElement('p');

    if( !editMode ) {
        sceneContainer.id = ( chkFileName )
        ? `ez3d_three_scene_${this.threeSceneNum}_${date}`
        : `ez3d_three_scene_${this.threeSceneNum}_${date}_${pureFileName}`;

        sceneContainer.title = sceneContainer.id;
        sceneContainer.className = (`ez3d-three-scene`);
        if( !sameScene ) this.threeDScenes.push( sceneContainer.id );
    
    }
    
    this.lastScene = ( sameScene ) ? this.lastScene : sceneContainer.id;

    let uploadFile = {
        'className': sceneContainer.className,
        'id': sceneContainer.id,
        'sceneSerial': this.lastScene,
        'sceneName': (sameScene) ? null : sceneContainer.id,
        'type': fileTypeDescription,
        'data': files,
        'three': ext
    }

    this.uploadFiles.push( uploadFile );
    
    this.uploadModels.push({
        [ sceneContainer.id ]: res,
        'sceneSerial': this.lastScene
    });

    let container;
    if ( this.sceneModelSum === 1) {
        container = modules.init( sceneContainer, res )
    } else {
        modules.addObject( res );
    }

    if ( !this.savedRange && container ) {
        
        insertEmptySelection( selection, this.editorName, container );
        
    } else if( container && this.savedRange ){
        
        const startContainer = this.savedRange.startContainer;
        const commonAncestorContainer = this.savedRange.commonAncestorContainer;
        const startContainerClassName = (startContainer.className) ? startContainer.className : null;
    
        if( startContainer.nodeType === 3 || startContainerClassName ) {

            insertEmptySelection( selection, this.editorName, container )
            
        } else {

            let br = document.createElement('br');
            let div = document.createElement('div');
            div.appendChild( br );

            let parentNode = commonAncestorContainer.parentNode;
            if ( parentNode.nodeType !== Node.ELEMENT_NODE ) parentNode = parentNode.parentNode;

            this.savedRange.deleteContents();
            this.savedRange.insertNode( container );
            this.savedRange.collapse( false );
            this.savedRange.insertNode( div );
            
            ( this.savedRange.endContainer.nextSibling )
                ? parentNode.insertBefore( div, this.savedRange.endContainer.nextSibling )
                : parentNode.appendChild( div );
            
        }
        
    }

    function insertEmptySelection( selection_, editorName, container_ ) {

        const editorContent = document.querySelector(`.${ editorName }`);
        const range = document.createRange();
        let beforeDiv = document.createElement('div');
        beforeDiv.textContent = "\u00A0";
        let afterDiv = document.createElement('div');
        afterDiv.textContent = "\u00A0";
        
        range.selectNodeContents( container_ );
        range.collapse( true );
        selection_.removeAllRanges();
        selection_.addRange( range );
        editorContent.appendChild( container_ );
        editorContent.insertBefore( beforeDiv, container_ );
        editorContent.appendChild( afterDiv );

    }

}

EZ3D.prototype.remove3DModelAtLine = function(sceneId) {

    this.threeDScenes = this.threeDScenes.filter( file => file != sceneId );
    this.uploadFiles = this.uploadFiles.filter( file => file.sceneSerial !== sceneId );
    this.uploadModels = this.uploadModels.filter( model => {
        const sceneSerial = Object.values( model )[1];
        return sceneSerial !== sceneId
    });

};

/* --------------------------- */
/******* Img Upload Func *******/
/* --------------------------- */
EZ3D.prototype.createIMGFileBox = function( accept ) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = accept //'image/*';
    fileInput.onchange = (e) => {

        const file = e.target.files[0];
        const fileType = file.type;
        let fileTypeDescription = '';
        const fileName = file.name;
        const fileParts = fileName.split('.');
        const encodedFileName = this.encodeFileName( fileName );
        const fileExtension = fileParts.pop(); 
        const pureFileName = fileParts.join('.'); 
        const chkFileName = this.containsKoreanOrSpecialChars( pureFileName );
        const date = this.getFormattedDate();

        // Check File type
        if (fileType.startsWith('image/')) {
            fileTypeDescription = 'Image';
        }
        else {
            alert('not image file, allow to image file!')
            return
        }
    
        if (file) {

            this.imgFileNum++;
            const reader = new FileReader();
            reader.onload = (e) => {
                
                const container = document.createElement('div');
                container.contentEditable = false;
                container.setAttribute('data-filename', encodedFileName );
                container.className = `ez3d_img_wrapper`;
                container.style.display = 'inline-block'; 
                container.style.margin = '5px';

                const imgWrapper = document.createElement('span');
                imgWrapper.className = ( chkFileName ) 
                    ? `ez3d_image${this.imgFileNum}_${date}`
                    : `ez3d_image${this.imgFileNum}_${pureFileName}`;

                const img = document.createElement('img');
                img.src = e.target.result;
                
                imgWrapper.appendChild( img );
                container.appendChild( imgWrapper );

                let uploadFile = {
                    'className': imgWrapper.className,
                    'type': fileTypeDescription,
                    'data' : file,
                }
                this.imgUploadFiles.push( uploadFile );
                
                console.log('savedRange: ', this.savedRange );

                if( this.savedRange ) {
                    console.log('saveRange: ', this.savedRange );
                    this.savedRange.deleteContents();
                    this.savedRange.insertNode( container );
                    this.savedRange.collapse(false); 
                    
                } else {
                    console.log('saveRange 없음')
                    const editor = document.querySelector(`.${ this.editorName }`);
                    editor.insertBefore( container, editor.firstChild );
                }

                // Move the cursor to the end of the imgWrapper
                const range = document.createRange();
                range.setStartAfter(imgWrapper);
                range.collapse(true);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

            };

            reader.readAsDataURL(file);

        }

        fileInput.remove(); // 파일 입력 요소 제거

    };

    fileInput.click(); // 파일 선택기 열기
    return fileInput
}

/* --------------------------- */
/*       Zip Upload Func       */
/* --------------------------- */
EZ3D.prototype.createZipFile = function() {
    
    const ez3d = this;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.zip'; // Allow ZIP files only

    fileInput.onchange = (e) => {
        
        const file = e.target.files[0];
        const fileType = file.type;
        let fileTypeDescription = '';
        const fileName = file.name;
        const encodedFileName = this.encodeFileName( fileName );

        const fileParts = fileName.split('.');
        const fileExtension = fileParts.pop(); // 확장자를 추출합니다.
        const pureFileName = fileParts.join('.'); // 확장자를 제외한 순수 파일명을 얻습니다.
        const chkFileName = this.containsKoreanOrSpecialChars( fileName );
        fileTypeDescription = 'zip';
        const date = this.getFormattedDate();
    
        if (file) {
            console.log('encodedFileName: ', encodedFileName );
            this.zipFileNum++;
            const container = document.createElement('div');
            container.contentEditable = false;
            container.setAttribute('data-filename', encodedFileName );
            container.className = ( chkFileName ) 
                ? `ez3d_zipFile${this.zipFileNum}_${ date }`
                : `ez3d_zipFile${this.zipFileNum}_${ pureFileName }`;
            container.style.display = 'inline-block'; 
            container.style.margin = '5px';

            const fileNameSpan = document.createElement('span');
            fileNameSpan.textContent = file.name + " ";
            container.appendChild( fileNameSpan );

            const removeButton = document.createElement('button');
            removeButton.textContent = 'x';
            removeButton.style.marginLeft = '5px';
            removeButton.onclick = () => {
                container.remove();
            };
            container.appendChild(removeButton);

            let uploadFile = {
                'originalName': fileName,
                'className': container.className,
                'type': fileTypeDescription,
                'data': file,
                'ext': fileExtension
            }
            this.zipUploadFiles.push( uploadFile );

            if( this.savedRange ) {
                
                this.savedRange.deleteContents();
                this.savedRange.insertNode( container );
                
            } else {
                const editor = document.querySelector(`.${ this.editorName }`);
                editor.insertBefore( container, editor.firstChild );
            }
            // Remove the file entry element from the document.
            fileInput.remove();
        }

    };

    fileInput.click();
    return fileInput
}

/* ----------------------------- */
/******* Video Upload Func *******/
/* ----------------------------- */
EZ3D.prototype.createModal = function( type ) {

    let currentRange;
    if (window.getSelection().rangeCount > 0) {
        currentRange = window.getSelection().getRangeAt(0);
    }

    this.closeDropDown( 'Menu-dropdown' )
    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal');
    modal.id = 'videoModal';

    const modalContent = document.createElement('div');
    modalContent.setAttribute('class', 'modal-content');
    modal.appendChild(modalContent);

    // Close Function
    const closeButton = document.createElement('span');
    closeButton.setAttribute('class', 'modalClose');
    closeButton.id = 'videoModalClose';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', e => {
    
        this.closeModal(modal)
        if( currentRange ) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(currentRange);
        }
    })
    
    modalContent.appendChild(closeButton);

    if( type === 'video' ) {
        let form = this.videoForm( modalContent, modal, currentRange );
        modal.appendChild(form);
    }

    document.body.appendChild( modal );
    modal.style.display = "block";

    // Prevent event capture and bubbling
    modal.addEventListener('mousedown', function(e) {
        e.stopPropagation();
    }, true);

    return modal;
}

EZ3D.prototype.videoForm = function( modalContent, modal, range ) {
    
    const header = document.createElement('h2');
    header.textContent = 'Add Video';

    const inputURL = document.createElement('input');
    inputURL.type = 'text';
    inputURL.id = 'videoUrlInput';
    inputURL.placeholder = 'Enter video URL';

    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.id = 'videoFileInput';
    inputFile.accept = 'video/*';

    const insertButton = document.createElement('button');
    insertButton.textContent = 'Insert Video';
    insertButton.addEventListener('click', e => this.insertVideoFromModal( modal, range ))

    // Adding elements to modal content
    modalContent.appendChild( header );
    modalContent.appendChild( inputURL );
    modalContent.appendChild( inputFile );
    modalContent.appendChild( insertButton) ;

    return modalContent
}

EZ3D.prototype.closeModal = function( modal ) {
    modal.style.display = "none";
    modal.remove();
}

EZ3D.prototype.insertVideoFromModal = function( modal, range ) {

    const ez3d = this;
    const url = document.getElementById('videoUrlInput').value;
    const fileInput = document.getElementById('videoFileInput');
    const file = fileInput.files[0];

    if (url) {
        // Creating iframe with URL
        ez3d.insertVideoIframe( url, range );
    } else if (file && file.size <= 30 * 1024 * 1024) { // File Size: Limit to 30 MB
        // Creating video Tag with file
        ez3d.insertVideoFile( file );
    } else if (file) {
        alert('File is too large. Maximum size is 30MB.');
    }

    this.closeModal( modal );
}

EZ3D.prototype.convertToEmbedUrl = function(url) {

    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
    return embedUrl;

}

EZ3D.prototype.insertVideoIframe = function( url, range ) {
    
    let embedUrl = this.convertToEmbedUrl( url );
    const editorContent = document.querySelector(`.${ this.editorName }`);
    let tmpTextNode = document.createTextNode('');
    const wrapper = document.createElement('span');
    wrapper.innerHTML = " ";
    wrapper.appendChild( tmpTextNode );

    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.style.width = "560px";
    iframe.style.height = "315px";
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    
    wrapper.appendChild( iframe );
    wrapper.style.whiteSpace = 'pre';

    if( !range ) {
        editorContent.insertBefore( wrapper, editorContent.firstChild );
    } else {
        
        range.deleteContents();
        range.insertNode(wrapper);
    }

    // return iframe;
}

EZ3D.prototype.insertVideoFile = function( file ) {
    
    const editorContent = document.querySelector(`.${ this.editorName }`);

    let tmpTextNode = document.createTextNode('');
    const wrapper = document.createElement('span');
    wrapper.innerHTML = " ";
    wrapper.appendChild( tmpTextNode );

    const video = document.createElement('video');
    video.controls = true;

    const source = document.createElement('source');
    source.src = URL.createObjectURL(file);
    source.type = file.type;
    video.appendChild(source);

    const afterSpace = document.createElement('p');
    afterSpace.contentEditable = true;
    afterSpace.innerHTML = "<br>";  // Text entry space under video

    wrapper.appendChild( video );
    wrapper.style.whiteSpace = 'pre';
    const selection = document.getSelection();
    let range;

    if ( selection.rangeCount > 0 ) {
        range = selection.getRangeAt(0);
        range.deleteContents(); 
        range.insertNode( wrapper ); 
    } else {    
        editorContent.insertBefore( wrapper, editorContent.firstChild );
    }

    return editorContent;
}

EZ3D.prototype.chkDropID = function( el ) {
    return new Promise( resolve => {
        
        for( let i = 0; i < el.childNodes.length; i++ ) {
            
            if( el.childNodes[i].id !== '') {
                resolve( el.childNodes[i].id );
            } 
        }
        
    })
}

/* ---------------------- */
/******* Font Funcs *******/
/* ---------------------- */

// Setting Google Font
EZ3D.prototype.addFonts = function() {

    // first Link for preconnect
    var link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link1);

    // second Link for preconnect:: CrosOrgin
    var link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);

    // Google Fonts Style
    var link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href = 'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Nanum+Gothic&family=Nanum+Myeongjo&family=Noto+Sans+KR:wght@100..900&family=Noto+Serif+KR&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poetsen+One&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Sedan+SC&family=Ubuntu+Sans:ital,wght@0,100..800;1,100..800&display=swap';
    document.head.appendChild(link3);

}

EZ3D.prototype.initFontTypeListener = function() {

    const select = document.getElementById('ez3d-fontfamily');
    if( !select ) return;

    select.removeEventListener( 'change', this.handleFontTypeChange );

    this.handleFontTypeChange = ( event ) => {
        const fontTypeValue = select.value;
        const selection = window.getSelection();

        if( !selection.rangeCount ) return;
        this.wrapTextWithSpan( selection, "fontFamily", fontTypeValue, 'font-family' );
    }

    select.addEventListener( 'change', this.handleFontTypeChange );

}

EZ3D.prototype.initFontSizeListener = function() {

    const select = document.getElementById('ez3d-fontsize');
    if (!select) return;

    select.removeEventListener('change', this.handleFontSizeChange);
    this.handleFontSizeChange = ( event ) => {

        const sizeValue = select.value;
        const selection = window.getSelection();
        
        if (!selection.rangeCount) return;
        this.wrapTextWithSpan(selection, "fontSize", sizeValue, 'font-size');
    
    };
    
    select.addEventListener('change', this.handleFontSizeChange);

};

EZ3D.prototype.wrapTextWithSpan = function( selection, styleProperty, value, type  ) {

    let range = selection.getRangeAt(0);
    // const selectedNode = range.cloneContents();
    const multiLine = ( selection.toString().split('\n').length > 1 ) ? true : false;
    
    //Single Line
    if( !multiLine ) {
        
        let extractContents = range.extractContents();
        let commonNode = range.commonAncestorContainer;
        let motherNode = this.findParentNode( commonNode, 'DIV' );
        
        ( type === 'font-size' ) 
            ? this.removeChildNode( extractContents, 'span', 'ez3d-font-span' )
            : this.removeChildNode( extractContents, 'span', 'ez3d-fontfamily-span' );
        // this.removeChildNode( extractContents, 'span', 'ez3d-font-span' );

        let newSpan = document.createElement('span');
        newSpan.style[styleProperty] = value;
        
        newSpan.className = ( type === 'font-size' ) ? 'ez3d-font-span' : 'ez3d-fontfamily-span';
        newSpan.appendChild( extractContents );
        newSpan.normalize();

        range.insertNode( newSpan );
        this.removeEmptyNodes( motherNode )

    } 
    
    if( multiLine ) {
        
        let cloneNodes = range.cloneContents();
        let startNode = range.startContainer; 
        let endNode = range.endContainer;
        let startMotherNode = this.findParentNode( startNode, 'DIV' );
        let endMotherNode = this.findParentNode( endNode, 'DIV' );
        let rootNode = startMotherNode.parentNode;

        range.deleteContents();
        let newRange = document.createRange();
        
        // If empty tags exist inside the selected node > Remove
        this.removeEmptyNodes( startMotherNode );
        this.removeEmptyNodes( endMotherNode );
        
        let firstNode = cloneNodes.firstChild;
        let lastNode = cloneNodes.lastChild;

        // If the selected range contains the mgl3d-font-span tag > Remove
        if ( type === 'font-size' ) {
            this.removeChildNode( firstNode, 'span', 'ez3d-font-span' );
            this.removeChildNode( lastNode, 'span', 'ez3d-font-span' );
        }
        else if ( type === 'font-family') {
            this.removeChildNode( firstNode, 'span', 'ez3d-fontfamily-span' );
            this.removeChildNode( lastNode, 'span', 'ez3d-fontfamily-span' );
        }

        // First node of selection
        let firstWrapper = document.createElement('span');
        firstWrapper.className = ( type === 'font-size' ) ? 'ez3d-font-span' : 'ez3d-fontfamily-span';
        firstWrapper.style[styleProperty] = value;

        // Select Intermediate Node Part
        let midWrappers = [];
        
        let tmpMidClone = cloneNodes.cloneNode( true );
        let midNodeLength = tmpMidClone.childNodes.length - 1;
        Array.from( tmpMidClone.childNodes ).forEach( ( midNode, idx ) => {

            if( idx !== 0 && idx !== midNodeLength ) {
                
                this.removeEmptyNodes( midNode );

                ( type === 'font-size' )
                    ? this.removeChildNode( midNode, 'span', 'ez3d-font-span' )
                    : this.removeChildNode( midNode, 'span', 'ez3d-fontfamily-span' )

                let midWrapper = document.createElement('span');
                midWrapper.className = ( type === 'font-size' ) ? 'ez3d-font-span' : 'ez3d-fontfamily-span';
                midWrapper.style[styleProperty] = value;

                let midNodeSpan = this.changeNodeToNode( midNode, midWrapper );
                let tmpDiv = document.createElement('div');
                tmpDiv.appendChild( midNodeSpan );

                midWrappers.push( tmpDiv );

            }

        })

        // Last node of selection
        let lastWrapper = document.createElement('span');
        lastWrapper.className = ( type === 'font-size' ) ? 'ez3d-font-span' : 'ez3d-fontfamily-span';
        lastWrapper.style[styleProperty] = value;

        //Change the wrapper (usually div) shell of the selected node to fontSpan
        let firstNodeSpan = this.changeNodeToNode( firstNode, firstWrapper );
        let lastNodeSpan = this.changeNodeToNode( lastNode, lastWrapper );
        firstNodeSpan.normalize();
        lastNodeSpan.normalize();

        startMotherNode.appendChild( firstNodeSpan );
        endMotherNode.insertBefore( lastNodeSpan, endMotherNode.firstChild );

        midWrappers.map( midNode => {
            midNode.normalize();
            rootNode.insertBefore( midNode, endMotherNode );
        })

        //reset range
        newRange.setStartBefore( firstNodeSpan );
        newRange.setEndAfter( lastNodeSpan );
        selection.removeAllRanges();
        selection.addRange( newRange );
    }

}

EZ3D.prototype.removeEmptyNodes = function( node ) {

    if (!node) return;

    // Naviagate all child nodes
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];

        this.removeEmptyNodes(child);

        // Remove a child if it is an empty text node or an empty element
        if ((child.nodeType === Node.ELEMENT_NODE && child.innerHTML === '') ||
            (child.nodeType === Node.TEXT_NODE && child.textContent.trim() === '')) {
            node.removeChild(child);
            i--; // Adjust the index after the node is removed
        }
    }
}

EZ3D.prototype.changeNodeToNode = function( target, convert ) {
    
    let cloneTarget = target.cloneNode(true);

    while( cloneTarget.firstChild ) {
        convert.appendChild( cloneTarget.firstChild );
    }
    return convert;

}

EZ3D.prototype.findChildIndex = function ( parent, element ) {

    let children = Array.prototype.slice.call(parent.childNodes);
    let index = children.indexOf( element );
    return index;

}

EZ3D.prototype.extractText = function( node ) {
    
    let text = '';
    // If the node is a text node, add text
    if (node.nodeType === Node.TEXT_NODE) {
        text += node.nodeValue;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        // If element nodes, process all child nodes recursively
        node.childNodes.forEach(child => {
            text += this.extractText(child);
        });
    }
    return text;

}

EZ3D.prototype.findParentNode = function( node, tag ) {
    
    while( node !== null && node.tagName !== tag ) {
        node = node.parentNode;
    }

    return node;
}

EZ3D.prototype.removeChildNode = function( node, tag, className ) {
    
    let class_ = ( className ) ? className : null;
    const nodes = node.querySelectorAll( tag );

    nodes.forEach( el => {
        
        if( el.className === class_ ) {
            while (el.firstChild) {
                el.parentNode.insertBefore(el.firstChild, el);
            }
            
            el.parentNode.removeChild(el);
        }
        
    });

    // return node;

}

EZ3D.prototype.removeNullNode = function( node ) {

    Array.from( node.childNodes ).forEach( child => {

        this.removeNullNode( child );

        if( this.isNodeEmpty( child ) ) {
            node.removeChild( child );
        }

    })

}

EZ3D.prototype.isNodeEmpty = function ( node ) {

    if (node.nodeType === Node.ELEMENT_NODE) {
        
        return node.childNodes.length === 0 || this.areAllChildrenEmpty( node );
    
    } else if (node.nodeType === Node.TEXT_NODE) {

        return !node.textContent.trim();

    }

    return false;

}

EZ3D.prototype.areAllChildrenEmpty = function( node ) {

    for (let i = 0; i < node.childNodes.length; i++) {
        if (! this.isNodeEmpty( node.childNodes[i]) ) {
            return false;
        }
    }

    return true;

}

EZ3D.prototype.removeUpToTagName = function( startNode, tagName ) {

    let parent;

    while ( startNode.parentNode && startNode.parentNode.nodeName !== tagName.toUpperCase()) {
        startNode = startNode.parentNode;
    }

    if ( startNode.parentNode && startNode.parentNode.nodeName === tagName.toUpperCase()) {
        
        parent = startNode.parentNode;
        startNode.parentNode.removeChild(startNode);
    }

    return parent;

}

EZ3D.prototype.removeParentNode = function( node, tag ){
    
    while ( node !== null && node.tagName !== tag ) {
        node = node.parentNode;
    }

    if (node && node.tagName === tag ) {
    
        const parent = node.parentNode;
        console.log('parent: ', parent );
        while (node.firstChild) {
            parent.insertBefore(node.firstChild, node);
        }
        
        parent.removeChild(node);
    }

    return node;

}

EZ3D.prototype.collectNode = function( node, tag, arr ) {
    
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === tag) {
        arr.push(node);
    }
    Array.from(node.childNodes).forEach(child => this.collectNode( child, tag, arr ));
    return arr;
    
}

EZ3D.prototype.cleanNode = function( node ) {
    while ( node.firstChild ) {
        node.removeChild( node.firstChild );
    }
}

EZ3D.prototype.processFiles = function ( files ) {

    return files.map( file => {
        
        return new Promise( resolve => {

            if( !file.sceneName ) {
                resolve( null );
            } else {
                resolve({ 'id':file.id, 'className':file.className, 'data': file });
            }

        });
    });

}

EZ3D.prototype.getModule = function () {
    return this.modules;
}

EZ3D.prototype.getElement = function() {
    return this.element;
}

EZ3D.prototype.getDatas = async function() {

    let fileDatas = [];
    let copy_outputCodes = document.querySelector(`.${this.editorName}`).cloneNode(true);
    let outputCodes = copy_outputCodes;

    if (!outputCodes) {
        console.error(`Element with class ${this.editorName} not found`);
        return null;
    }
    
    let files = await this.getFiles();
    let imgFiles = await this.getIMGFiles();
    let zipFiles = await this.getZipFiles();
    let threeDScenes = await this.getThreeDScenes();
    let models = await this.getModels();
    let editedScenes = await this.getEditThreeScenes();

    if ( threeDScenes ) {

        threeDScenes.forEach( scn => {
            console.log('threeDScenes: ', threeDScenes );
            let node = outputCodes.querySelector(`#${scn}`);
            
            if( !node ) {
                console.error(`Node with id ${scn} not found`);
                return;
            }

            this.cleanNode( node );
            this.scenes.push( scn );

        })

    }

    if( imgFiles.length > 0 ) {
        
        imgFiles.forEach( imgFile => {

            let imgWrapper = outputCodes.querySelector(`.${imgFile.className}`);
            if (imgWrapper) {
                let img = imgWrapper.querySelector('img');
                if (img) {
                    img.src = '';
                }
            }
        })
        
    }

    if( files.length > 0 ) {
        console.log('files scene class changed')
        let promises = this.processFiles( files );
        let results = await Promise.allSettled( promises );

        results.forEach( result => {

            if ( result.status === 'fulfilled' && result.value ) {
                console.log( `result: ${ result }`);
                fileDatas.push( result.value.data );
            }

        });
    }
    
    let contentNode = document.createElement('div');
    contentNode.innerHTML = outputCodes.innerHTML;
    outputCodes = contentNode.innerHTML;

    console.log('[2] fileDatas: ', fileDatas );
    console.log('uploading outputCodes: ', outputCodes );

    return {
        'code': outputCodes,
        'files': fileDatas,
        'imgFiles': imgFiles,
        'zipFiles': zipFiles,
        'scenes': threeDScenes,
        // 'scenes': this.scenes,
        'threeDScenes': threeDScenes,
        'models': models,
        'editedScenes': editedScenes
    }
    // console.log(`output Code: ${ outputCodes }, fileDatas: ${ fileDatas }`)
    
}

EZ3D.prototype.getOutputData = async function() {

    let res = await this.getDatas();
    console.log('res: ', res );
    if( !res ) res = null;
    // if( !res ) res = document.querySelector(`.${this.editorName}`);
    
    return res;

}

// Continue to add more prototype methods...

export default EZ3D;
