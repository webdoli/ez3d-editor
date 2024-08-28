
# <img src="https://github.com/webdoli/mogl3d-editor/assets/55019191/77be0170-8c6a-4660-b73a-1e25d6c55b8e" alt="Logo" width="48" height="48" /> **EZ3D-Editor Ver 1.2.1**

* `Demo Link`: [MOGL3D.com](https://www.mogl3d.com) ( Ctrl+click: Open link in a new window )

<div>EZ3D Editor is a WYSIWYG editor that allows 3D files to be uploaded on the web. </div>


<br>


## 🏷️ Web 3D Wysiwyg Editor 
In version 1.xx, only the 3D file upload feature is provided, and the supported 3D file formats are as follows:</p>

* fbx
* gltf
* obj

<br>
<div align="center">
    <a href="https://www.youtube.com/watch?v=m1Vo-S3Dm0s" target="_blank">
        <img src="https://img.youtube.com/vi/m1Vo-S3Dm0s/0.jpg" alt="Watch the video">
    </a>
</div>

<br>
<br>


## ⚙️ Install
### | CDN

#### 1️⃣ three.js module 

<p>To use 3D functionality in the EZ3D Editor, the three.js module must first be installed, followed by the installation of the threeModule.js from EZ3D.</p>

* #### three.js module

```html
 <script type="importmap">
 {
   "imports":{
      "three":"https://unpkg.com/three@0.159.0/build/three.module.min.js"
   }
 }
</script>
```

<br>
<br>

 

#### 2️⃣ mogl3d editor


  ```html
    <script src="https://unpkg.com/browse/ez3d-editor@1.0.0/lib/EZ3D-Editor.UMD.js"></script>
    <script src="https://unpkg.com/browse/ez3d-editor@1.0.0/lib/EZ3D-Editor.min.js"></script>
  ```

<p>
 To use the 3D file upload feature, the main library must be installed. Insert the JavaScript script tag between the <head> tags in the HTML. 
If there is no need to upload 3D files, the 3D module does not need to be installed. However, if 3D functionality is required, please follow step below to install the 'threeModules.js'.
</p>


* #### threeModule.js

```html
    <script type="module">
        import { ThreeModules } from 'https://unpkg.com/browse/ez3d-editor@1.0.0/plugins/EZ3D-Editor.plugin.three.js';
    </script>
```
<p>
❗Note: The three.module.js module must be included at the top. After installing the three.js module library, the three object must be imported using the importMap method.
 threeModules.js depends on the three.js module.
</p>

<br>
<br>

#### 3️⃣ CSS link
<p>
    The icons in EZ3D Editor use the Font Awesome library. Therefore, please install the Font Awesome CSS library via CDN before installing the EZ3D Editor CSS library.
</p>

* #### install font-awesome.css
```html
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <link rel="stylesheet" href="https://unpkg.com/browse/ez3d-editor@1.0.0/css/EZ3D-Editor.style.css">
    </head>
```
<p>
    ❗Note: install the 'ez3d-style.css' library below the 'font-awesome.css' library.
</p>

<br>
<br>
<br>

## 🖥️ Usage
### | Example
<p>
    The basic usage is as follows:
</p>

```html
<!DOCTYPE html>
<html lang="en">
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/browse/ez3d-editor@1.0.0/css/EZ3D-Editor.style.css">

    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.159.0/build/three.module.min.js"
            }
        }
    </script>
    <script src="https://unpkg.com/browse/ez3d-editor@1.0.0/lib/EZ3D-Editor.UMD.js"></script>

</head>
<body>

    <h1> EZ3D Editor </h1>
    <div id="editor"></div>

    <script type="module">
        
        import { EZ3D_Module_THREE } from 'https://unpkg.com/browse/ez3d-editor@1.0.0/plugins/EZ3D-Editor.plugin.three.js';
        
        const editor = document.getElementById('editor');
        const myEditor = new EZ3D({
            element: editor,
            editorName: 'ez3d-content'  // User customization allowed 
        }); 

    </script>

</body>
</html>
```


<p> 
    ❗Note: 「element」 and 「editorName」 keys within the object are essential required. 
</p>

<br>
<br>


### | Execute
<p>
    If no options are configured, all features will be enabled by default. To use specific features only, options must be set accordingly (further explanation continues below).
</p>
<br>
<div align="center">
    <img src="https://github.com/webdoli/mogl3d-editor/assets/55019191/1b8a8672-7571-4556-a326-e7c6616f5dbe" width="70%;" />
</div>
<div align="center">
    <span>「basic output」</span>
</div>



<br>
<br>
<br>


## 📖 Options
### | actions
<p>
    Specific features can be included in the text editor through the actions object, which is the second parameter of the new MOGL3D() instance.
</p>

```html
    <script>
    const myEditor = new EZ3D( editor, {
            actions:[
                 'italic',
                 'bold',
                 'fontMenu',
            ]
    });
    </script>
```

<br>


<div align="center">
    <img src="https://github.com/webdoli/mogl3d-editor/assets/55019191/face781b-e5d4-4d7d-a75f-31de7789b9b0" width="40%;"/>
</div>
<br>
<p>
    Items specified with the actions list values are as follows:
</p>

- 「 italic 」👉  Make text Italicize
- 「 bold 」👉 Make text Bold
- 「 underline 」👉 Make text underline
- 「 strikethrough 」👉 Strikethrough text
- 「 fontMenu 」👉 Change font size and styles
- 「 textColorMenu 」👉 Change font color and background color 
- 「 alignMenu 」👉 Change font alignment
- 「 line 」👉 Make Horizontal line
- 「 olist 」👉 Create table of contents
- 「 quote 」👉 Make blockquote in sentences
- 「 ulist 」👉 Create numbered lists
- 「 filesMenu 」👉 Make file upload menus


<br>
<br>

### | onChange
<p>
    The onChange function is responsible for retrieving the values recorded in the text editor in real time.
</p>
<br>

```html
    <script>
        const myEditor = new EZ3D({
            
            element: editorElement,
            editorName: 'ez3d-content',
            onChange: function ( html, models ) {
                console.log(`datas: ${html}, models: ${models}`)
            },
            plugins: [{
                'threeModules': ThreeModules,
            }],

        });
    </script>
```
<br>

* `output`
<div align="center">
    <img src="https://github.com/webdoli/mogl3d-editor/assets/55019191/6cef9452-93e4-4d0e-9966-0107b52c6325" />
</div>

<br>
<br>

### | plugins
<p>
    As of version 1.1.2, the only available plugin is threeModules. To use the 3D source upload feature, you need to include this plugin as shown below.
</p>
<br>

```html
    <script>
        import { ThreeModules } from './plugin/threeModules.js';
        const myEditor = new EZ3D({
            // etc..
            plugins: [{
                'threeModules': ThreeModules,
            }],
        });
    </script>    
```
<p>
    ❗Note: As of version 1.1.2, 「threeModules」 need to import "ThreeModules" from './plugin/threeModules.js'
</p>

<br>



<br>
<br>
<br>

## 💡 Dev(API)
### | Output

<p>
    An example for saving data from a text editor to a server is as follows.
</p>

* `.getOutputData( ⓐ )`

<p>
    the result of `[ your editor (id:editor)node ].getOutputData( [your editor (id:editor)node] )` returns "code" & "files" values. 
    to transfer server these datas, 
        ① converting code to string
        ② files to blob 
</p>

<p>
❗Note: ⓐ is an instance of EZ3D. Since we declared new EZ3D() to the myEditor variable above, you should assign the myEditor variable as the value for ⓐ.
</p>
<p>
❗Note: The use of either 「async-await」 or 「promise」 syntax is mandatory
</p>
<br>

```html
    <script>
        document.getElementById('data-button').addEventListener('click', async (e) => {

            const outputDatas = await myEditor.getOutputData( myEditor );
            console.log('Output: ', outputDatas );

        });
    </script>
```

<p>
    <div align="center">
        <img src="https://github.com/webdoli/mogl3d-editor/assets/55019191/e7f1233a-6eb5-40ae-af31-6e546861b5fb" />
    </div>
</p>

<br>
<br>

### | Example 「Data(htlm, files) to Server & Server to HTML」
<p>
    The following complete code is an example related to receiving content from an editor and transmitting it to a server, or implementing content received from a server into the editor.
</p>
<br>

```html
    <html>
        <head>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css">
            <link rel="stylesheet" href="https://unpkg.com/browse/ez3d-editor@1.0.0/css/EZ3D-Editor.style.css">
            <script type="importmap">
                {
                    "imports": {
                        "three": "https://unpkg.com/three@0.159.0/build/three.module.min.js"
                    }
                }
            </script>
            <script src="https://unpkg.com/browse/ez3d-editor@1.0.0/lib/EZ3D-Editor.module.js"></script>
        </head>
        <body>

            <div id="editor" class="ez3d"></div>

            <div>
                <h3>Text output: <button id='publish-button'>Publish</button></h3>
                <div id="text-output"></div>
            </div>
    
            <div>
                <h3>HTML output: <button id='data-button'>Data</button></h3>
                <pre id="html-output" class="html-output"></pre>
            </div>

            <script type="module">
                import { ThreeModules } from 'https://unpkg.com/browse/ez3d-editor@1.0.0/plugins/EZ3D-Editor.plugin.three.js';
                import { OrbitControls } from 'https://unpkg.com/three@0.159.0/examples/jsm/controls/OrbitControls.js';
                import * as THREE from 'three';

                const editorElement = document.getElementById('editor');
                const myEditor = new EZ3D({
                    // actions:[
                    //     'italic',
                    //     'bold',
                    //     'fontMenu',
                    // ],
                    element: editorElement,
                    editorName: 'ez3d-content',
                    onChange: function ( html, models ) {
                        console.log(`datas: ${html}, models: ${models}`)
                        // document.getElementById('html-output').textContent = html;
                    },
                    plugins: [{
                        'threeModules': ThreeModules,
                    }]
                });


                // When transfer datas(html and files) to server..
                document.getElementById('data-button').addEventListener('click', async (e) => {
                    const outputDatas = await myEditor.getOutputData( myEditor );
                    console.log('Output: ', outputDatas );
                });


                // When receive datas(html & files) from server..
                document.getElementById('publish-button').addEventListener('click', e => {

                    const textOutputArea = document.querySelector('#text-output');
                    const contentNode = document.querySelector(`.${myEditor.editorName}`);
                    let models = myEditor.getModels();

                        textOutputArea.innerHTML = contentNode.innerHTML;

                        if( models ) {
                
                            models.map( model => {
                    
                                for( let item in model ) {
                        
                                    let node = textOutputArea.querySelector(`[title="${item}"]`);
                                    if( node.firstChild ) node.removeChild( node.firstChild );
                        
                                    let obj = model[item].clone();
                                    let threeModules = new ThreeModules({
                                        editor: document.querySelector('#editor')
                                    });
                            
                                    threeModules.init( node, obj );
                                }
                            }) // .map() End
                
                        } // if End

                }) // publis-button Evt End

        </script>

        </body>    
    </html>
```
<br>

<p>
    The getOutputData() method returns the following three outcomes.
     - 'code' : 「String」 HTML code within the text editor
     - 'files': 「Object」 3D files
     - 'scenes': 「Array」 Array of classes where the 3D file is embedded
</p>
<br>
<br>

## 💬 Dependency
* [FONT AWESOME](https://docs.fontawesome.com/web/style/basics/)
* [THREE.JS](https://github.com/mrdoob/three.js/)

<br>
<br>


## 🚀 Used by
* [MOGL3D](mogl3d.tistory.com)
* [MOGL3D Blog](mogl3d.tistory.com)

<br>
<br>


## 📜 License
This software is licensed under the MIT, ©CGHUB
