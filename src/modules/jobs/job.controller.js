import {
  createJob,
  listJobs,
  findJobById,
  updateJob,
  deleteJob,
  applyToJob,
  updateApplicationStatus,
} from "./job.service.js";

export async function create(req, res, next) {
  try {
    const job = await createJob(req.validated.body);
    return res.status(201).json(job);
  } catch (error) {
    return next(error);
  }
}

export async function index(req, res, next) {
  try {
    const jobs = await listJobs(req.query);

    return res.json(jobs);
  } catch (error) {
    return next(error);
  }
}

export async function show(req, res, next) {
  try {
    const job = await findJobById(req.params.id);
    return res.json(job);
  } catch (error) {
    return next(error);
  }
}

export async function update(req, res, next) {
  try {
    const job = await updateJob(req.params.id, req.validated.body);
    return res.json(job);
  } catch (error) {
    return next(error);
  }
}

export async function remove(req, res, next) {
  try {
    const job = await deleteJob(req.params.id);
    return res.json(job);
  } catch (error) {
    return next(error);
  }
}

export async function apply(req, res, next) {
  try {
    const job = await applyToJob(req.params.id, req.validated.body);
    return res.status(201).json(job);
  } catch (error) {
    return next(error);
  }
}

export async function updateApplication(req, res, next) {
  try {
    const job = await updateApplicationStatus({
      jobId: req.params.jobId,
      applicationId: req.params.applicationId,
      status: req.validated.body.status,
    });

    return res.json(job);
  } catch (error) {
    return next(error);
  }
}
