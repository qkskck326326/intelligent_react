// import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
// import {
//   toWidget,
//   toWidgetEditable,
// } from "@ckeditor/ckeditor5-widget/src/utils";

// class MyCustomPlugin extends Plugin {
//   init() {
//     const editor = this.editor;

//     // Conversion for upcast (view -> model)
//     editor.conversion.for("upcast").elementToElement({
//       view: {
//         name: "oembed",
//         attributes: {
//           url: true,
//         },
//       },
//       model: (viewElement, { writer: modelWriter }) => {
//         const url = viewElement.getAttribute("url");
//         const embedUrl = url.includes("youtube.com/shorts")
//           ? url.replace("youtube.com/shorts", "youtube.com/embed")
//           : url;
//         return modelWriter.createElement("media", { url: embedUrl });
//       },
//     });

//     // Conversion for downcast (model -> view)
//     editor.conversion.for("downcast").elementToElement({
//       model: "media",
//       view: (modelElement, { writer: viewWriter }) => {
//         const url = modelElement.getAttribute("url");
//         return viewWriter.createContainerElement("oembed", { url });
//       },
//     });
//   }
// }

// export default MyCustomPlugin;
