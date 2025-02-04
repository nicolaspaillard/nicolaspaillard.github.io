import barcodes from "./barcodes/index";
import checkbox from "./checkbox/index";
import date from "./date/date";
import dateTime from "./date/dateTime";
import time from "./date/time";
import image from "./graphics/image";
import svg from "./graphics/svg";
import link from "./link/link";
import multiVariableText from "./multiVariableText/index";
import radioGroup from "./radioGroup/index";
import select from "./select/index";
import line from "./shapes/line";
import { ellipse, rectangle } from "./shapes/rectAndEllipse";
import table from "./tables/index";
import text from "./text/index";

const builtInPlugins = { Text: text };

export {
  barcodes,
  builtInPlugins,
  checkbox,
  date,
  dateTime,
  ellipse,
  image,
  line,
  link,
  multiVariableText,
  radioGroup,
  rectangle,
  select,
  svg,
  table,
  // schemas
  text,
  time,
};
