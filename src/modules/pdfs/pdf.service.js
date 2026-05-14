import PDFDocument from "pdfkit";

import { ServiceOrder } from "../service-orders/service-order.model.js";
import { Payment } from "../payments/payment.model.js";

import { AppError } from "../../core/errors/app-error.js";

import { renderServiceOrderTemplate } from "../../core/pdf/templates/service-order.template.js";
import { renderReceiptTemplate } from "../../core/pdf/templates/receipt.template.js";

function createPdfBuffer(renderFn) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const chunks = [];

    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    renderFn(doc);

    doc.end();
  });
}

export async function generateServiceOrderPdf(id) {
  const serviceOrder = await ServiceOrder.findById(id)
    .populate("client")
    .populate({
      path: "device",
      populate: {
        path: "deviceType",
      },
    })
    .populate("technician", "name email role");

  if (!serviceOrder) {
    throw new AppError("Ordem de serviço não encontrada", 404);
  }

  const buffer = await createPdfBuffer(doc => {
    renderServiceOrderTemplate(doc, serviceOrder);
  });

  return {
    filename: `ordem-servico-${serviceOrder.protocol}.pdf`,
    buffer,
  };
}

export async function generateReceiptPdf(id) {
  const payment = await Payment.findById(id).populate(
    "receivedBy",
    "name email role"
  );

  if (!payment) {
    throw new AppError("Pagamento não encontrado", 404);
  }

  const buffer = await createPdfBuffer(doc => {
    renderReceiptTemplate(doc, payment);
  });

  return {
    filename: `recibo-${payment._id}.pdf`,
    buffer,
  };
}
