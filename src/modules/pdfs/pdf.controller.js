import {
  generateServiceOrderPdf,
  generateReceiptPdf,
} from "./pdf.service.js";

export async function serviceOrderPdf(req, res, next) {
  try {
    const { filename, buffer } = await generateServiceOrderPdf(req.params.id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${filename}"`
    );

    return res.send(buffer);
  } catch (error) {
    return next(error);
  }
}

export async function receiptPdf(req, res, next) {
  try {
    const { filename, buffer } = await generateReceiptPdf(req.params.id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${filename}"`
    );

    return res.send(buffer);
  } catch (error) {
    return next(error);
  }
}
