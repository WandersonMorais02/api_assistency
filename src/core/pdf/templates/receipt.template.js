export function renderReceiptTemplate(doc, payment) {
  doc.fontSize(18).text("RECIBO DE PAGAMENTO", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Código do pagamento: ${payment._id}`);
  doc.text(`Contexto: ${payment.context}`);
  doc.text(`Valor: R$ ${Number(payment.amount || 0).toFixed(2)}`);
  doc.text(`Método: ${payment.method}`);
  doc.text(`Status: ${payment.status}`);
  doc.text(`Pago em: ${payment.paidAt ? new Date(payment.paidAt).toLocaleString("pt-BR") : "-"}`);

  doc.moveDown();

  doc.text(`Observações: ${payment.notes || "-"}`);

  doc.moveDown(2);

  doc.text("Recebido por: ___________________________________");
  doc.moveDown();
  doc.text("Assinatura do cliente: __________________________");
}
