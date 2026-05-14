export function renderServiceOrderTemplate(doc, serviceOrder) {
  doc.fontSize(18).text("ORDEM DE SERVIÇO", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Protocolo: ${serviceOrder.protocol}`);
  doc.text(`Status: ${serviceOrder.status}`);
  doc.text(`Data: ${new Date(serviceOrder.createdAt).toLocaleString("pt-BR")}`);

  doc.moveDown();

  doc.fontSize(14).text("Cliente");
  doc.fontSize(12).text(`Nome: ${serviceOrder.client?.name || "-"}`);
  doc.text(`Telefone: ${serviceOrder.client?.phone || "-"}`);
  doc.text(`E-mail: ${serviceOrder.client?.email || "-"}`);

  doc.moveDown();

  doc.fontSize(14).text("Equipamento");
  doc.fontSize(12).text(`Tipo: ${serviceOrder.device?.deviceType?.name || "-"}`);
  doc.text(`Marca: ${serviceOrder.device?.brand || "-"}`);
  doc.text(`Modelo: ${serviceOrder.device?.model || "-"}`);
  doc.text(`IMEI/Série: ${serviceOrder.device?.imei || serviceOrder.device?.serialNumber || "-"}`);

  doc.moveDown();

  doc.fontSize(14).text("Problema relatado");
  doc.fontSize(12).text(serviceOrder.device?.reportedIssue || "-");

  doc.moveDown();

  doc.fontSize(14).text("Diagnóstico / Observações");
  doc.fontSize(12).text(serviceOrder.diagnosis || serviceOrder.internalNotes || "-");

  doc.moveDown();

  doc.fontSize(14).text("Valores");
  doc.fontSize(12).text(`Orçamento estimado: R$ ${Number(serviceOrder.estimatedBudget || 0).toFixed(2)}`);
  doc.text(`Valor final: R$ ${Number(serviceOrder.finalPrice || 0).toFixed(2)}`);

  doc.moveDown(2);

  doc.text("Assinatura do cliente: ___________________________________");
  doc.moveDown();
  doc.text("Assinatura da assistência: _______________________________");
}
