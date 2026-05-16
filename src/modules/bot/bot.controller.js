import {
  createOrUpdateIntent,
  trainToken,
  trainAnswer,
  validateTokenRelation,
  rejectTokenRelation,
  approveTraining,

  listIntents,
  listTokens,
  listAnswers,
  listRelations,
  listTrainings,
} from "../../core/bot/trainer-engine.js";

export async function upsertIntent(req, res, next) {
  try {
    const intent = await createOrUpdateIntent(req.validated.body);

    return res.status(201).json(intent);
  } catch (error) {
    return next(error);
  }
}

export async function createTokenTraining(req, res, next) {
  try {
    const token = await trainToken({
      ...req.validated.body,
      userId: req.user.id,
    });

    return res.status(201).json(token);
  } catch (error) {
    return next(error);
  }
}

export async function createAnswerTraining(req, res, next) {
  try {
    const answer = await trainAnswer({
      ...req.validated.body,
      userId: req.user.id,
    });

    return res.status(201).json(answer);
  } catch (error) {
    return next(error);
  }
}

export async function validateRelation(req, res, next) {
  try {
    const relation = await validateTokenRelation({
      relationId: req.params.id,
      similarity: req.validated.body.similarity,
    });

    return res.json(relation);
  } catch (error) {
    return next(error);
  }
}

export async function rejectRelation(req, res, next) {
  try {
    const relation = await rejectTokenRelation(req.params.id);

    return res.json(relation);
  } catch (error) {
    return next(error);
  }
}

export async function approveTrainingLog(req, res, next) {
  try {
    const training = await approveTraining({
      trainingId: req.params.id,
      ...req.validated.body,
      userId: req.user.id,
    });

    return res.json(training);
  } catch (error) {
    return next(error);
  }
}

export async function indexIntents(req, res, next) {
  try {
    const intents = await listIntents();
    return res.json(intents);
  } catch (error) {
    return next(error);
  }
}

export async function indexTokens(req, res, next) {
  try {
    const tokens = await listTokens();
    return res.json(tokens);
  } catch (error) {
    return next(error);
  }
}

export async function indexAnswers(req, res, next) {
  try {
    const answers = await listAnswers();
    return res.json(answers);
  } catch (error) {
    return next(error);
  }
}

export async function indexRelations(req, res, next) {
  try {
    const relations = await listRelations();
    return res.json(relations);
  } catch (error) {
    return next(error);
  }
}

export async function indexTrainings(req, res, next) {
  try {
    const trainings = await listTrainings();
    return res.json(trainings);
  } catch (error) {
    return next(error);
  }
}
