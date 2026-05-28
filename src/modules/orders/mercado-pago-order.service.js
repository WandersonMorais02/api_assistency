import {
  MercadoPagoConfig,
  Preference,
  Payment as MercadoPagoPayment,
} from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const preferenceClient = new Preference(client);
const paymentClient = new MercadoPagoPayment(client);

export async function createOrderPreference(order) {
  const preference = await preferenceClient.create({
    body: {
      items: order.items.map((item) => ({
        id: String(item.product),
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.unitPrice),
        currency_id: "BRL",
      })),

      payer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: {
          number: order.customerPhone,
        },
        address: order.shippingAddress
          ? {
              zip_code: order.shippingAddress.zipCode,
              street_name: order.shippingAddress.street,
              street_number: order.shippingAddress.number,
            }
          : undefined,
      },

      shipments: order.shippingAddress
        ? {
            receiver_address: {
              zip_code: order.shippingAddress.zipCode,
              street_name: order.shippingAddress.street,
              street_number: order.shippingAddress.number,
              floor: order.shippingAddress.complement,
              apartment: order.shippingAddress.neighborhood,
              city_name: order.shippingAddress.city,
              state_name: order.shippingAddress.state,
            },
          }
        : undefined,

      external_reference: String(order._id),

      notification_url: `${process.env.API_PUBLIC_URL}/api/orders/mercado-pago/webhook`,

      back_urls: {
        success: `${process.env.APP_WEB_URL}/pedido/sucesso/${order._id}`,
        failure: `${process.env.APP_WEB_URL}/pedido/falha/${order._id}`,
        pending: `${process.env.APP_WEB_URL}/pedido/pendente/${order._id}`,
      },

      auto_return: "approved",

      metadata: {
        orderId: String(order._id),
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
