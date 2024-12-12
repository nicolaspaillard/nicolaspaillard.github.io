import { PDFRenderProps, Plugin } from "@pdfme/common";
import { PDFString } from "@pdfme/pdf-lib";
import { Link } from "lucide";
import text from "../text";
import { pdfRender as parentPdfRender } from "../text/pdfRender";
import { TextSchema } from "../text/types";
import { convertForPdfLayoutProps, createSvgStr } from "../utils";

// inputs : ["text","url"]

export interface LinkSchema extends TextSchema {
  url: string;
}

export const link: Plugin<LinkSchema> = {
  ui: text.ui,
  pdf: async (arg: PDFRenderProps<LinkSchema>) => {
    const { value, pdfDoc, schema, page, ...rest } = arg;
    const pageHeight = page.getHeight();
    const {
      width,
      height,
      position: { x, y },
    } = convertForPdfLayoutProps({ schema, pageHeight, applyRotateTranslate: false });
    const values: string[][] = JSON.parse(value);
    page.node.addAnnot(
      pdfDoc.context.register(
        pdfDoc.context.obj({
          Type: "Annot",
          Subtype: "Link",
          Rect: [x, y, x + width, y + height],
          // Border: [0, 0, 0],
          // border color
          // C: [0, 0, 1],
          // URI action
          A: {
            Type: "Action",
            S: "URI",
            URI: PDFString.of(values[0][1]),
            target: "_blank",
          },
        }),
      ),
    );
    const renderArgs = {
      value: values[0][0],
      pdfDoc: pdfDoc,
      schema,
      page: page,
      ...rest,
    };

    await parentPdfRender(renderArgs);
  },
  propPanel: {
    schema: text.propPanel.schema,
    defaultSchema: {
      ...text.propPanel.defaultSchema,
      rotate: undefined,
      type: "link",
      url: "",
    },
  },
  icon: createSvgStr(Link),
};

export default link;
