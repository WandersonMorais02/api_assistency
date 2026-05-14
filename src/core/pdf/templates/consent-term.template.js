export function renderConsentTermTemplate(
  doc,
  serviceOrder,
  company
) {
  doc.fontSize(20).text(
    "TERMO DE CONSENTIMENTO E ENTRADA",
    {
      align: "center",
    }
  );

  doc.moveDown(2);

  /*
  |--------------------------------------------------------------------------
  | EMPRESA
  |--------------------------------------------------------------------------
  */

  doc.fontSize(14).text("DADOS DA ASSISTÊNCIA");

  doc.moveDown(0.5);

  doc.fontSize(11);

  doc.text(`Empresa: ${company?.name || "-"}`);

  doc.text(`Documento: ${company?.document || "-"}`);

  doc.text(`Telefone: ${company?.phone || "-"}`);

  doc.text(`WhatsApp: ${company?.whatsapp || "-"}`);

  doc.text(`E-mail: ${company?.email || "-"}`);

  if (company?.address) {
    doc.text(
      `Endereço: ${company.address.street || "-"}, ${
        company.address.number || "-"
      } - ${company.address.neighborhood || "-"}`
    );

    doc.text(
      `${company.address.city || "-"} / ${
        company.address.state || "-"
      } - CEP: ${company.address.zipCode || "-"}`
    );
  }

  doc.moveDown();

  /*
  |--------------------------------------------------------------------------
  | CLIENTE
  |--------------------------------------------------------------------------
  */

  doc.fontSize(14).text("DADOS DO CLIENTE");

  doc.moveDown(0.5);

  doc.fontSize(11);

  doc.text(`Nome: ${serviceOrder.client?.name || "-"}`);

  doc.text(`Telefone: ${serviceOrder.client?.phone || "-"}`);

  doc.text(`E-mail: ${serviceOrder.client?.email || "-"}`);

  doc.text(`CPF: ${serviceOrder.client?.cpf || "-"}`);

  doc.moveDown();

  /*
  |--------------------------------------------------------------------------
  | EQUIPAMENTO
  |--------------------------------------------------------------------------
  */

  doc.fontSize(14).text("DADOS DO EQUIPAMENTO");

  doc.moveDown(0.5);

  doc.fontSize(11);

  doc.text(
    `Tipo: ${
      serviceOrder.device?.deviceType?.name || "-"
    }`
  );

  doc.text(
    `Marca: ${serviceOrder.device?.brand || "-"}`
  );

  doc.text(
    `Modelo: ${serviceOrder.device?.model || "-"}`
  );

  doc.text(
    `IMEI: ${serviceOrder.device?.imei || "-"}`
  );

  doc.text(
    `Número de Série: ${
      serviceOrder.device?.serialNumber || "-"
    }`
  );

  doc.text(
    `Cor: ${serviceOrder.device?.color || "-"}`
  );

  doc.moveDown();

  /*
  |--------------------------------------------------------------------------
  | CONDIÇÕES
  |--------------------------------------------------------------------------
  */

  doc.fontSize(14).text("CONDIÇÕES DO APARELHO");

  doc.moveDown(0.5);

  doc.fontSize(11);

  doc.text(
    `Problema relatado: ${
      serviceOrder.device?.reportedIssue || "-"
    }`
  );

  doc.moveDown(0.5);

  doc.text(
    `Condição física: ${
      serviceOrder.device?.physicalCondition || "-"
    }`
  );

  doc.moveDown(0.5);

  doc.text(
    `Observações: ${
      serviceOrder.device?.observations || "-"
    }`
  );

  doc.moveDown(0.5);

  doc.text(
    `Acessórios entregues: ${
      serviceOrder.device?.accessories?.length
        ? serviceOrder.device.accessories.join(", ")
        : "-"
    }`
  );

  doc.moveDown();

  /*
  |--------------------------------------------------------------------------
  | TERMOS
  |--------------------------------------------------------------------------
  */

  doc.fontSize(14).text("TERMO DE RESPONSABILIDADE");

  doc.moveDown(0.5);

  doc.fontSize(11);

  doc.text(
    "Declaro que entrego o equipamento acima descrito para análise e/ou manutenção técnica."
  );

  doc.moveDown(0.5);

  doc.text(
    "Autorizo a assistência técnica a realizar testes, desmontagem e procedimentos necessários para diagnóstico e reparo."
  );

  doc.moveDown(0.5);

  doc.text(
    "Estou ciente de que aparelhos com sinais de queda, oxidação, violação, curto, líquidos ou danos severos podem apresentar falhas irreversíveis."
  );

  doc.moveDown(0.5);

  doc.text(
    "Também estou ciente de que pode ocorrer perda de dados durante procedimentos técnicos, sendo de minha responsabilidade manter backup."
  );

  doc.moveDown(0.5);

  doc.text(
    "Após aprovação do orçamento e conclusão do serviço, o prazo máximo para retirada do aparelho é de 90 dias."
  );

  doc.moveDown(2);

  /*
  |--------------------------------------------------------------------------
  | ASSINATURAS
  |--------------------------------------------------------------------------
  */

  doc.text(
    "________________________________________"
  );

  doc.text("Assinatura do Cliente");

  doc.moveDown(2);

  doc.text(
    "________________________________________"
  );

  doc.text("Assinatura da Assistência");

  doc.moveDown(2);

  doc.fontSize(10).text(
    `Protocolo: ${serviceOrder.protocol}`,
    {
      align: "right",
    }
  );

  doc.text(
    `Emitido em: ${new Date().toLocaleString(
      "pt-BR"
    )}`,
    {
      align: "right",
    }
  );
}
