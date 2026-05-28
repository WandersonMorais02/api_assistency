import { MercadoPagoConfig, Preference, Payment as MercadoPagoPayment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const preferenceClient = new Preference(client);
const paymentClient = new MercadoPagoPayment(client);

export async function createMercadoPagoPreference({
  payment,
  title,
  description,
}) {
  const preference = await preferenceClient.create({
    body: {
      items: [
        {
          id: String(payment._id),
          title,
          description,
          quantity: 1,
          unit_price: Number(payment.amount),
          currency_id: "BRL",
        },
      ],
      external_reference: String(payment._id),
      notification_url: `${process.env.API_PUBLIC_URL}/api/payments/mercado-pago/webhook`,
      back_urls: {
        success: `${process.env.APP_WEB_URL}/admin/pagamentos?status=success`,
        failure: `${process.env.APP_WEB_URL}/admin/pagamentos?status=failure`,
        pending: `${process.env.APP_WEB_URL}/admin/pagamentos?status=pending`,
      },
      auto_return: "approved",
      metadata: {
        paymentId: String(payment._id),
        context: payment.context,
        relatedTo: String(payment.relatedTo),
      },
    },
  });

  return preference;
}

export async function getMercadoPagoPayment(paymentId) {
  return paymentClient.get({
    id: paymentId,
  });
}
