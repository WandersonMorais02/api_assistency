import { Client } from "../clients/client.model.js";
import { Device } from "../devices/device.model.js";
import { ServiceOrder } from "../service-orders/service-order.model.js";
import { Product } from "../products/product.model.js";
import { Job } from "../jobs/job.model.js";
import { Order } from "../orders/order.model.js";
import { Payment } from "../payments/payment.model.js";

export async function getDashboardSummary() {
  const [
    totalClients,
    totalDevices,

    totalProducts,
    publishedProducts,

    totalServiceOrders,
    receivedOrders,
    inAnalysisOrders,
    waitingApprovalOrders,
    approvedOrders,
    inRepairOrders,
    completedOrders,
    deliveredOrders,
    canceledOrders,

    activeJobs,
    jobs,

    totalOrders,
    paidOrders,

    payments,
  ] = await Promise.all([
    Client.countDocuments({ isActive: true }),

    Device.countDocuments({ isActive: true }),

    Product.countDocuments({ isActive: true }),

    Product.countDocuments({
      isActive: true,
      isPublished: true,
    }),

    ServiceOrder.countDocuments({ isActive: true }),

    ServiceOrder.countDocuments({
      isActive: true,
      status: "RECEIVED",
    }),

    ServiceOrder.countDocuments({
      isActive: true,
      status: "IN_ANALYSIS",
    }),

    ServiceOrder.countDocuments({
      isActive: true,
      status: "WAITING_APPROVAL",
    }),

    ServiceOrder.countDocuments({
      isActive: true,
      status: "APPROVED",
    }),

    ServiceOrder.countDocuments({
      isActive: true,
      status: "IN_REPAIR",
    }),

    ServiceOrder.countDocuments({
      isActive: true,
      status: "COMPLETED",
    }),

    ServiceOrder.countDocuments({
      isActive: true,
      status: "DELIVERED",
    }),

    ServiceOrder.countDocuments({
      isActive: true,
      status: "CANCELED",
    }),

    Job.countDocuments({
      isActive: true,
      isPublished: true,
    }),

    Job.find({
      isActive: true,
      isPublished: true,
    })
      .select("applications")
      .lean(),

    Order.countDocuments({
      isActive: true,
    }),

    Order.countDocuments({
      isActive: true,
      paymentStatus: "PAID",
    }),

    Payment.find({
      isActive: true,
      status: "PAID",
    })
      .select("amount")
      .lean(),
  ]);

  const totalApplications = jobs.reduce((total, job) => {
    return total + job.applications.length;
  }, 0);

  const pendingApplications = jobs.reduce((total, job) => {
    return (
      total +
      job.applications.filter(
        app => app.status === "PENDING"
      ).length
    );
  }, 0);

  const totalRevenue = payments.reduce((total, payment) => {
    return total + payment.amount;
  }, 0);

  return {
    clients: {
      total: totalClients,
    },

    devices: {
      total: totalDevices,
    },

    products: {
      total: totalProducts,
      published: publishedProducts,
    },

    serviceOrders: {
      total: totalServiceOrders,

      received: receivedOrders,
      inAnalysis: inAnalysisOrders,
      waitingApproval: waitingApprovalOrders,
      approved: approvedOrders,
      inRepair: inRepairOrders,
      completed: completedOrders,
      delivered: deliveredOrders,
      canceled: canceledOrders,
    },

    jobs: {
      active: activeJobs,
      totalApplications,
      pendingApplications,
    },

    orders: {
      total: totalOrders,
      paid: paidOrders,
    },

    finance: {
      totalRevenue,
    },
  };
}
